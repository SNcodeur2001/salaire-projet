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
  Mail,
  AlertCircle
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
import { EmployeeForm } from "@/components/admin/EmployeeForm"
import { EmployeeProfileDialog } from "@/components/admin/EmployeeProfileDialog"

const AdminEmployees = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [contractFilter, setContractFilter] = useState("all")
  const [deleteDialog, setDeleteDialog] = useState({ open: false, employee: null })
  const [employeeDialog, setEmployeeDialog] = useState({ open: false, employee: null, isEdit: false })
  const [profileDialog, setProfileDialog] = useState({ open: false, employeeId: null })

  // Fetch employees
  const { data: employeesData = [], isLoading, error } = useQuery({
    queryKey: ['employees', { search: searchTerm, status: statusFilter, contract: contractFilter, entrepriseId: user?.entrepriseId }],
    queryFn: () => apiClient.getEmployees({
      search: searchTerm || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      contract: contractFilter !== 'all' ? contractFilter : undefined,
      entrepriseId: user?.entrepriseId
    }),
    enabled: !!user,
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.updateEmployee(id, { active: false }), // Soft delete by deactivating
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast({ title: "Employé désactivé", description: "L'employé a été désactivé avec succès." })
      setDeleteDialog({ open: false, employee: null })
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" })
    },
  })

  // Handle delete
  const handleDelete = (employee) => {
    setDeleteDialog({ open: true, employee })
  }

  const confirmDelete = () => {
    if (deleteDialog.employee) {
      deleteMutation.mutate(deleteDialog.employee.id)
    }
  }

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
            <DropdownMenuItem onClick={() => setProfileDialog({ open: true, employeeId: row.id })}>
              <Eye className="mr-2 h-4 w-4" />
              Voir profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setProfileDialog({ open: true, employeeId: row.id })}>
              <FileText className="mr-2 h-4 w-4" />
              Bulletins de paie
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEmployeeDialog({ open: true, employee: row, isEdit: true })}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(row)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

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

  const stats = {
    total: employeesData.length,
    active: employeesData.filter(e => e.status === 'active').length,
    onLeave: employeesData.filter(e => e.status === 'on_leave').length,
    cdi: employeesData.filter(e => e.contractType === 'CDI').length,
    cdd: employeesData.filter(e => e.contractType === 'CDD').length,
    totalSalary: employeesData.reduce((sum, e) => sum + e.salary, 0)
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
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
                  <div className="h-4 w-20 bg-muted rounded"></div>
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
          <h1 className="text-3xl font-bold tracking-tight">Employés</h1>
          <p className="text-muted-foreground">
            Gestion des employés de TechCorp SARL
          </p>
        </div>
        <Button variant="gradient" icon={<Plus className="h-4 w-4" />} onClick={() => setEmployeeDialog({ open: true, employee: null, isEdit: false })}>
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
                {employeesData.length} employé{employeesData.length > 1 ? 's' : ''} trouvé{employeesData.length > 1 ? 's' : ''}
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
            data={employeesData}
            emptyMessage="Aucun employé trouvé"
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={() => setDeleteDialog({ open: false, employee: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir désactiver <span className="font-semibold">{deleteDialog.employee?.name}</span> ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, employee: null })}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Désactivation..." : "Désactiver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Form Dialog */}
      <Dialog open={employeeDialog.open} onOpenChange={() => setEmployeeDialog({ open: false, employee: null, isEdit: false })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{employeeDialog.isEdit ? "Modifier l'employé" : "Ajouter un employé"}</DialogTitle>
            <DialogDescription>
              {employeeDialog.isEdit ? "Modifiez les informations de l'employé." : "Remplissez les informations pour ajouter un nouvel employé."}
            </DialogDescription>
          </DialogHeader>
          <EmployeeForm
            defaultValues={employeeDialog.employee || {}}
            isEdit={employeeDialog.isEdit}
            onSuccess={() => {
              setEmployeeDialog({ open: false, employee: null, isEdit: false })
              queryClient.invalidateQueries({ queryKey: ['employees'] })
            }}
            onCancel={() => setEmployeeDialog({ open: false, employee: null, isEdit: false })}
          />
        </DialogContent>
      </Dialog>

      {/* Employee Profile Dialog */}
      <EmployeeProfileDialog
        employeeId={profileDialog.employeeId}
        open={profileDialog.open}
        onOpenChange={(open) => setProfileDialog({ open, employeeId: open ? profileDialog.employeeId : null })}
      />
    </div>
  )
}

export default AdminEmployees
