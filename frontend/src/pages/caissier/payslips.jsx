import * as React from "react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  FileText,
  Euro,
  Calendar,
  MoreHorizontal,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  CreditCard,
  DollarSign
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PaymentForm } from "@/components/admin/PaymentForm"

const CaissierPayslips = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [paymentDialog, setPaymentDialog] = useState({ open: false, payslipId: null })

  // Fetch payslips
  const { data: payslipsData = [], isLoading, error } = useQuery({
    queryKey: ['payslips', user?.entrepriseId],
    queryFn: () => apiClient.getPayslips({ entrepriseId: user?.entrepriseId }),
    enabled: !!user,
  })

  const columns = [
    {
      key: 'employee',
      title: 'Employé',
      render: (value, row) => {
        const fullName = `${row.employee.firstName} ${row.employee.lastName}`;
        return (
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              {fullName.split(' ').map((n) => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{fullName}</p>
              <p className="text-sm text-muted-foreground">{row.employee.position}</p>
            </div>
          </div>
        );
      }
    },
    {
      key: 'cycle',
      title: 'Période',
      render: (value, row) => (
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.cycle.period}</span>
        </div>
      )
    },
    {
      key: 'netSalary',
      title: 'Montant Net',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Euro className="h-4 w-4 text-success" />
          <span className="font-bold text-success">€{value?.toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Statut Paiement',
      render: (value) => (
        <Badge
          variant={
            value === 'PAYE' ? 'default' :
            value === 'EN_ATTENTE' ? 'secondary' :
            'destructive'
          }
        >
          {value === 'PAYE' ? (
            <><CheckCircle className="mr-1 h-3 w-3" />Payé</>
          ) : value === 'EN_ATTENTE' ? (
            <><Clock className="mr-1 h-3 w-3" />En attente</>
          ) : (
            <><AlertCircle className="mr-1 h-3 w-3" />Erreur</>
          )}
        </Badge>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Voir détails
            </DropdownMenuItem>
            {row.status !== 'PAYE' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setPaymentDialog({ open: true, payslipId: row.id })}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Traiter le paiement
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  const filteredData = payslipsData.filter(payslip => {
    const employeeName = `${payslip.employee.firstName} ${payslip.employee.lastName}`.toLowerCase()
    const matchesSearch = employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payslip.employee.position.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "pending" && payslip.status === 'EN_ATTENTE') ||
      (statusFilter === "paid" && payslip.status === 'PAYE') ||
      (statusFilter === "error" && payslip.status !== 'PAYE' && payslip.status !== 'EN_ATTENTE')

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: payslipsData.length,
    paid: payslipsData.filter(p => p.status === 'PAYE').length,
    pending: payslipsData.filter(p => p.status === 'EN_ATTENTE').length,
    error: payslipsData.filter(p => p.status !== 'PAYE' && p.status !== 'EN_ATTENTE').length,
    urgent: payslipsData.filter(p => {
      // Consider urgent if created more than 30 days ago and not paid
      const daysSinceCreation = (new Date() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24)
      return daysSinceCreation > 30 && p.status !== 'PAYE'
    }).length,
    totalToPay: payslipsData
      .filter(p => p.status !== 'PAYE')
      .reduce((sum, p) => sum + (p.netSalary || 0), 0),
    totalPaid: payslipsData
      .filter(p => p.status === 'PAYE')
      .reduce((sum, p) => sum + (p.netSalary || 0), 0)
  }

  // Error handling
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-muted rounded"></div>
            <div className="h-4 w-48 bg-muted rounded mt-2"></div>
          </div>
          <div className="h-10 w-40 bg-muted rounded"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-5 w-20 bg-muted rounded mb-2"></div>
                <div className="h-8 w-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="h-6 w-32 bg-muted rounded"></div>
                <div className="h-4 w-64 bg-muted rounded mt-2"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-10 w-64 bg-muted rounded"></div>
                <div className="h-10 w-32 bg-muted rounded"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-32 bg-muted rounded"></div>
                    <div className="h-3 w-24 bg-muted rounded"></div>
                  </div>
                  <div className="h-4 w-16 bg-muted rounded"></div>
                  <div className="h-4 w-12 bg-muted rounded"></div>
                  <div className="h-8 w-8 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulletins de Paie</h1>
          <p className="text-muted-foreground">
            Gestion des paiements et suivi des versements
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" icon={<CreditCard className="h-4 w-4" />}>
            Traiter les urgents
          </Button>
          <Button variant="gradient" icon={<DollarSign className="h-4 w-4" />}>
            Nouveau paiement
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-2xl font-bold text-success">{stats.paid}</p>
                <p className="text-sm text-muted-foreground">Payés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-warning" />
              <div>
                <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-destructive">{stats.error}</p>
                <p className="text-sm text-muted-foreground">Erreurs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              <div>
                <p className="text-2xl font-bold text-destructive">{stats.urgent}</p>
                <p className="text-sm text-muted-foreground">Urgents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Euro className="h-5 w-5 text-warning" />
              <div>
                <p className="text-lg font-bold text-warning">€{stats.totalToPay.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">À payer</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Euro className="h-5 w-5 text-success" />
              <div>
                <p className="text-lg font-bold text-success">€{stats.totalPaid.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Payé</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Alert */}
      {stats.urgent > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Attention - Paiements Urgents</span>
            </CardTitle>
            <CardDescription>
              {stats.urgent} bulletin{stats.urgent > 1 ? 's' : ''} nécessite{stats.urgent > 1 ? 'nt' : ''} un traitement immédiat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Des paiements sont en retard ou arrivent à échéance aujourd'hui
              </p>
              <Button variant="destructive" size="sm">
                Traiter maintenant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payslips Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des Bulletins</CardTitle>
              <CardDescription>
                {filteredData.length} bulletin{filteredData.length > 1 ? 's' : ''} trouvé{filteredData.length > 1 ? 's' : ''} - Focus sur les paiements
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un employé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="paid">Payés</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="normal">Normale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredData}
            emptyMessage="Aucun bulletin de paie trouvé"
            loading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog.open} onOpenChange={(open) => setPaymentDialog({ open, payslipId: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enregistrer un paiement</DialogTitle>
            <DialogDescription>
              Saisissez les informations du paiement pour ce bulletin.
            </DialogDescription>
          </DialogHeader>
          {paymentDialog.payslipId && (
            <PaymentForm
              payslipId={paymentDialog.payslipId}
              onSuccess={() => {
                setPaymentDialog({ open: false, payslipId: null })
                queryClient.invalidateQueries({ queryKey: ['payslips', user?.entrepriseId] })
              }}
              onCancel={() => setPaymentDialog({ open: false, payslipId: null })}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CaissierPayslips