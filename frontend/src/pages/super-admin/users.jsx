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
  Shield,
  Building2,
  Mail,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserCheck,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserForm } from "@/components/admin/UserForm"

const SuperAdminUsers = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [createDialog, setCreateDialog] = useState(false)
  const [editDialog, setEditDialog] = useState({ open: false, user: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null })

  // Fetch users
  const { data: usersData = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.getUsers(),
    enabled: !!user,
  })

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData) => apiClient.register(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({ title: "Utilisateur créé", description: "L'utilisateur a été créé avec succès." })
      setCreateDialog(false)
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" })
    },
  })

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({ title: "Utilisateur modifié", description: "L'utilisateur a été modifié avec succès." })
      setEditDialog({ open: false, user: null })
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" })
    },
  })

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id) => apiClient.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({ title: "Utilisateur supprimé", description: "L'utilisateur a été supprimé avec succès." })
      setDeleteDialog({ open: false, user: null })
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" })
    },
  })

  // Handle create
  const handleCreate = () => {
    setCreateDialog(true)
  }

  // Handle edit
  const handleEdit = (user) => {
    setEditDialog({ open: true, user })
  }

  // Handle delete
  const handleDelete = (user) => {
    setDeleteDialog({ open: true, user })
  }

  const confirmDelete = () => {
    if (deleteDialog.user) {
      deleteUserMutation.mutate(deleteDialog.user.id)
    }
  }

  const columns = [
    {
      key: 'name',
      title: 'Utilisateur',
      render: (value, row) => {
        const fullName = `${row.firstName || 'Utilisateur'} ${row.lastName || row.id.slice(0, 8)}`;
        return (
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              {fullName.split(' ').map((n) => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{fullName}</p>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span>{row.email}</span>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'role',
      title: 'Rôle',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {value === 'ADMIN' ? (
            <Shield className="h-4 w-4 text-primary" />
          ) : value === 'SUPER_ADMIN' ? (
            <Shield className="h-4 w-4 text-destructive" />
          ) : (
            <UserCheck className="h-4 w-4 text-success" />
          )}
          <Badge variant={
            value === 'SUPER_ADMIN' ? 'destructive' :
            value === 'ADMIN' ? 'default' :
            'secondary'
          }>
            {value === 'SUPER_ADMIN' ? 'Super Admin' :
             value === 'ADMIN' ? 'Administrateur' :
             'Caissier'}
          </Badge>
        </div>
      )
    },
    {
      key: 'entreprise',
      title: 'Entreprise',
      render: (value, row) => (
        <div className="flex items-center space-x-1">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span>{row.entreprise?.name || 'Aucune'}</span>
        </div>
      )
    },
    {
      key: 'createdAt',
      title: 'Créé le',
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value).toLocaleDateString('fr-FR')}
        </span>
      )
    },
    {
      key: 'isActive',
      title: 'Statut',
      render: (value) => (
        <Badge variant={value ? 'default' : 'destructive'}>
          {value ? 'Actif' : 'Inactif'}
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
            <DropdownMenuItem onClick={() => handleEdit(row)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(row)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  const filteredData = usersData.filter(user =>
    `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.entreprise?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: usersData.length,
    admins: usersData.filter(u => u.role === 'ADMIN').length,
    superAdmins: usersData.filter(u => u.role === 'SUPER_ADMIN').length,
    caissiers: usersData.filter(u => u.role === 'CAISSIER').length,
    active: usersData.filter(u => u.isActive).length,
    inactive: usersData.filter(u => !u.isActive).length
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
        <div className="grid gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
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
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gestion des administrateurs et caissiers
          </p>
        </div>
        <Button
          variant="gradient"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleCreate}
        >
          Créer un utilisateur
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-6">
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
              <Shield className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-destructive">{stats.superAdmins}</p>
                <p className="text-sm text-muted-foreground">Super Admins</p>
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
              <div className="h-2 w-2 rounded-full bg-destructive" />
              <div>
                <p className="text-2xl font-bold text-destructive">{stats.inactive}</p>
                <p className="text-sm text-muted-foreground">Inactifs</p>
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
            loading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Créer un utilisateur</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouvel utilisateur.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSuccess={() => setCreateDialog(false)}
            onCancel={() => setCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, user: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          {editDialog.user && (
            <UserForm
              defaultValues={editDialog.user}
              isEdit={true}
              onSuccess={() => setEditDialog({ open: false, user: null })}
              onCancel={() => setEditDialog({ open: false, user: null })}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, user: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur "{deleteDialog.user?.email}" ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, user: null })}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete} loading={deleteUserMutation.isPending}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SuperAdminUsers