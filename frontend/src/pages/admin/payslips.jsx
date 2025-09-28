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
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [monthFilter, setMonthFilter] = useState("all")

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
      key: 'paymentStatus',
      title: 'Paiement',
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

  const payslipsData = [
    {
      employee: 'Marie Dubois',
      position: 'Développeuse Senior',
      period: 'Février 2024',
      grossSalary: 4500,
      deductions: 1080,
      netSalary: 3420,
      paymentStatus: 'paid',
      paymentDate: '2024-03-01'
    },
    {
      employee: 'Pierre Martin',
      position: 'Chef de Projet',
      period: 'Février 2024',
      grossSalary: 5200,
      deductions: 1300,
      netSalary: 3900,
      paymentStatus: 'paid',
      paymentDate: '2024-03-01'
    },
    {
      employee: 'Sophie Leroy',
      position: 'Designer UX/UI',
      period: 'Février 2024',
      grossSalary: 3800,
      deductions: 850,
      netSalary: 2950,
      paymentStatus: 'pending',
      paymentDate: null
    },
    {
      employee: 'Jean Moreau',
      position: 'Développeur Junior',
      period: 'Février 2024',
      grossSalary: 2800,
      deductions: 520,
      netSalary: 2280,
      paymentStatus: 'pending',
      paymentDate: null
    },
    {
      employee: 'Claire Bernard',
      position: 'Analyste Business',
      period: 'Février 2024',
      grossSalary: 4200,
      deductions: 1000,
      netSalary: 3200,
      paymentStatus: 'paid',
      paymentDate: '2024-03-01'
    },
    {
      employee: 'Nicolas Petit',
      position: 'DevOps Engineer',
      period: 'Février 2024',
      grossSalary: 4800,
      deductions: 1150,
      netSalary: 3650,
      paymentStatus: 'paid',
      paymentDate: '2024-03-01'
    },
    {
      employee: 'Marie Dubois',
      position: 'Développeuse Senior',
      period: 'Janvier 2024',
      grossSalary: 4500,
      deductions: 1080,
      netSalary: 3420,
      paymentStatus: 'paid',
      paymentDate: '2024-02-01'
    },
    {
      employee: 'Pierre Martin',
      position: 'Chef de Projet',
      period: 'Janvier 2024',
      grossSalary: 5200,
      deductions: 1300,
      netSalary: 3900,
      paymentStatus: 'paid',
      paymentDate: '2024-02-01'
    },
    {
      employee: 'Isabelle Roux',
      position: 'Responsable RH',
      period: 'Février 2024',
      grossSalary: 5500,
      deductions: 1320,
      netSalary: 4180,
      paymentStatus: 'paid',
      paymentDate: '2024-03-01'
    },
    {
      employee: 'Thomas Garcia',
      position: 'Stagiaire Marketing',
      period: 'Février 2024',
      grossSalary: 600,
      deductions: 85,
      netSalary: 515,
      paymentStatus: 'pending',
      paymentDate: null
    },
    {
      employee: 'Émilie Laurent',
      position: 'Comptable',
      period: 'Février 2024',
      grossSalary: 3200,
      deductions: 750,
      netSalary: 2450,
      paymentStatus: 'error',
      paymentDate: null
    },
    {
      employee: 'Julien Simon',
      position: 'Support Technique',
      period: 'Février 2024',
      grossSalary: 2500,
      deductions: 480,
      netSalary: 2020,
      paymentStatus: 'pending',
      paymentDate: null
    }
  ]

  const filteredData = payslipsData.filter(payslip => {
    const matchesSearch = payslip.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payslip.position.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payslip.paymentStatus === statusFilter
    const matchesMonth = monthFilter === "all" || payslip.period.toLowerCase().includes(monthFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesMonth
  })

  const stats = {
    total: payslipsData.length,
    paid: payslipsData.filter(p => p.paymentStatus === 'paid').length,
    pending: payslipsData.filter(p => p.paymentStatus === 'pending').length,
    error: payslipsData.filter(p => p.paymentStatus === 'error').length,
    totalGross: payslipsData.reduce((sum, p) => sum + p.grossSalary, 0),
    totalNet: payslipsData.reduce((sum, p) => sum + p.netSalary, 0),
    totalDeductions: payslipsData.reduce((sum, p) => sum + p.deductions, 0)
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
                  <SelectItem value="paid">Payés</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="error">Erreurs</SelectItem>
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

export default AdminPayslips
