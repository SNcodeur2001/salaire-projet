import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api"
import { KPICard } from "@/components/ui/kpi-card"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Euro,
  CreditCard,
  Clock,
  CheckCircle,
  Plus,
  AlertTriangle,
  TrendingUp,
  Receipt,
  Users
} from "lucide-react"

const CaissierDashboard = () => {
  const { user } = useAuth()

  // Fetch payslips data
  const { data: payslipsData = [], isLoading: payslipsLoading, error: payslipsError } = useQuery({
    queryKey: ['payslips', user?.entrepriseId],
    queryFn: () => apiClient.getPayslips({ entrepriseId: user?.entrepriseId }),
    enabled: !!user?.entrepriseId,
  })

  // Fetch payments data
  const { data: paymentsData = [], isLoading: paymentsLoading, error: paymentsError } = useQuery({
    queryKey: ['payments', user?.entrepriseId],
    queryFn: () => apiClient.getPayments({ entrepriseId: user?.entrepriseId }),
    enabled: !!user?.entrepriseId,
  })

  // Calculate dynamic KPIs
  const calculateKPIs = () => {
    const pendingPayslips = payslipsData.filter(p => p.status === 'EN_ATTENTE')
    const paidPayslips = payslipsData.filter(p => p.status === 'PAYE')
    const partialPayslips = payslipsData.filter(p => p.status === 'PARTIEL')

    const totalPendingAmount = pendingPayslips.reduce((sum, p) => sum + (p.netSalary || 0), 0)
    const totalPaidAmount = paidPayslips.reduce((sum, p) => sum + (p.netSalary || 0), 0)
    const totalPartialAmount = partialPayslips.reduce((sum, p) => sum + (p.netSalary || 0), 0)

    const totalPayslips = payslipsData.length
    const processedPayslips = paidPayslips.length + partialPayslips.length
    const processingRate = totalPayslips > 0 ? Math.round((processedPayslips / totalPayslips) * 100) : 0

    return [
      {
        title: "À Payer",
        value: `€${totalPendingAmount.toLocaleString()}`,
        subtitle: `${pendingPayslips.length} bulletins en attente`,
        icon: Euro,
        trend: { value: -15, label: "vs mois dernier" }
      },
      {
        title: "Paiements Effectués",
        value: `€${totalPaidAmount.toLocaleString()}`,
        subtitle: "ce mois",
        icon: CheckCircle,
        trend: { value: 5, label: "progression" }
      },
      {
        title: "Bulletins en Attente",
        value: pendingPayslips.length.toString(),
        subtitle: "à traiter",
        icon: Clock,
        trend: { value: -8, label: "en baisse" }
      },
      {
        title: "Taux de Traitement",
        value: `${processingRate}%`,
        subtitle: "bulletins traités",
        icon: TrendingUp,
        trend: { value: 3, label: "amélioration" }
      }
    ]
  }

  const kpiData = calculateKPIs()

  const pendingPayments = [
    { 
      key: 'employee', 
      title: 'Employé',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            {value.split(' ').map((n) => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-sm">{value}</p>
            <p className="text-xs text-muted-foreground">{row.position}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'amount', 
      title: 'Montant',
      render: (value) => <span className="font-semibold text-primary">€{value.toLocaleString()}</span>
    },
    { 
      key: 'dueDate', 
      title: 'Échéance',
      render: (value, row) => (
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className={`text-sm ${row.urgent ? 'text-destructive font-medium' : ''}`}>
            {value}
          </span>
        </div>
      )
    },
    { 
      key: 'priority', 
      title: 'Priorité',
      render: (value) => (
        <Badge 
          variant={
            value === 'urgent' ? 'destructive' : 
            value === 'high' ? 'secondary' : 
            'outline'
          }
        >
          {value === 'urgent' ? 'Urgent' : 
           value === 'high' ? 'Élevée' : 
           'Normale'}
        </Badge>
      )
    },
    { 
      key: 'actions', 
      title: 'Actions',
      render: () => (
        <Button size="sm" variant="default">
          Traiter
        </Button>
      )
    }
  ]

  // Calculate pending payments from real data
  const pendingData = payslipsData
    .filter(p => p.status === 'EN_ATTENTE')
    .slice(0, 5) // Show only first 5
    .map(payslip => ({
      employee: `${payslip.employee?.firstName || ''} ${payslip.employee?.lastName || ''}`.trim() || 'Employé',
      position: payslip.employee?.poste || 'Poste non défini',
      amount: payslip.netSalary || 0,
      dueDate: 'À traiter',
      priority: 'normal',
      urgent: false,
      payslipId: payslip.id
    }))

  // Calculate recent transactions from real payments data
  const recentTransactions = paymentsData
    .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
    .slice(0, 5) // Show only last 5
    .map(payment => ({
      type: 'payment',
      employee: payment.payslip?.employee ?
        `${payment.payslip.employee.firstName} ${payment.payslip.employee.lastName}` : 'Employé',
      amount: payment.amount,
      time: new Date(payment.paymentDate).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'completed'
    }))

  // Calculate payment methods distribution
  const calculatePaymentMethods = () => {
    const methodCounts = paymentsData.reduce((acc, payment) => {
      const method = payment.mode || 'Non spécifié'
      acc[method] = (acc[method] || 0) + 1
      return acc
    }, {})

    const totalPayments = paymentsData.length
    return Object.entries(methodCounts).map(([method, count]) => ({
      method: method === 'VIREMENT' ? 'Virement bancaire' :
              method === 'CHEQUE' ? 'Chèque' :
              method === 'ESPECES' ? 'Espèces' :
              method === 'OM' ? 'Orange Money' :
              method === 'WAVE' ? 'Wave' : method,
      count,
      percentage: totalPayments > 0 ? Math.round((count / totalPayments) * 100) : 0
    }))
  }

  const paymentMethods = calculatePaymentMethods()

  // Error handling
  if (payslipsError || paymentsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          <p className="text-muted-foreground">
            {payslipsError?.message || paymentsError?.message || 'Erreur lors du chargement des données'}
          </p>
        </div>
      </div>
    )
  }

  // Loading state
  if (payslipsLoading || paymentsLoading) {
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

        {/* Loading progress section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="p-6 border rounded-lg">
              <div className="h-6 w-48 bg-muted rounded mb-4"></div>
              <div className="space-y-4">
                <div className="h-4 w-32 bg-muted rounded"></div>
                <div className="h-3 w-full bg-muted rounded"></div>
              </div>
            </div>
          </div>
          <div className="p-6 border rounded-lg">
            <div className="h-6 w-32 bg-muted rounded mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-2 w-full bg-muted rounded"></div>
                </div>
              ))}
            </div>
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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Caissier</h1>
          <p className="text-muted-foreground">
            Gestion des paiements et suivi financier{user?.entreprise ? ` - ${user.entreprise.name}` : ''}
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payment Progress */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Avancement des Paiements</span>
              </CardTitle>
              <CardDescription>
                Février 2024 - Statut des versements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <p className="text-2xl font-bold text-success">
                    {payslipsData.filter(p => p.status === 'PAYE').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Paiements effectués</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-warning/10">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-8 w-8 text-warning" />
                  </div>
                  <p className="text-2xl font-bold text-warning">
                    {payslipsData.filter(p => p.status === 'EN_ATTENTE').length}
                  </p>
                  <p className="text-sm text-muted-foreground">En attente</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-destructive/10">
                  <div className="flex items-center justify-center mb-2">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  </div>
                  <p className="text-2xl font-bold text-destructive">
                    {payslipsData.filter(p => p.status === 'PARTIEL').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Partiels</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progression globale</span>
                  <span className="text-sm text-muted-foreground">
                    {payslipsData.filter(p => p.status === 'PAYE' || p.status === 'PARTIEL').length}/{payslipsData.length} ({kpiData[3]?.value || '0%'})
                  </span>
                </div>
                <Progress value={parseInt(kpiData[3]?.value || '0')} className="h-3" />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">
                    €{payslipsData.filter(p => p.status === 'PAYE').reduce((sum, p) => sum + (p.netSalary || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Déjà versé</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">
                    €{payslipsData.filter(p => p.status === 'EN_ATTENTE').reduce((sum, p) => sum + (p.netSalary || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Restant à payer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Moyens de Paiement</CardTitle>
              <CardDescription>
                Répartition des paiements effectués
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{method.method}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{method.count}</span>
                        <Badge variant="outline">{method.percentage}%</Badge>
                      </div>
                    </div>
                    <Progress value={method.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pending Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-warning" />
              <span>Paiements en Attente</span>
            </CardTitle>
            <CardDescription>
              Bulletins nécessitant un traitement prioritaire
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Voir tous
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={pendingPayments}
            data={pendingData}
          />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5" />
            <span>Activité Récente</span>
          </CardTitle>
          <CardDescription>
            Derniers paiements effectués aujourd'hui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.employee}</p>
                    <p className="text-xs text-muted-foreground">Paiement traité</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success">€{transaction.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{transaction.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CaissierDashboard