import * as React from "react"
import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Search,
  Calculator,
  Calendar,
  Euro,
  Users,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Play,
  CheckCircle,
  AlertCircle,
  Clock
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

const AdminPayruns = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const columns = [
    {
      key: 'name',
      title: 'Cycle de Paie',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{row.period}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'employees',
      title: 'Employés',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'totalAmount',
      title: 'Montant Total',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Euro className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">€{value.toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'progress',
      title: 'Progression',
      render: (value, row) => (
        <div className="space-y-2 min-w-[120px]">
          <Progress value={value} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {row.generated}/{row.employees} bulletins
          </p>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Statut',
      render: (value) => (
        <Badge
          variant={
            value === 'completed' ? 'default' :
            value === 'in_progress' ? 'secondary' :
            value === 'draft' ? 'outline' :
            'destructive'
          }
        >
          {value === 'completed' ? (
            <><CheckCircle className="mr-1 h-3 w-3" />Terminé</>
          ) : value === 'in_progress' ? (
            <><Clock className="mr-1 h-3 w-3" />En cours</>
          ) : value === 'draft' ? (
            <><Edit className="mr-1 h-3 w-3" />Brouillon</>
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
            {row.status === 'draft' && (
              <DropdownMenuItem>
                <Play className="mr-2 h-4 w-4" />
                Lancer le cycle
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  const payrunsData = [
    {
      name: 'Paie Février 2024',
      period: '01/02/2024 - 29/02/2024',
      employees: 128,
      generated: 124,
      totalAmount: 285400,
      progress: 97,
      status: 'in_progress'
    },
    {
      name: 'Paie Janvier 2024',
      period: '01/01/2024 - 31/01/2024',
      employees: 125,
      generated: 125,
      totalAmount: 278900,
      progress: 100,
      status: 'completed'
    },
    {
      name: 'Paie Décembre 2023',
      period: '01/12/2023 - 31/12/2023',
      employees: 123,
      generated: 123,
      totalAmount: 295600,
      progress: 100,
      status: 'completed'
    },
    {
      name: 'Prime Fin d\'Année 2023',
      period: '15/12/2023 - 15/12/2023',
      employees: 123,
      generated: 123,
      totalAmount: 185000,
      progress: 100,
      status: 'completed'
    },
    {
      name: 'Paie Novembre 2023',
      period: '01/11/2023 - 30/11/2023',
      employees: 121,
      generated: 121,
      totalAmount: 267800,
      progress: 100,
      status: 'completed'
    },
    {
      name: 'Paie Mars 2024',
      period: '01/03/2024 - 31/03/2024',
      employees: 130,
      generated: 0,
      totalAmount: 0,
      progress: 0,
      status: 'draft'
    },
    {
      name: '13ème Mois 2023',
      period: '31/12/2023 - 31/12/2023',
      employees: 89,
      generated: 89,
      totalAmount: 156700,
      progress: 100,
      status: 'completed'
    },
    {
      name: 'Paie Octobre 2023',
      period: '01/10/2023 - 31/10/2023',
      employees: 119,
      generated: 0,
      totalAmount: 0,
      progress: 0,
      status: 'error'
    }
  ]

  const filteredData = payrunsData.filter(payrun => {
    const matchesSearch = payrun.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payrun.period.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payrun.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: payrunsData.length,
    draft: payrunsData.filter(p => p.status === 'draft').length,
    inProgress: payrunsData.filter(p => p.status === 'in_progress').length,
    completed: payrunsData.filter(p => p.status === 'completed').length,
    totalPaid: payrunsData
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.totalAmount, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cycles de Paie</h1>
          <p className="text-muted-foreground">
            Gestion des cycles de traitement des salaires
          </p>
        </div>
        <Button variant="gradient" icon={<Plus className="h-4 w-4" />}>
          Créer un cycle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-primary" />
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
              <div className="h-2 w-2 rounded-full bg-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.draft}</p>
                <p className="text-sm text-muted-foreground">Brouillons</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-warning" />
              <div>
                <p className="text-2xl font-bold text-warning">{stats.inProgress}</p>
                <p className="text-sm text-muted-foreground">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-2xl font-bold text-success">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Terminés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Euro className="h-5 w-5 text-success" />
              <div>
                <p className="text-xl font-bold text-success">€{stats.totalPaid.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total versé</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Payrun Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-warning" />
            <span>Cycle Actuel - Février 2024</span>
          </CardTitle>
          <CardDescription>
            Statut en temps réel du cycle de paie en cours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bulletins générés</span>
                <span className="text-sm text-muted-foreground">124/128</span>
              </div>
              <Progress value={97} className="h-3" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Validations</span>
                <span className="text-sm text-muted-foreground">98/124</span>
              </div>
              <Progress value={79} className="h-3" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Paiements</span>
                <span className="text-sm text-muted-foreground">85/124</span>
              </div>
              <Progress value={69} className="h-3" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold">€285,400</p>
                <p className="text-sm text-muted-foreground">Montant total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">€268,750</p>
                <p className="text-sm text-muted-foreground">Déjà versé</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">€16,650</p>
                <p className="text-sm text-muted-foreground">Restant</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                Voir détails
              </Button>
              <Button variant="default">
                Finaliser le cycle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historique des Cycles</CardTitle>
              <CardDescription>
                {filteredData.length} cycle{filteredData.length > 1 ? 's' : ''} trouvé{filteredData.length > 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un cycle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="draft">Brouillons</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminés</SelectItem>
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
            emptyMessage="Aucun cycle de paie trouvé"
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminPayruns
