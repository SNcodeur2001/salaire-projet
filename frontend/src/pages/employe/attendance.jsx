import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Search, Filter, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors = {
  PRESENT: 'bg-green-100 text-green-800',
  LATE: 'bg-orange-100 text-orange-800',
  ABSENT: 'bg-red-100 text-red-800',
};

const EmployeAttendance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attendances, setAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
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
      setFilteredAttendances(data);
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

  useEffect(() => {
    let filtered = attendances;

    if (searchTerm) {
      filtered = filtered.filter((a) =>
        new Date(a.date).toLocaleDateString().includes(searchTerm)
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    setFilteredAttendances(filtered);
  }, [searchTerm, statusFilter, attendances]);

  // Calculate summary counts
  const presentCount = attendances.filter((a) => a.status === 'PRESENT').length;
  const lateCount = attendances.filter((a) => a.status === 'LATE').length;
  const absentCount = attendances.filter((a) => a.status === 'ABSENT').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Présences & Salaires</h1>
          <p className="text-muted-foreground mt-1">
            Consultez votre historique de présence et vos bulletins de paie
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
                {user?.email ? user.email[0].toUpperCase() : 'E'}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.email}</h2>
              <p className="text-muted-foreground font-medium">Employé</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
          <TabsTrigger value="attendance" className="text-base">
            <Clock className="mr-2 h-4 w-4" />
            Présences
          </TabsTrigger>
          <TabsTrigger value="salary" className="text-base">
            <Calendar className="mr-2 h-4 w-4" />
            Salaires
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-6 mt-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Présent</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{presentCount}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-green-600/5 flex items-center justify-center">
                    <CheckCircle className="h-7 w-7 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Retard</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{lateCount}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-orange-600/5 flex items-center justify-center">
                    <AlertCircle className="h-7 w-7 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Absent</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{absentCount}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-red-600/5 flex items-center justify-center">
                    <XCircle className="h-7 w-7 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance History */}
          <Card className="card-elevated">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">Historique de présence</CardTitle>
                  <CardDescription className="mt-1">
                    {filteredAttendances.length} enregistrement{filteredAttendances.length > 1 ? 's' : ''} trouvé{filteredAttendances.length > 1 ? 's' : ''}
                  </CardDescription>
                </div>
                
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par date..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64 h-11"
                    />
                  </div>
                  
                  <Select onValueChange={setStatusFilter} value={statusFilter}>
                    <SelectTrigger className="w-full sm:w-48 h-11">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tous les statuts</SelectItem>
                      <SelectItem value="PRESENT">
                        <div className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-success" />
                          Présent
                        </div>
                      </SelectItem>
                      <SelectItem value="LATE">
                        <div className="flex items-center">
                          <AlertCircle className="mr-2 h-4 w-4 text-warning" />
                          Retard
                        </div>
                      </SelectItem>
                      <SelectItem value="ABSENT">
                        <div className="flex items-center">
                          <XCircle className="mr-2 h-4 w-4 text-destructive" />
                          Absent
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/2">Date</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendances.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Clock className="h-12 w-12 text-muted-foreground/50" />
                            <p className="text-muted-foreground font-medium">Aucun enregistrement trouvé</p>
                            <p className="text-sm text-muted-foreground">Essayez de modifier vos filtres</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredAttendances.map((attendance) => (
                      <TableRow key={attendance.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(attendance.date).toLocaleDateString('fr-FR', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-semibold",
                              attendance.status === 'PRESENT' && 'text-green-600 border-green-200 bg-green-50',
                              attendance.status === 'LATE' && 'text-orange-600 border-orange-200 bg-orange-50',
                              attendance.status === 'ABSENT' && 'text-red-600 border-red-200 bg-red-50'
                            )}
                          >
                            {attendance.status === 'PRESENT' && <CheckCircle className="mr-1 h-3 w-3" />}
                            {attendance.status === 'LATE' && <AlertCircle className="mr-1 h-3 w-3" />}
                            {attendance.status === 'ABSENT' && <XCircle className="mr-1 h-3 w-3" />}
                            {attendance.status === 'PRESENT' ? 'Présent' : 
                             attendance.status === 'LATE' ? 'Retard' : 'Absent'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Historique des salaires</CardTitle>
              <CardDescription className="mt-1">
                Consultez vos bulletins de paie et détails de rémunération
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Période</TableHead>
                      <TableHead className="text-right">Salaire brut</TableHead>
                      <TableHead className="text-right">Charges</TableHead>
                      <TableHead className="text-right">Salaire net</TableHead>
                      <TableHead className="text-right">Heures</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payslips.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Calendar className="h-12 w-12 text-muted-foreground/50" />
                            <p className="text-muted-foreground font-medium">Aucun bulletin de paie trouvé</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {payslips.map((payslip) => (
                      <TableRow key={payslip.id} className="hover:bg-muted/50">
                        <TableCell className="font-semibold">{payslip.cycle.period}</TableCell>
                        <TableCell className="text-right font-medium">{payslip.grossSalary.toFixed(2)} €</TableCell>
                        <TableCell className="text-right text-red-600 font-medium">-{payslip.deductions.toFixed(2)} €</TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-green-600 text-lg">{payslip.netSalary.toFixed(2)} €</span>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {payslip.hoursWorked ? `${payslip.hoursWorked.toFixed(1)}h` : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeAttendance;
