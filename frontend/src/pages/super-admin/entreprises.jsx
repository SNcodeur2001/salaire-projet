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
  Building2,
  Users,
  Calendar,
  Euro,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"

const SuperAdminEntreprises = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [createDialog, setCreateDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, entreprise: null })

  const form = useForm({
    defaultValues: {
      name: "",
      address: "",
      currency: "EUR",
      periodType: "mensuelle",
    },
  })

  // Fetch entreprises
  const { data: entreprisesData = [], isLoading, error } = useQuery({
    queryKey: ['entreprises', { search: searchTerm }],
    queryFn: () => apiClient.getEntreprises({
      search: searchTerm || undefined,
    }),
    enabled: !!user,
  })

  // Create entreprise mutation
  const createMutation = useMutation({
    mutationFn: (data) => apiClient.createEntreprise({
      name: data.name,
      address: data.address,
      currency: data.currency,
      periodType: data.periodType,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entreprises'] })
      toast({ title: "Entreprise créée", description: "L'entreprise a été créée avec succès." })
      setCreateDialog(false)
      form.reset()
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" })
    },
  })

  // Delete entreprise mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.deleteEntreprise(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entreprises'] })
      toast({ title: "Entreprise supprimée", description: "L'entreprise a été supprimée avec succès." })
      setDeleteDialog({ open: false, entreprise: null })
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" })
    },
  })

  // Handle create
  const onSubmit = (data) => {
    createMutation.mutate(data)
  }

  // Handle delete
  const handleDelete = (entreprise) => {
    setDeleteDialog({ open: true, entreprise })
  }

  const confirmDelete = () => {
    if (deleteDialog.entreprise) {
      deleteMutation.mutate(deleteDialog.entreprise.id)
    }
  }

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
            <p className="text-sm text-muted-foreground">{row.address}</p>
          </div>
        </div>
      )
    },
    {
      key: 'periodType',
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
      key: 'createdAt',
      title: 'Créée le',
      render: (value) => new Date(value).toLocaleDateString('fr-FR')
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

  const filteredData = entreprisesData.filter(entreprise =>
    entreprise.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: entreprisesData.length,
    active: entreprisesData.length, // All are active for now
    pending: 0,
    suspended: 0
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
        <Button
          variant="gradient"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setCreateDialog(true)}
        >
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

      {/* Create Entreprise Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Créer une entreprise</DialogTitle>
            <DialogDescription>
              Créez une nouvelle entreprise sur la plateforme.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Le nom est requis" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'entreprise</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: TechCorp SARL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="Adresse de l'entreprise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Devise</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une devise" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="XOF">XOF</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="periodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Période de paie</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner la période" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mensuelle">Mensuelle</SelectItem>
                          <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                          <SelectItem value="journalière">Journalière</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateDialog(false)}>
                  Annuler
                </Button>
                <Button type="submit" loading={createMutation.isPending}>
                  Créer l'entreprise
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, entreprise: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'entreprise "{deleteDialog.entreprise?.name}" ?
              Cette action est irréversible et supprimera également tous les utilisateurs associés.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, entreprise: null })}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete} loading={deleteMutation.isPending}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SuperAdminEntreprises