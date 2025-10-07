import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/ui/kpi-card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign, TrendingUp, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip } from 'recharts';

const statusColors = {
  PRESENT: 'bg-green-100 text-green-800',
  LATE: 'bg-orange-100 text-orange-800',
  ABSENT: 'bg-red-100 text-red-800',
};

const EmployeDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [attendances, setAttendances] = useState([]);
  const [payslips, setPayslips] = useState([]);

  useEffect(() => {
    if (user) {
      loadAttendance();
      loadPayslips();
    }
  }, [user]);

  const loadAttendance = async () => {
    try {
      const data = await apiClient.getMyAttendance();
      setAttendances(data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors du chargement des présences',
        variant: 'destructive',
      });
    }
  };

  const loadPayslips = async () => {
    try {
      const data = await apiClient.getMyPayslips();
      setPayslips(data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors du chargement des bulletins de paie',
        variant: 'destructive',
      });
    }
  };

  // Calculate summary counts
  const presentCount = attendances.filter((a) => a.status === 'PRESENT').length;
  const lateCount = attendances.filter((a) => a.status === 'LATE').length;
  const absentCount = attendances.filter((a) => a.status === 'ABSENT').length;

  // Build attendance trend over recent dates
  const attendanceSeries = React.useMemo(() => {
    const map = new Map();
    const sorted = [...attendances]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-10);
    for (const a of sorted) {
      const d = new Date(a.date);
      const key = d.toLocaleDateString();
      if (!map.has(key)) map.set(key, { date: key, PRESENT: 0, LATE: 0, ABSENT: 0 });
      const row = map.get(key);
      row[a.status] = (row[a.status] || 0) + 1;
    }
    return Array.from(map.values());
  }, [attendances]);

  // KPI data
  const kpiData = [
    {
      title: "Présent",
      value: presentCount.toString(),
      subtitle: "ce mois",
      icon: Calendar,
      trend: { value: 0, label: "" } // No trend for now
    },
    {
      title: "Retard",
      value: lateCount.toString(),
      subtitle: "ce mois",
      icon: Clock,
      trend: { value: 0, label: "" }
    },
    {
      title: "Absent",
      value: absentCount.toString(),
      subtitle: "ce mois",
      icon: TrendingUp,
      trend: { value: 0, label: "" }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Employé</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de vos informations
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Mon Profil</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-6">
          <img
            src={user?.photo || '/placeholder.svg'}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{user?.email}</h2>
            <p className="text-muted-foreground">Employé</p>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Attendance Trend Chart */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Tendance de présence</CardTitle>
          <CardDescription>Évolution de vos présences sur les derniers jours</CardDescription>
        </CardHeader>
        <CardContent>
          {attendanceSeries.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">
              <div className="text-center space-y-2">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">Aucune donnée de présence disponible</p>
              </div>
            </div>
          ) : (
            <div className="h-72 animate-fade-in">
              <ChartContainer
                config={{
                  present: { label: 'Présent', color: 'hsl(var(--success))' },
                  late: { label: 'Retard', color: 'hsl(var(--warning))' },
                  absent: { label: 'Absent', color: 'hsl(var(--destructive))' },
                }}
                className="w-full h-full"
              >
                <AreaChart data={attendanceSeries} margin={{ left: 12, right: 12, top: 10, bottom: 10 }}>
                  <defs>
                    <linearGradient id="fill-present-emp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-present)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-present)" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="fill-late-emp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-late)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-late)" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="fill-absent-emp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-absent)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-absent)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickLine={false} 
                    axisLine={false} 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                  <Area 
                    type="monotone" 
                    dataKey="PRESENT" 
                    name="Présent" 
                    stroke="var(--color-present)" 
                    fill="url(#fill-present-emp)" 
                    strokeWidth={2.5} 
                    activeDot={{ r: 5, strokeWidth: 2 }} 
                    dot={{ r: 3, strokeWidth: 2 }} 
                    isAnimationActive 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="LATE" 
                    name="Retard" 
                    stroke="var(--color-late)" 
                    fill="url(#fill-late-emp)" 
                    strokeWidth={2.5} 
                    activeDot={{ r: 5, strokeWidth: 2 }} 
                    dot={{ r: 3, strokeWidth: 2 }} 
                    isAnimationActive 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ABSENT" 
                    name="Absent" 
                    stroke="var(--color-absent)" 
                    fill="url(#fill-absent-emp)" 
                    strokeWidth={2.5} 
                    activeDot={{ r: 5, strokeWidth: 2 }} 
                    dot={{ r: 3, strokeWidth: 2 }} 
                    isAnimationActive 
                  />
                </AreaChart>
                <ChartLegendContent 
                  className="pt-4 flex justify-center" 
                  payload={[
                    { value: 'Présent', color: 'hsl(var(--success))', dataKey: 'present' },
                    { value: 'Retard', color: 'hsl(var(--warning))', dataKey: 'late' },
                    { value: 'Absent', color: 'hsl(var(--destructive))', dataKey: 'absent' },
                  ]} 
                />
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Data Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Attendance */}
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Présences Récentes</CardTitle>
                <CardDescription>
                  Vos 5 derniers enregistrements
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/employe/attendance')}>
                <Eye className="mr-2 h-4 w-4" />
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendances.slice(0, 5).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      Aucun enregistrement trouvé.
                    </TableCell>
                  </TableRow>
                )}
                {attendances.slice(0, 5).map((attendance) => (
                  <TableRow key={attendance.id}>
                    <TableCell>{new Date(attendance.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          attendance.status === 'PRESENT' ? 'default' :
                          attendance.status === 'LATE' ? 'secondary' : 'destructive'
                        }
                      >
                        {attendance.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Payslips */}
        <Card className="card-elevated">
          <CardHeader>
            <div>
              <CardTitle>Bulletins de Paie Récents</CardTitle>
              <CardDescription>
                Vos 5 derniers bulletins de salaire
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Période</TableHead>
                  <TableHead>Salaire net</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips.slice(0, 5).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      Aucun bulletin trouvé.
                    </TableCell>
                  </TableRow>
                )}
                {payslips.slice(0, 5).map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell>{payslip.cycle.period}</TableCell>
                    <TableCell>{payslip.netSalary.toFixed(2)} €</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeDashboard;
