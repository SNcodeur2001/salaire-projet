import * as React from "react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  FileText,
  Download,
  Euro,
  Calendar,
  Users,
  MoreHorizontal,
  Edit,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Mail,
  Printer
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

const AdminPayslips = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [monthFilter, setMonthFilter] = useState("all")

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
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            {row.employee.firstName[0] + row.employee.lastName[0]}
          </div>
          <div>
            <p className="font-medium">{row.employee.firstName} {row.employee.lastName}</p>
            <p className="text-sm text-muted-foreground">{row.employee.position}</p>
          </div>
        </div>
      )
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
      key: 'grossSalary',
      title: 'Salaire Brut',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Euro className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">€{value.toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'deductions',
      title: 'Charges',
      render: (value) => (
        <span className="text-destructive font-medium">-€{value.toLocaleString()}</span>
      )
    },
    {
      key: 'netSalary',
      title: 'Salaire Net',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Euro className="h-4 w-4 text-success" />
          <span className="font-bold text-success">€{value.toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Paiement',
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
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Télécharger PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Envoyer par email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]



  const filteredData = payslipsData.filter(payslip => {
    const employeeName = `${payslip.employee.firstName} ${payslip.employee.lastName}`.toLowerCase()
    const matchesSearch = employeeName.includes(searchTerm.toLowerCase()) ||
                         payslip.employee.position.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payslip.status === statusFilter
    const matchesMonth = monthFilter === "all" || payslip.cycle.period.toLowerCase().includes(monthFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesMonth
  })

  const stats = {
    total: payslipsData.length,
    paid: payslipsData.filter(p => p.status === 'PAYE').length,
    pending: payslipsData.filter(p => p.status === 'EN_ATTENTE').length,
    error: payslipsData.filter(p => p.status !== 'PAYE' && p.status !== 'EN_ATTENTE').length,
    totalGross: payslipsData.reduce((sum, p) => sum + (p.grossSalary || 0), 0),
    totalNet: payslipsData.reduce((sum, p) => sum + (p.netSalary || 0), 0),
    totalDeductions: payslipsData.reduce((sum, p) => sum + (p.deductions || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulletins de Paie</h1>
          <p className="text-muted-foreground">
            Gestion et suivi des bulletins de salaire
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" icon={<Download className="h-4 w-4" />}>
            Export Excel
          </Button>
          <Button variant="gradient" icon={<FileText className="h-4 w-4" />}>
            Générer bulletins
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
              <Euro className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xl font-bold">€{stats.totalGross.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Brut total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-destructive" />
              <div>
                <p className="text-xl font-bold text-destructive">€{stats.totalDeductions.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Charges</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Euro className="h-5 w-5 text-success" />
              <div>
                <p className="text-xl font-bold text-success">€{stats.totalNet.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Net total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des Bulletins</CardTitle>
              <CardDescription>
                {filteredData.length} bulletin{filteredData.length > 1 ? 's' : ''} trouvé{filteredData.length > 1 ? 's' : ''}
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
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="février">Février 2024</SelectItem>
                  <SelectItem value="janvier">Janvier 2024</SelectItem>
                  <SelectItem value="décembre">Décembre 2023</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="PAYE">Payés</SelectItem>
                  <SelectItem value="EN_ATTENTE">En attente</SelectItem>
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
    </div>
  )
}

export default AdminPayslips
