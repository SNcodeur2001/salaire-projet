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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PayrunForm } from "@/components/admin/PayrunForm"

const AdminPayruns = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [payrunDialog, setPayrunDialog] = useState({ open: false, payrun: null, isEdit: false })
  const [launchDialog, setLaunchDialog] = useState({ open: false, payrun: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, payrun: null })
  const [detailsDialog, setDetailsDialog] = useState({ open: false, payrun: null })

  // Fetch payruns
  const { data: payrunsData = [], isLoading, error } = useQuery({
    queryKey: ['payruns', user?.entrepriseId],
    queryFn: () => apiClient.getPayruns({ entrepriseId: user?.entrepriseId }),
    enabled: !!user,
  })

  // Update mutation for payruns (used for edit, launch, delete)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.updatePayrun(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payruns', user?.entrepriseId] })
      queryClient.invalidateQueries({ queryKey: ['payslips', user?.entrepriseId] })
      toast({ title: "Cycle mis à jour", description: "Le cycle de paie a été mis à jour avec succès." })
      setLaunchDialog({ open: false, payrun: null })
      setDeleteDialog({ open: false, payrun: null })
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" })
    },
  })

  // Create mutation for payruns
  const createMutation = useMutation({
    mutationFn: (data) => apiClient.createPayrun(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payruns', user?.entrepriseId] })
      toast({ title: "Cycle créé", description: "Le cycle de paie a été créé avec succès." })
      setPayrunDialog({ open: false, payrun: null, isEdit: false })
    },
    onError: (err) => {
      toast({ title: "Erreur", description: err.message, variant: "destructive" })
    },
  })

  // Handle launch cycle
  const handleLaunch = (payrun) => {
    setLaunchDialog({ open: true, payrun })
  }

  const confirmLaunch = () => {
    if (launchDialog.payrun) {
      updateMutation.mutate({
        id: launchDialog.payrun.id,
        data: { status: 'APPROUVE' }
      })
    }
  }

  // Handle delete
  const handleDelete = (payrun) => {
    setDeleteDialog({ open: true, payrun })
  }

  const confirmDelete = () => {
    if (deleteDialog.payrun) {
      updateMutation.mutate({
        id: deleteDialog.payrun.id,
        data: { status: 'SUPPRIME' } // Assuming a deleted status; adjust if backend uses soft delete
      })
    }
  }

  // Fetch payslips for details modal
  const { data: payslipsForDetails = [] } = useQuery({
    queryKey: ['payslips', detailsDialog.payrun?.id],
    queryFn: () => apiClient.getPayrunPayslips(detailsDialog.payrun?.id),
    enabled: !!detailsDialog.payrun?.id,
  })

  const columns = [
    {
      key: 'period',
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
              <span>{new Date(row.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'payslips',
      title: 'Bulletins',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value?.length || 0}</span>
        </div>
      )
    },
    {
      key: 'totalAmount',
      title: 'Montant Total',
      render: (value, row) => {
        const total = row.payslips?.reduce((sum, payslip) => sum + (payslip.grossSalary || 0), 0) || 0;
        return (
          <div className="flex items-center space-x-1">
            <Euro className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">€{total.toLocaleString()}</span>
          </div>
        );
      }
    },
    {
      key: 'progress',
      title: 'Progression',
      render: (value, row) => {
        const total = row.payslips?.length || 0;
        const paid = row.payslips?.filter(p => p.status === 'PAYE').length || 0;
        const progress = total > 0 ? (paid / total) * 100 : 0;
        return (
          <div className="space-y-2 min-w-[120px]">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {paid}/{total} payés
            </p>
          </div>
        );
      }
    },
    {
      key: 'status',
      title: 'Statut',
      render: (value) => (
        <Badge
          variant={
            value === 'CLOS' ? 'default' :
            value === 'APPROUVE' ? 'secondary' :
            value === 'BROUILLON' ? 'outline' :
            'destructive'
          }
        >
          {value === 'CLOS' ? (
            <><CheckCircle className="mr-1 h-3 w-3" />Terminé</>
          ) : value === 'APPROUVE' ? (
            <><Clock className="mr-1 h-3 w-3" />En cours</>
          ) : value === 'BROUILLON' ? (
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
            <DropdownMenuItem onClick={() => setDetailsDialog({ open: true, payrun: row })}>
              <Eye className="mr-2 h-4 w-4" />
              Voir détails
            </DropdownMenuItem>
            {row.status === 'BROUILLON' && (
              <DropdownMenuItem onClick={() => handleLaunch(row)}>
                <Play className="mr-2 h-4 w-4" />
                Lancer le cycle
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => setPayrunDialog({ open: true, payrun: row, isEdit: true })}>
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



  const filteredData = payrunsData.filter(payrun => {
    const matchesSearch = payrun.period.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payrun.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: payrunsData.length,
    draft: payrunsData.filter(p => p.status === 'BROUILLON').length,
    inProgress: payrunsData.filter(p => p.status === 'APPROUVE').length,
    completed: payrunsData.filter(p => p.status === 'CLOS').length,
    totalPaid: payrunsData
      .filter(p => p.status === 'CLOS')
      .reduce((sum, p) => {
        const payrunTotal = p.payslips?.reduce((payrunSum, payslip) => payrunSum + (payslip.grossSalary || 0), 0) || 0;
        return sum + payrunTotal;
      }, 0)
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
        <Button variant="gradient" icon={<Plus className="h-4 w-4" />} onClick={() => setPayrunDialog({ open: true, payrun: null, isEdit: false })}>
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
                  <SelectItem value="BROUILLON">Brouillons</SelectItem>
                  <SelectItem value="APPROUVE">En cours</SelectItem>
                  <SelectItem value="CLOS">Terminés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Chargement...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-destructive">Erreur lors du chargement des données</div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredData}
              emptyMessage="Aucun cycle de paie trouvé"
            />
          )}
        </CardContent>
      </Card>

      {/* Payrun Form Dialog */}
      <Dialog open={payrunDialog.open} onOpenChange={() => setPayrunDialog({ open: false, payrun: null, isEdit: false })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{payrunDialog.isEdit ? "Modifier le cycle" : "Créer un cycle"}</DialogTitle>
            <DialogDescription>
              {payrunDialog.isEdit ? "Modifiez les informations du cycle." : "Remplissez les informations pour créer un nouveau cycle."}
            </DialogDescription>
          </DialogHeader>
          <PayrunForm
            defaultValues={payrunDialog.payrun || {}}
            isEdit={payrunDialog.isEdit}
            onSuccess={() => {
              setPayrunDialog({ open: false, payrun: null, isEdit: false })
              if (payrunDialog.isEdit) {
                updateMutation.mutate({
                  id: payrunDialog.payrun.id,
                  data: payrunDialog.payrun
                })
              } else {
                createMutation.mutate({ ...payrunDialog.payrun, entrepriseId: user?.entrepriseId })
              }
            }}
            onCancel={() => setPayrunDialog({ open: false, payrun: null, isEdit: false })}
          />
        </DialogContent>
      </Dialog>

      {/* Launch Confirmation Dialog */}
      <Dialog open={launchDialog.open} onOpenChange={() => setLaunchDialog({ open: false, payrun: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le lancement</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir lancer le cycle <span className="font-semibold">{launchDialog.payrun?.period}</span> ? Cela passera le statut à "Approuvé".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLaunchDialog({ open: false, payrun: null })}>
              Annuler
            </Button>
            <Button onClick={confirmLaunch} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Lancement..." : "Lancer le cycle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={() => setDeleteDialog({ open: false, payrun: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le cycle <span className="font-semibold">{deleteDialog.payrun?.period}</span> ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, payrun: null })}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialog.open} onOpenChange={() => setDetailsDialog({ open: false, payrun: null })}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Détails du cycle: {detailsDialog.payrun?.period}</DialogTitle>
            <DialogDescription>
              Statut: <Badge variant="secondary">{detailsDialog.payrun?.status}</Badge>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Bulletins de paie</h3>
                {payslipsForDetails.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {payslipsForDetails.map((payslip) => (
                      <div key={payslip.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            {payslip.employee.firstName[0]}{payslip.employee.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium">{payslip.employee.firstName} {payslip.employee.lastName}</p>
                            <p className="text-sm text-muted-foreground">{payslip.employee.position}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">€{payslip.netSalary?.toLocaleString()}</p>
                          <Badge variant={payslip.status === 'PAYE' ? 'default' : 'secondary'}>
                            {payslip.status === 'PAYE' ? 'Payé' : 'En attente'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucun bulletin généré pour ce cycle.</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Résumé financier</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total brut</span>
                    <span>€{detailsDialog.payrun?.payslips?.reduce((sum, p) => sum + (p.grossSalary || 0), 0)?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total charges</span>
                    <span>€{detailsDialog.payrun?.payslips?.reduce((sum, p) => sum + (p.deductions || 0), 0)?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total net</span>
                    <span>€{detailsDialog.payrun?.payslips?.reduce((sum, p) => sum + (p.netSalary || 0), 0)?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setDetailsDialog({ open: false, payrun: null })}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminPayruns
