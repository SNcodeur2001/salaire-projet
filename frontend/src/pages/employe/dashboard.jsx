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
      <Card>
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Attendance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Présences Récentes</CardTitle>
              <CardDescription>
                Vos dernières présences
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/employe/attendance')}>
              <Eye className="mr-2 h-4 w-4" />
              Voir tout
            </Button>
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
        <Card>
          <CardHeader>
            <CardTitle>Bulletins de Paie Récents</CardTitle>
            <CardDescription>
              Vos derniers bulletins
            </CardDescription>
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
