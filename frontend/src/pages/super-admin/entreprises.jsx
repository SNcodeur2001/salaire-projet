import * as React from "react"
import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Building2, 
  Users, 
  Calendar, 
  Euro,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const SuperAdminEntreprises = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const columns = [
    { 
      key: 'name', 
      title: 'Entreprise',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-sm text-muted-foreground">{row.email}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'sector', 
      title: 'Secteur',
      render: (value) => (
        <Badge variant="secondary">{value}</Badge>
      )
    },
    { 
      key: 'employees', 
      title: 'Employés',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      )
    },
    { 
      key: 'payrollPeriod', 
      title: 'Période de Paie',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      )
    },
    { 
      key: 'currency', 
      title: 'Devise',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Euro className="h-4 w-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      )
    },
    { 
      key: 'status', 
      title: 'Statut',
      render: (value) => (
        <Badge 
          variant={value === 'active' ? 'default' : value === 'pending' ? 'secondary' : 'destructive'}
        >
          {value === 'active' ? 'Actif' : value === 'pending' ? 'En attente' : 'Suspendu'}
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

  const entreprisesData = [
    {
      name: 'TechCorp SARL',
      email: 'contact@techcorp.fr',
      sector: 'Technologie',
      employees: 45,
      payrollPeriod: 'Mensuel',
      currency: 'EUR',
      status: 'active'
    },
    {
      name: 'BuildPro SA',
      email: 'rh@buildpro.fr',
      sector: 'Construction',
      employees: 128,
      payrollPeriod: 'Mensuel',
      currency: 'EUR',
      status: 'active'
    },
    {
      name: 'RetailMax Ltd',
      email: 'admin@retailmax.com',
      sector: 'Commerce',
      employees: 89,
      payrollPeriod: 'Bi-mensuel',
      currency: 'EUR',
      status: 'active'
    },
    {
      name: 'HealthCare Plus',
      email: 'contact@healthcare.fr',
      sector: 'Santé',
      employees: 67,
      payrollPeriod: 'Mensuel',
      currency: 'EUR',
      status: 'pending'
    },
    {
      name: 'EduServ Academy',
      email: 'administration@eduserv.fr',
      sector: 'Éducation',
      employees: 34,
      payrollPeriod: 'Mensuel',
      currency: 'EUR',
      status: 'active'
    },
    {
      name: 'LogiFlow SARL',
      email: 'contact@logiflow.fr',
      sector: 'Logistique',
      employees: 156,
      payrollPeriod: 'Mensuel',
      currency: 'EUR',
      status: 'suspended'
    },
    {
      name: 'AgroVert Coopérative',
      email: 'rh@agrovert.fr',
      sector: 'Agriculture',
      employees: 78,
      payrollPeriod: 'Mensuel',
      currency: 'EUR',
      status: 'active'
    },
    {
      name: 'FinanceExpert',
      email: 'admin@financeexpert.fr',
      sector: 'Finance',
      employees: 23,
      payrollPeriod: 'Mensuel',
      currency: 'EUR',
      status: 'pending'
    }
  ]

  const filteredData = entreprisesData.filter(entreprise =>
    entreprise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entreprise.sector.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: entreprisesData.length,
    active: entreprisesData.filter(e => e.status === 'active').length,
    pending: entreprisesData.filter(e => e.status === 'pending').length,
    suspended: entreprisesData.filter(e => e.status === 'suspended').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Entreprises</h1>
          <p className="text-muted-foreground">
            Gestion des organisations sur la plateforme
          </p>
        </div>
        <Button variant="gradient" icon={<Plus className="h-4 w-4" />}>
          Créer une entreprise
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
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
              <div className="h-2 w-2 rounded-full bg-success" />
              <div>
                <p className="text-2xl font-bold text-success">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Actives</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-warning" />
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
              <div className="h-2 w-2 rounded-full bg-destructive" />
              <div>
                <p className="text-2xl font-bold text-destructive">{stats.suspended}</p>
                <p className="text-sm text-muted-foreground">Suspendues</p>
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
              <CardTitle>Liste des Entreprises</CardTitle>
              <CardDescription>
                {filteredData.length} entreprise{filteredData.length > 1 ? 's' : ''} trouvée{filteredData.length > 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une entreprise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredData}
            emptyMessage="Aucune entreprise trouvée"
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default SuperAdminEntreprises