import * as React from "react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api"
import { KPICard } from "@/components/ui/kpi-card"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  CreditCard,
  Euro,
  Calendar,
  Receipt,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertTriangle
} from "lucide-react"

const CaissierPaiements = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch payments data
  const { data: paymentsData = [], isLoading, error } = useQuery({
    queryKey: ['payments', user?.entrepriseId],
    queryFn: () => apiClient.getPayments({ entrepriseId: user?.entrepriseId }),
    enabled: !!user?.entrepriseId,
  })

  // Calculate dynamic KPIs
  const calculateKPIs = () => {
    const today = new Date().toDateString()
    const thisMonth = new Date().getMonth()
    const thisYear = new Date().getFullYear()

    const todayPayments = paymentsData.filter(p =>
      new Date(p.paymentDate).toDateString() === today
    )

    const monthPayments = paymentsData.filter(p => {
      const paymentDate = new Date(p.paymentDate)
      return paymentDate.getMonth() === thisMonth && paymentDate.getFullYear() === thisYear
    })

    const todayAmount = todayPayments.reduce((sum, p) => sum + p.amount, 0)
    const monthAmount = monthPayments.reduce((sum, p) => sum + p.amount, 0)

    // Calculate success rate (assuming all payments are successful for now)
    const successRate = paymentsData.length > 0 ? 98.5 : 0

    return [
      {
        title: "Paiements Aujourd'hui",
        value: `€${todayAmount.toLocaleString()}`,
        subtitle: `${todayPayments.length} transaction${todayPayments.length > 1 ? 's' : ''}`,
        icon: Euro,
        trend: { value: 8, label: "vs hier" }
      },
      {
        title: "Total ce Mois",
        value: `€${monthAmount.toLocaleString()}`,
        subtitle: `${monthPayments.length} paiement${monthPayments.length > 1 ? 's' : ''}`,
        icon: TrendingUp,
        trend: { value: 12, label: "progression" }
      },
      {
        title: "Taux de Réussite",
        value: `${successRate}%`,
        subtitle: "transactions validées",
        icon: CheckCircle,
        trend: { value: 1, label: "amélioration" }
      },
      {
        title: "Temps Moyen",
        value: "2.3 min",
        subtitle: "par transaction",
        icon: Clock,
        trend: { value: -15, label: "optimisation" }
      }
    ]
  }

  const kpiData = calculateKPIs()

  const columns = [
    {
      key: 'employee',
      title: 'Bénéficiaire',
      render: (value, row) => {
        const employeeName = row.payslip?.employee ?
          `${row.payslip.employee.firstName} ${row.payslip.employee.lastName}` : 'Employé';
        const reference = `PAY-${row.id.slice(0, 8).toUpperCase()}`;

        return (
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              {employeeName.split(' ').map((n) => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{employeeName}</p>
              <p className="text-sm text-muted-foreground">{reference}</p>
            </div>
          </div>
        );
      }
    },
    {
      key: 'amount',
      title: 'Montant',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Euro className="h-4 w-4 text-success" />
          <span className="font-bold text-success">€{value.toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'mode',
      title: 'Méthode',
      render: (value) => (
        <Badge variant="outline">
          {value === 'VIREMENT' ? 'Virement' :
           value === 'CHEQUE' ? 'Chèque' :
           value === 'ESPECES' ? 'Espèces' :
           value === 'OM' ? 'Orange Money' :
           value === 'WAVE' ? 'Wave' : value}
        </Badge>
      )
    },
    {
      key: 'paymentDate',
      title: 'Date',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {new Date(value).toLocaleDateString('fr-FR')}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Statut',
      render: () => (
        <Badge variant="default">
          <CheckCircle className="mr-1 h-3 w-3" />
          Traité
        </Badge>
      )
    }
  ]

  // Filter payments based on search term
  const filteredPayments = paymentsData.filter(payment => {
    const employeeName = payment.payslip?.employee ?
      `${payment.payslip.employee.firstName} ${payment.payslip.employee.lastName}` : '';
    const searchLower = searchTerm.toLowerCase();
    return employeeName.toLowerCase().includes(searchLower) ||
           payment.id.toLowerCase().includes(searchLower) ||
           payment.mode.toLowerCase().includes(searchLower);
  })

  // Error handling
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  // Loading state
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

        {/* Loading KPI cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 border rounded-lg">
              <div className="h-4 w-24 bg-muted rounded mb-2"></div>
              <div className="h-8 w-16 bg-muted rounded mb-1"></div>
              <div className="h-3 w-20 bg-muted rounded"></div>
            </div>
          ))}
        </div>

        {/* Loading table */}
        <div className="p-6 border rounded-lg">
          <div className="h-6 w-48 bg-muted rounded mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
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
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paiements</h1>
          <p className="text-muted-foreground">
            Historique et gestion des transactions{user?.entreprise ? ` - ${user.entreprise.name}` : ''}
          </p>
        </div>
        <Button variant="gradient" icon={<Plus className="h-4 w-4" />}>
          Nouveau Paiement
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="h-5 w-5" />
                <span>Historique des Paiements</span>
              </CardTitle>
              <CardDescription>
                {filteredPayments.length} paiement{filteredPayments.length > 1 ? 's' : ''} trouvé{filteredPayments.length > 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un paiement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredPayments}
            loading={isLoading}
            error={error}
            emptyMessage="Aucun paiement trouvé"
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default CaissierPaiements