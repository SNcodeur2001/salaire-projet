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
  UserCheck,
  Euro,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  FileText,
  Mail
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

const AdminEmployees = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [contractFilter, setContractFilter] = useState("all")

  const columns = [
    {
      key: 'name',
      title: 'Employé',
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
      key: 'position',
      title: 'Poste',
      render: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-sm text-muted-foreground">{row.department}</p>
        </div>
      )
    },
    {
      key: 'contractType',
      title: 'Contrat',
      render: (value) => (
        <Badge variant="outline">
          {value === 'CDI' ? 'CDI' : value === 'CDD' ? 'CDD' : 'Stage'}
        </Badge>
      )
    },
    {
      key: 'salary',
      title: 'Salaire',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Euro className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">€{value.toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'startDate',
      title: 'Date d\'embauche',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Statut',
      render: (value) => (
        <Badge
          variant={
            value === 'active' ? 'default' :
            value === 'on_leave' ? 'secondary' :
            'destructive'
          }
        >
          {value === 'active' ? 'Actif' :
           value === 'on_leave' ? 'En congé' :
           'Inactif'}
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
              <FileText className="mr-2 h-4 w-4" />
              Bulletins de paie
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

  const employeesData = [
    {
      name: 'Marie Dubois',
      email: 'marie.dubois@techcorp.fr',
      position: 'Développeuse Senior',
      department: 'Développement',
      contractType: 'CDI',
      salary: 4500,
      startDate: '15/03/2021',
      status: 'active'
    },
    {
      name: 'Pierre Martin',
      email: 'pierre.martin@techcorp.fr',
      position: 'Chef de Projet',
      department: 'Management',
      contractType: 'CDI',
      salary: 5200,
      startDate: '10/01/2020',
      status: 'active'
    },
    {
      name: 'Sophie Leroy',
      email: 'sophie.leroy@techcorp.fr',
      position: 'Designer UX/UI',
      department: 'Design',
      contractType: 'CDI',
      salary: 3800,
      startDate: '22/06/2022',
      status: 'on_leave'
    },
    {
      name: 'Jean Moreau',
      email: 'jean.moreau@techcorp.fr',
      position: 'Développeur Junior',
      department: 'Développement',
      contractType: 'CDD',
      salary: 2800,
      startDate: '05/09/2023',
      status: 'active'
    },
    {
      name: 'Claire Bernard',
      email: 'claire.bernard@techcorp.fr',
      position: 'Analyste Business',
      department: 'Analyse',
      contractType: 'CDI',
      salary: 4200,
      startDate: '18/11/2021',
      status: 'active'
    },
    {
      name: 'Nicolas Petit',
      email: 'nicolas.petit@techcorp.fr',
      position: 'DevOps Engineer',
      department: 'Infrastructure',
      contractType: 'CDI',
      salary: 4800,
      startDate: '03/02/2022',
      status: 'active'
    },
    {
      name: 'Isabelle Roux',
      email: 'isabelle.roux@techcorp.fr',
      position: 'Responsable RH',
      department: 'Ressources Humaines',
      contractType: 'CDI',
      salary: 5500,
      startDate: '12/05/2019',
      status: 'active'
    },
    {
      name: 'Thomas Garcia',
      email: 'thomas.garcia@techcorp.fr',
      position: 'Stagiaire Marketing',
      department: 'Marketing',
      contractType: 'Stage',
      salary: 600,
      startDate: '01/02/2024',
      status: 'active'
    },
    {
      name: 'Émilie Laurent',
      email: 'emilie.laurent@techcorp.fr',
      position: 'Comptable',
      department: 'Finance',
      contractType: 'CDI',
      salary: 3200,
      startDate: '07/08/2020',
      status: 'active'
    },
    {
      name: 'Julien Simon',
      email: 'julien.simon@techcorp.fr',
      position: 'Support Technique',
      department: 'Support',
      contractType: 'CDD',
      salary: 2500,
      startDate: '14/01/2024',
      status: 'active'
    }
  ]

  const filteredData = employeesData.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || employee.status === statusFilter
    const matchesContract = contractFilter === "all" || employee.contractType === contractFilter

    return matchesSearch && matchesStatus && matchesContract
  })

  const stats = {
    total: employeesData.length,
    active: employeesData.filter(e => e.status === 'active').length,
    onLeave: employeesData.filter(e => e.status === 'on_leave').length,
    cdi: employeesData.filter(e => e.contractType === 'CDI').length,
    cdd: employeesData.filter(e => e.contractType === 'CDD').length,
    totalSalary: employeesData.reduce((sum, e) => sum + e.salary, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employés</h1>
          <p className="text-muted-foreground">
            Gestion des employés de TechCorp SARL
          </p>
        </div>
        <Button variant="gradient" icon={<Plus className="h-4 w-4" />}>
          Ajouter un employé
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
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
              <UserCheck className="h-5 w-5 text-success" />
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
                <p className="text-2xl font-bold text-warning">{stats.onLeave}</p>
                <p className="text-sm text-muted-foreground">En congé</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div>
                <p className="text-2xl font-bold text-primary">{stats.cdi}</p>
                <p className="text-sm text-muted-foreground">CDI</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-secondary" />
              <div>
                <p className="text-2xl font-bold">{stats.cdd}</p>
                <p className="text-sm text-muted-foreground">CDD</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Euro className="h-5 w-5 text-success" />
              <div>
                <p className="text-xl font-bold text-success">€{stats.totalSalary.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Masse salariale</p>
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
              <CardTitle>Liste des Employés</CardTitle>
              <CardDescription>
                {filteredData.length} employé{filteredData.length > 1 ? 's' : ''} trouvé{filteredData.length > 1 ? 's' : ''}
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
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="on_leave">En congé</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
                </SelectContent>
              </Select>
              <Select value={contractFilter} onValueChange={setContractFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Contrat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="Stage">Stage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredData}
            emptyMessage="Aucun employé trouvé"
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminEmployees
