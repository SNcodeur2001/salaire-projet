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
  Users, 
  Shield, 
  Building2, 
  Mail,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserCheck
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const SuperAdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const columns = [
    { 
      key: 'name', 
      title: 'Utilisateur',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            {value.split(' ').map((n) => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span>{row.email}</span>
            </div>
          </div>
        </div>
      )
    },
    { 
      key: 'role', 
      title: 'Rôle',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {value === 'admin' ? (
            <Shield className="h-4 w-4 text-primary" />
          ) : (
            <UserCheck className="h-4 w-4 text-success" />
          )}
          <Badge variant={value === 'admin' ? 'default' : 'secondary'}>
            {value === 'admin' ? 'Administrateur' : 'Caissier'}
          </Badge>
        </div>
      )
    },
    { 
      key: 'company', 
      title: 'Entreprise',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      )
    },
    { 
      key: 'lastLogin', 
      title: 'Dernière connexion',
      render: (value) => (
        <span className="text-sm text-muted-foreground">{value}</span>
      )
    },
    { 
      key: 'status', 
      title: 'Statut',
      render: (value) => (
        <Badge 
          variant={value === 'active' ? 'default' : value === 'pending' ? 'secondary' : 'destructive'}
        >
          {value === 'active' ? 'Actif' : value === 'pending' ? 'En attente' : 'Inactif'}
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
              Voir profil
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

  const usersData = [
    {
      name: 'Marie Dubois',
      email: 'marie.dubois@techcorp.fr',
      role: 'admin',
      company: 'TechCorp SARL',
      lastLogin: '2 heures',
      status: 'active'
    },
    {
      name: 'Pierre Martin',
      email: 'pierre.martin@buildpro.fr',
      role: 'admin',
      company: 'BuildPro SA',
      lastLogin: '1 jour',
      status: 'active'
    },
    {
      name: 'Sophie Leroy',
      email: 'sophie.leroy@techcorp.fr',
      role: 'caissier',
      company: 'TechCorp SARL',
      lastLogin: '30 minutes',
      status: 'active'
    },
    {
      name: 'Jean Moreau',
      email: 'jean.moreau@retailmax.com',
      role: 'admin',
      company: 'RetailMax Ltd',
      lastLogin: '3 jours',
      status: 'active'
    },
    {
      name: 'Claire Bernard',
      email: 'claire.bernard@healthcare.fr',
      role: 'admin',
      company: 'HealthCare Plus',
      lastLogin: 'Jamais',
      status: 'pending'
    },
    {
      name: 'Nicolas Petit',
      email: 'nicolas.petit@buildpro.fr',
      role: 'caissier',
      company: 'BuildPro SA',
      lastLogin: '4 heures',
      status: 'active'
    },
    {
      name: 'Isabelle Roux',
      email: 'isabelle.roux@eduserv.fr',
      role: 'admin',
      company: 'EduServ Academy',
      lastLogin: '2 jours',
      status: 'active'
    },
    {
      name: 'Thomas Garcia',
      email: 'thomas.garcia@retailmax.com',
      role: 'caissier',
      company: 'RetailMax Ltd',
      lastLogin: '1 heure',
      status: 'active'
    },
    {
      name: 'Émilie Laurent',
      email: 'emilie.laurent@logiflow.fr',
      role: 'admin',
      company: 'LogiFlow SARL',
      lastLogin: '1 semaine',
      status: 'inactive'
    },
    {
      name: 'Julien Simon',
      email: 'julien.simon@agrovert.fr',
      role: 'caissier',
      company: 'AgroVert Coopérative',
      lastLogin: '5 heures',
      status: 'active'
    }
  ]

  const filteredData = usersData.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: usersData.length,
    admins: usersData.filter(u => u.role === 'admin').length,
    caissiers: usersData.filter(u => u.role === 'caissier').length,
    active: usersData.filter(u => u.status === 'active').length,
    pending: usersData.filter(u => u.status === 'pending').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gestion des administrateurs et caissiers
          </p>
        </div>
        <Button variant="gradient" icon={<Plus className="h-4 w-4" />}>
          Créer un utilisateur
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
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
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold text-primary">{stats.admins}</p>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-success" />
              <div>
                <p className="text-2xl font-bold text-success">{stats.caissiers}</p>
                <p className="text-sm text-muted-foreground">Caissiers</p>
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
                <p className="text-sm text-muted-foreground">Actifs</p>
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
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des Utilisateurs</CardTitle>
              <CardDescription>
                {filteredData.length} utilisateur{filteredData.length > 1 ? 's' : ''} trouvé{filteredData.length > 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un utilisateur..."
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
            emptyMessage="Aucun utilisateur trouvé"
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default SuperAdminUsers