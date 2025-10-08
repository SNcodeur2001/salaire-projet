import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api"
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
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip } from "recharts"

const AdminDashboard = () => {
  const { user } = useAuth()

  // Fetch employees
  const { data: employeesData = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees', user?.entrepriseId],
    queryFn: () => apiClient.getEmployees({ entrepriseId: user?.entrepriseId }),
    enabled: !!user,
  })

  // Fetch payruns
  const { data: payrunsData = [], isLoading: payrunsLoading } = useQuery({
    queryKey: ['payruns', user?.entrepriseId],
    queryFn: () => apiClient.getPayruns({ entrepriseId: user?.entrepriseId }),
    enabled: !!user,
  })

  // Fetch payslips
  const { data: payslipsData = [], isLoading: payslipsLoading } = useQuery({
    queryKey: ['payslips', user?.entrepriseId],
    queryFn: () => apiClient.getPayslips({ entrepriseId: user?.entrepriseId }),
    enabled: !!user,
  })

  // Calculate KPIs from real data
  const kpiData = React.useMemo(() => {
    const totalEmployees = employeesData.length
    const totalGross = payslipsData.reduce((sum, p) => sum + (p.grossSalary || 0), 0)
    const totalNet = payslipsData.reduce((sum, p) => sum + (p.netSalary || 0), 0)
    const paidPayslips = payslipsData.filter(p => p.status === 'PAYE').length
    const totalPayslips = payslipsData.length

    return [
      {
        title: "Masse Salariale",
        value: `€${totalGross.toLocaleString()}`,
        subtitle: "ce mois",
        icon: Euro,
        trend: { value: 5, label: "vs mois dernier" }
      },
      {
        title: "Employés Actifs",
        value: totalEmployees.toString(),
        subtitle: "contrats en cours",
        icon: Users,
        trend: { value: 3, label: "nouveaux" }
      },
      {
        title: "Bulletins Générés",
        value: totalPayslips.toString(),
        subtitle: `sur ${totalEmployees} employés`,
        icon: Calculator,
        trend: { value: totalEmployees > 0 ? Math.round((totalPayslips / totalEmployees) * 100) : 0, label: `${totalEmployees > 0 ? Math.round((totalPayslips / totalEmployees) * 100) : 0}% complété` }
      },
      {
        title: "Montant Payé",
        value: `€${totalNet.toLocaleString()}`,
        subtitle: `${paidPayslips} bulletins payés`,
        icon: TrendingUp,
        trend: { value: totalPayslips > 0 ? Math.round((paidPayslips / totalPayslips) * 100) : 0, label: `${totalPayslips > 0 ? Math.round((paidPayslips / totalPayslips) * 100) : 0}% versé` }
      }
    ]
  }, [employeesData, payslipsData])

  // Calculate payroll progress
  const payrollProgress = React.useMemo(() => {
    const total = employeesData.length
    const generated = payslipsData.length
    const validated = payslipsData.filter(p => p.status === 'PAYE' || p.status === 'EN_ATTENTE').length
    const paid = payslipsData.filter(p => p.status === 'PAYE').length

    return { total, generated, validated, paid }
  }, [employeesData, payslipsData])

  // Prepare monthly payroll data (group by cycle.period if available)
  const payrollSeries = React.useMemo(() => {
    const map = new Map()
    for (const p of payslipsData) {
      const key = p?.cycle?.period || 'Actuel'
      const val = Number(p?.netSalary || 0)
      map.set(key, (map.get(key) || 0) + val)
    }
    const arr = Array.from(map.entries()).map(([period, total]) => ({ period, total }))
    // Keep last 6 entries for readability
    return arr.slice(-6)
  }, [payslipsData])



  const recentPayslips = [
    {
      key: 'employee',
      title: 'Employé',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            {row.employee.firstName[0] + row.employee.lastName[0]}
          </div>
          <div>
            <p className="font-medium text-sm">{row.employee.firstName} {row.employee.lastName}</p>
            <p className="text-xs text-muted-foreground">{row.employee.position}</p>
          </div>
        </div>
      )
    },
    {
      key: 'grossSalary',
      title: 'Brut',
      render: (value) => <span className="font-medium">€{value?.toLocaleString() || 0}</span>
    },
    {
      key: 'netSalary',
      title: 'Net',
      render: (value) => <span className="font-semibold text-primary">€{value?.toLocaleString() || 0}</span>
    },
    {
      key: 'status',
      title: 'Statut',
      render: (value) => (
        <Badge
          variant={
            value === 'PAYE' ? 'default' :
            value === 'EN_ATTENTE' ? 'secondary' :
            'destructive'
          }
        >
          {value === 'PAYE' ? (
            <><CheckCircle className="mr-1 h-3 w-3" />Payé</>
          ) : value === 'EN_ATTENTE' ? (
            <><Clock className="mr-1 h-3 w-3" />En attente</>
          ) : (
            <><AlertCircle className="mr-1 h-3 w-3" />Erreur</>
          )}
        </Badge>
      )
    }
  ]



  const upcomingTasks = [
    { task: 'Validation du cycle de paie février', deadline: 'Dans 2 jours', priority: 'high' },
    { task: 'Génération des bulletins mars', deadline: 'Dans 5 jours', priority: 'medium' },
    { task: 'Export déclarations sociales', deadline: 'Dans 1 semaine', priority: 'medium' },
    { task: 'Révision des contrats saisonniers', deadline: 'Dans 10 jours', priority: 'low' }
  ]



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de la gestion des salaires
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
            data={payslipsData.slice(0, 5)} // Show only recent 5
            loading={payslipsLoading}
            emptyMessage="Aucun bulletin de paie trouvé"
          />
        </CardContent>
      </Card>

      {/* Analytics Chart */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Évolution de la Masse Salariale</CardTitle>
          <CardDescription>
            Comparaison sur les 6 dernières périodes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payrollSeries.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
              <div className="text-center space-y-2">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">Aucune donnée disponible</p>
              </div>
            </div>
          ) : (
            <div className="h-64 animate-fade-in overflow-hidden">
              <ChartContainer
                config={{ payroll: { label: "Masse salariale", color: "hsl(var(--primary))" } }}
                className="w-full"
              >
                <AreaChart data={payrollSeries} margin={{ left: 12, right: 12, top: 10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="fill-payroll" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-payroll)" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="var(--color-payroll)" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <Tooltip content={<ChartTooltipContent indicator="line" />} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="var(--color-payroll)"
                    strokeWidth={2}
                    fill="url(#fill-payroll)"
                    activeDot={{ r: 4 }}
                    dot={{ r: 2 }}
                    isAnimationActive
                  />
                </AreaChart>
                <ChartLegendContent className="pt-2" payload={[{ value: "Masse salariale", color: "hsl(var(--primary))", dataKey: "payroll" }]} />
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard
