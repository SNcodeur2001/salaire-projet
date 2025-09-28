import * as React from "react"
import { useState } from "react"
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

const CaissierPayslips = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const columns = [
    { 
      key: 'employee', 
      title: 'Employé',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            {value.split(' ').map((n) => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-sm text-muted-foreground">{row.position}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'period', 
      title: 'Période',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      )
    },
    { 
      key: 'netSalary', 
      title: 'Montant Net',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Euro className="h-4 w-4 text-success" />
          <span className="font-bold text-success">€{value.toLocaleString()}</span>
        </div>
      )
    },
    { 
      key: 'dueDate', 
      title: 'Échéance',
      render: (value, row) => (
        <span className={`text-sm ${
          row.urgent ? 'text-destructive font-medium' : 
          row.priority === 'high' ? 'text-warning font-medium' : ''
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'paymentStatus', 
      title: 'Statut Paiement',
      render: (value) => (
        <Badge 
          variant={
            value === 'paid' ? 'default' : 
            value === 'pending' ? 'secondary' : 
            'destructive'
          }
        >
          {value === 'paid' ? (
            <><CheckCircle className="mr-1 h-3 w-3" />Payé</>
          ) : value === 'pending' ? (
            <><Clock className="mr-1 h-3 w-3" />En attente</>
          ) : (
            <><AlertCircle className="mr-1 h-3 w-3" />Erreur</>
          )}
        </Badge>
      )
    },
    { 
      key: 'priority', 
      title: 'Priorité',
      render: (value) => (
        <Badge 
          variant={
            value === 'urgent' ? 'destructive' : 
            value === 'high' ? 'secondary' : 
            'outline'
          }
        >
          {value === 'urgent' ? 'Urgent' : 
           value === 'high' ? 'Élevée' : 
           'Normale'}
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
            {row.paymentStatus !== 'paid' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
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

  const payslipsData = [
    {
      employee: 'Sophie Leroy',
      position: 'Designer UX/UI',
      period: 'Février 2024',
      netSalary: 2950,
      dueDate: 'Aujourd\'hui',
      paymentStatus: 'pending',
      priority: 'urgent',
      urgent: true,
      paymentMethod: 'virement'
    },
    {
      employee: 'Jean Moreau',
      position: 'Développeur Junior',
      period: 'Février 2024',
      netSalary: 2280,
      dueDate: 'Demain',
      paymentStatus: 'pending',
      priority: 'high',
      urgent: false,
      paymentMethod: 'virement'
    },
    {
      employee: 'Thomas Garcia',
      position: 'Stagiaire Marketing',
      period: 'Février 2024',
      netSalary: 515,
      dueDate: '2 jours',
      paymentStatus: 'pending',
      priority: 'normal',
      urgent: false,
      paymentMethod: 'cheque'
    },
    {
      employee: 'Julien Simon',
      position: 'Support Technique',
      period: 'Février 2024',
      netSalary: 2020,
      dueDate: '3 jours',
      paymentStatus: 'pending',
      priority: 'normal',
      urgent: false,
      paymentMethod: 'virement'
    },
    {
      employee: 'Émilie Laurent',
      position: 'Comptable',
      period: 'Février 2024',
      netSalary: 2450,
      dueDate: 'En retard',
      paymentStatus: 'error',
      priority: 'urgent',
      urgent: true,
      paymentMethod: 'virement'
    },
    {
      employee: 'Marie Dubois',
      position: 'Développeuse Senior',
      period: 'Février 2024',
      netSalary: 3420,
      dueDate: '01/03/2024',
      paymentStatus: 'paid',
      priority: 'normal',
      urgent: false,
      paymentMethod: 'virement'
    },
    {
      employee: 'Pierre Martin',
      position: 'Chef de Projet',
      period: 'Février 2024',
      netSalary: 3900,
      dueDate: '01/03/2024',
      paymentStatus: 'paid',
      priority: 'normal',
      urgent: false,
      paymentMethod: 'virement'
    },
    {
      employee: 'Claire Bernard',
      position: 'Analyste Business',
      period: 'Février 2024',
      netSalary: 3200,
      dueDate: '01/03/2024',
      paymentStatus: 'paid',
      priority: 'normal',
      urgent: false,
      paymentMethod: 'virement'
    },
    {
      employee: 'Nicolas Petit',
      position: 'DevOps Engineer',
      period: 'Février 2024',
      netSalary: 3650,
      dueDate: '01/03/2024',
      paymentStatus: 'paid',
      priority: 'normal',
      urgent: false,
      paymentMethod: 'virement'
    },
    {
      employee: 'Isabelle Roux',
      position: 'Responsable RH',
      period: 'Février 2024',
      netSalary: 4180,
      dueDate: '01/03/2024',
      paymentStatus: 'paid',
      priority: 'normal',
      urgent: false,
      paymentMethod: 'cheque'
    }
  ]

  const filteredData = payslipsData.filter(payslip => {
    const matchesSearch = payslip.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payslip.position.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || payslip.paymentStatus === statusFilter
    const matchesPriority = priorityFilter === "all" || payslip.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: payslipsData.length,
    paid: payslipsData.filter(p => p.paymentStatus === 'paid').length,
    pending: payslipsData.filter(p => p.paymentStatus === 'pending').length,
    error: payslipsData.filter(p => p.paymentStatus === 'error').length,
    urgent: payslipsData.filter(p => p.priority === 'urgent').length,
    totalToPay: payslipsData
      .filter(p => p.paymentStatus !== 'paid')
      .reduce((sum, p) => sum + p.netSalary, 0),
    totalPaid: payslipsData
      .filter(p => p.paymentStatus === 'paid')
      .reduce((sum, p) => sum + p.netSalary, 0)
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
                  <SelectItem value="error">Erreurs</SelectItem>
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
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default CaissierPayslips