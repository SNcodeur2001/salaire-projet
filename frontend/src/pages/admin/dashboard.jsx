import * as React from "react"
import { KPICard } from "@/components/ui/kpi-card"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Euro,
  Users,
  Calculator,
  TrendingUp,
  Plus,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

const AdminDashboard = () => {
  // Mock data
  const kpiData = [
    {
      title: "Masse Salariale",
      value: "€285,400",
      subtitle: "ce mois",
      icon: Euro,
      trend: { value: 5, label: "vs mois dernier" }
    },
    {
      title: "Employés Actifs",
      value: "128",
      subtitle: "contrats en cours",
      icon: Users,
      trend: { value: 3, label: "nouveaux" }
    },
    {
      title: "Bulletins Générés",
      value: "124",
      subtitle: "sur 128 employés",
      icon: Calculator,
      trend: { value: 96, label: "96% complété" }
    },
    {
      title: "Montant Payé",
      value: "€268,750",
      subtitle: "reste €16,650",
      icon: TrendingUp,
      trend: { value: 94, label: "94% versé" }
    }
  ]

  const recentPayslips = [
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
      key: 'gross',
      title: 'Brut',
      render: (value) => <span className="font-medium">€{value.toLocaleString()}</span>
    },
    {
      key: 'net',
      title: 'Net',
      render: (value) => <span className="font-semibold text-primary">€{value.toLocaleString()}</span>
    },
    {
      key: 'status',
      title: 'Statut',
      render: (value) => (
        <Badge
          variant={
            value === 'paid' ? 'default' :
            value === 'pending' ? 'secondary' :
            'destructive'
          }
        >
          {value === 'paid' ? (
            <><CheckCircle className="mr-1 h-3 w-3" />Payé</>
          ) : value === 'pending' ? (
            <><Clock className="mr-1 h-3 w-3" />En attente</>
          ) : (
            <><AlertCircle className="mr-1 h-3 w-3" />Erreur</>
          )}
        </Badge>
      )
    }
  ]

  const payslipsData = [
    { employee: 'Marie Dubois', position: 'Développeuse Senior', gross: 4500, net: 3420, status: 'paid' },
    { employee: 'Pierre Martin', position: 'Chef de Projet', gross: 5200, net: 3900, status: 'paid' },
    { employee: 'Sophie Leroy', position: 'Designer UX/UI', gross: 3800, net: 2950, status: 'pending' },
    { employee: 'Jean Moreau', position: 'Développeur Junior', gross: 2800, net: 2280, status: 'pending' },
    { employee: 'Claire Bernard', position: 'Analyste Business', gross: 4200, net: 3200, status: 'paid' }
  ]

  const upcomingTasks = [
    { task: 'Validation du cycle de paie février', deadline: 'Dans 2 jours', priority: 'high' },
    { task: 'Génération des bulletins mars', deadline: 'Dans 5 jours', priority: 'medium' },
    { task: 'Export déclarations sociales', deadline: 'Dans 1 semaine', priority: 'medium' },
    { task: 'Révision des contrats saisonniers', deadline: 'Dans 10 jours', priority: 'low' }
  ]

  const payrollProgress = {
    total: 128,
    generated: 124,
    validated: 98,
    paid: 85
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de la gestion des salaires - TechCorp SARL
          </p>
        </div>
        <Button variant="gradient" icon={<Plus className="h-4 w-4" />}>
          Nouveau Cycle de Paie
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payroll Progress */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Avancement du Cycle de Paie</CardTitle>
              <CardDescription>
                Février 2024 - Statut en temps réel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bulletins générés</span>
                  <span className="text-sm text-muted-foreground">
                    {payrollProgress.generated}/{payrollProgress.total}
                  </span>
                </div>
                <Progress value={(payrollProgress.generated / payrollProgress.total) * 100} className="h-2" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bulletins validés</span>
                  <span className="text-sm text-muted-foreground">
                    {payrollProgress.validated}/{payrollProgress.total}
                  </span>
                </div>
                <Progress value={(payrollProgress.validated / payrollProgress.total) * 100} className="h-2" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Paiements effectués</span>
                  <span className="text-sm text-muted-foreground">
                    {payrollProgress.paid}/{payrollProgress.total}
                  </span>
                </div>
                <Progress value={(payrollProgress.paid / payrollProgress.total) * 100} className="h-2" />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" size="sm">
                  Voir détails
                </Button>
                <Button variant="default" size="sm">
                  Finaliser le cycle
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Tâches à venir</CardTitle>
              <CardDescription>
                Échéances importantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      task.priority === 'high' ? 'bg-destructive' :
                      task.priority === 'medium' ? 'bg-warning' : 'bg-success'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{task.task}</p>
                      <p className="text-xs text-muted-foreground">{task.deadline}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Payslips */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Bulletins de Paie Récents</CardTitle>
            <CardDescription>
              Derniers bulletins générés et leur statut de paiement
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Voir tous les bulletins
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={recentPayslips}
            data={payslipsData}
          />
        </CardContent>
      </Card>

      {/* Analytics Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution de la Masse Salariale</CardTitle>
          <CardDescription>
            Comparaison sur les 6 derniers mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
            <div className="text-center space-y-2">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                Graphique d'évolution à intégrer
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard
