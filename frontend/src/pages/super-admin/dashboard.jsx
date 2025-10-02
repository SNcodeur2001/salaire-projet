import * as React from "react"
import { KPICard } from "@/components/ui/kpi-card"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, UserCheck, TrendingUp, Plus, MoreHorizontal } from "lucide-react"

const SuperAdminDashboard = () => {
  // Mock data - Employees KPI removed as per requirements
  const kpiData = [
    {
      title: "Entreprises Actives",
      value: "24",
      subtitle: "organisations",
      icon: Building2,
      trend: { value: 12, label: "ce mois" }
    },
    {
      title: "Utilisateurs Total",
      value: "156",
      subtitle: "administrateurs & caissiers",
      icon: Users,
      trend: { value: 8, label: "nouveaux" }
    },
    {
      title: "Volume Traité",
      value: "€4.2M",
      subtitle: "masse salariale",
      icon: TrendingUp,
      trend: { value: 23, label: "croissance" }
    }
  ]

  const recentCompanies = [
    { key: 'name', title: 'Entreprise' },
    { key: 'sector', title: 'Secteur' },
    { key: 'employees', title: 'Employés' },
    { key: 'status', title: 'Statut', render: (value) => (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        value === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
      }`}>
        {value === 'active' ? 'Actif' : 'En attente'}
      </span>
    )},
    { key: 'actions', title: '', render: () => (
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    )}
  ]

  const companiesData = [
    { name: 'TechCorp SARL', sector: 'Technologie', employees: 45, status: 'active' },
    { name: 'BuildPro SA', sector: 'Construction', employees: 128, status: 'active' },
    { name: 'RetailMax Ltd', sector: 'Commerce', employees: 89, status: 'active' },
    { name: 'HealthCare Plus', sector: 'Santé', employees: 67, status: 'pending' },
    { name: 'EduServ Academy', sector: 'Éducation', employees: 34, status: 'active' }
  ]

  const recentActivity = [
    { type: 'company', message: 'Nouvelle entreprise "FinanceExpert" créée', time: '2 min' },
    { type: 'user', message: 'Admin ajouté pour TechCorp SARL', time: '15 min' },
    { type: 'payroll', message: 'Cycle de paie validé pour BuildPro SA', time: '1h' },
    { type: 'system', message: 'Maintenance système programmée', time: '2h' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vue d'ensemble</h1>
          <p className="text-muted-foreground">
            Gestion globale de la plateforme GES-Salary
          </p>
        </div>
        <Button variant="gradient" icon={<Plus className="h-4 w-4" />}>
          Nouvelle Entreprise
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Companies */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Entreprises Récentes</CardTitle>
                <CardDescription>
                  Dernières organisations ajoutées à la plateforme
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={recentCompanies}
                data={companiesData}
              />
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
              <CardDescription>
                Dernières actions sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`flex h-2 w-2 mt-2 rounded-full ${
                      activity.type === 'company' ? 'bg-primary' :
                      activity.type === 'user' ? 'bg-success' :
                      activity.type === 'payroll' ? 'bg-warning' : 'bg-muted-foreground'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        Il y a {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Croissance de la Plateforme</CardTitle>
          <CardDescription>
            Évolution du nombre d'entreprises et d'employés sur 12 mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
            <div className="text-center space-y-2">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                Graphique d'analytique à intégrer
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SuperAdminDashboard