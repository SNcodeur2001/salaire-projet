import * as React from "react"
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
  // Mock data
  const kpiData = [
    {
      title: "À Payer",
      value: "€16,650",
      subtitle: "bulletins en attente",
      icon: Euro,
      trend: { value: -15, label: "vs mois dernier" }
    },
    {
      title: "Paiements Effectués",
      value: "€268,750",
      subtitle: "ce mois",
      icon: CheckCircle,
      trend: { value: 5, label: "progression" }
    },
    {
      title: "Bulletins en Attente",
      value: "39",
      subtitle: "à traiter",
      icon: Clock,
      trend: { value: -8, label: "en baisse" }
    },
    {
      title: "Taux de Traitement",
      value: "94%",
      subtitle: "bulletins payés",
      icon: TrendingUp,
      trend: { value: 3, label: "amélioration" }
    }
  ]

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

  const pendingData = [
    { employee: 'Sophie Leroy', position: 'Designer UX/UI', amount: 2950, dueDate: 'Aujourd\'hui', priority: 'urgent', urgent: true },
    { employee: 'Jean Moreau', position: 'Développeur Junior', amount: 2280, dueDate: 'Demain', priority: 'high', urgent: false },
    { employee: 'Thomas Garcia', position: 'Stagiaire Marketing', amount: 515, dueDate: '2 jours', priority: 'normal', urgent: false },
    { employee: 'Julien Simon', position: 'Support Technique', amount: 2020, dueDate: '3 jours', priority: 'normal', urgent: false },
    { employee: 'Émilie Laurent', position: 'Comptable', amount: 2450, dueDate: 'En erreur', priority: 'urgent', urgent: true }
  ]

  const recentTransactions = [
    { type: 'payment', employee: 'Marie Dubois', amount: 3420, time: '10:30', status: 'completed' },
    { type: 'payment', employee: 'Pierre Martin', amount: 3900, time: '10:15', status: 'completed' },
    { type: 'payment', employee: 'Claire Bernard', amount: 3200, time: '09:45', status: 'completed' },
    { type: 'payment', employee: 'Nicolas Petit', amount: 3650, time: '09:30', status: 'completed' },
    { type: 'payment', employee: 'Isabelle Roux', amount: 4180, time: '09:15', status: 'completed' }
  ]

  const paymentMethods = [
    { method: 'Virement bancaire', count: 85, percentage: 69 },
    { method: 'Chèque', count: 23, percentage: 19 },
    { method: 'Espèces', count: 15, percentage: 12 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Caissier</h1>
          <p className="text-muted-foreground">
            Gestion des paiements et suivi financier - TechCorp SARL
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
                  <p className="text-2xl font-bold text-success">85</p>
                  <p className="text-sm text-muted-foreground">Paiements effectués</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-warning/10">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-8 w-8 text-warning" />
                  </div>
                  <p className="text-2xl font-bold text-warning">39</p>
                  <p className="text-sm text-muted-foreground">En attente</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-destructive/10">
                  <div className="flex items-center justify-center mb-2">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  </div>
                  <p className="text-2xl font-bold text-destructive">4</p>
                  <p className="text-sm text-muted-foreground">En erreur</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progression globale</span>
                  <span className="text-sm text-muted-foreground">85/128 (66%)</span>
                </div>
                <Progress value={66} className="h-3" />
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">€268,750</p>
                  <p className="text-sm text-muted-foreground">Déjà versé</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">€16,650</p>
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