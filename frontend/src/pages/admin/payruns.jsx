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

const AdminPayruns = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Fetch payruns
  const { data: payrunsData = [], isLoading, error } = useQuery({
    queryKey: ['payruns', user?.entrepriseId],
    queryFn: () => apiClient.getPayruns({ entrepriseId: user?.entrepriseId }),
    enabled: !!user,
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
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Voir détails
            </DropdownMenuItem>
            {row.status === 'BROUILLON' && (
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
    </div>
  )
}

export default AdminPayruns
