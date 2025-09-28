import * as React from "react"
import { useState } from "react"
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
  TrendingUp
} from "lucide-react"

const CaissierPaiements = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const kpiData = [
    {
      title: "Paiements Aujourd'hui",
      value: "€18,950",
      subtitle: "12 transactions",
      icon: Euro,
      trend: { value: 8, label: "vs hier" }
    },
    {
      title: "Total ce Mois",
      value: "€268,750",
      subtitle: "85 paiements",
      icon: TrendingUp,
      trend: { value: 12, label: "progression" }
    },
    {
      title: "Taux de Réussite",
      value: "98.5%",
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

  const columns = [
    { 
      key: 'employee', 
      title: 'Bénéficiaire',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            {value.split(' ').map((n) => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-sm text-muted-foreground">{row.reference}</p>
          </div>
        </div>
      )
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
      key: 'method', 
      title: 'Méthode',
      render: (value) => (
        <Badge variant="outline">
          {value === 'bank_transfer' ? 'Virement' : 
           value === 'check' ? 'Chèque' : 'Espèces'}
        </Badge>
      )
    },
    { 
      key: 'date', 
      title: 'Date',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      )
    },
    { 
      key: 'status', 
      title: 'Statut',
      render: (value) => (
        <Badge variant={value === 'completed' ? 'default' : 'secondary'}>
          <CheckCircle className="mr-1 h-3 w-3" />
          {value === 'completed' ? 'Traité' : 'En cours'}
        </Badge>
      )
    }
  ]

  const paymentsData = [
    { employee: 'Marie Dubois', reference: 'PAY-2024-001', amount: 3420, method: 'bank_transfer', date: '03/03/2024', status: 'completed' },
    { employee: 'Pierre Martin', reference: 'PAY-2024-002', amount: 3900, method: 'bank_transfer', date: '03/03/2024', status: 'completed' },
    { employee: 'Claire Bernard', reference: 'PAY-2024-003', amount: 3200, method: 'bank_transfer', date: '03/03/2024', status: 'completed' },
    { employee: 'Nicolas Petit', reference: 'PAY-2024-004', amount: 3650, method: 'bank_transfer', date: '03/03/2024', status: 'completed' },
    { employee: 'Isabelle Roux', reference: 'PAY-2024-005', amount: 4180, method: 'check', date: '02/03/2024', status: 'completed' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paiements</h1>
          <p className="text-muted-foreground">
            Historique et gestion des transactions
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
                Transactions récentes et leur statut
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
            data={paymentsData}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default CaissierPaiements