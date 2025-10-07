import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/enhanced-button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Search, Clock, LogOut, User, RefreshCw, UserCheck, Users, CheckCircle, XCircle } from 'lucide-react';
import { apiClient } from '../../lib/api';
import { useToast } from '../../hooks/use-toast';

const VigileAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(employee =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.poste.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [employees, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [employeesData, attendancesData] = await Promise.all([
        apiClient.getEmployees(),
        apiClient.getAttendanceByDate(new Date().toISOString().split('T')[0])
      ]);
      setEmployees(employeesData);
      setAttendances(attendancesData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async (employeeId) => {
    try {
      await apiClient.markClockIn(employeeId, new Date().toISOString().split('T')[0]);
      toast({
        title: "Pointage entrée",
        description: "Pointage d'entrée enregistré avec succès",
      });
      loadData(); // Recharger pour mettre à jour les statuts
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors du pointage d'entrée",
        variant: "destructive",
      });
    }
  };

  const handleClockOut = async (employeeId) => {
    try {
      await apiClient.markClockOut(employeeId, new Date().toISOString().split('T')[0]);
      toast({
        title: "Pointage sortie",
        description: "Pointage de sortie enregistré avec succès",
      });
      loadData(); // Recharger pour mettre à jour les statuts
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors du pointage de sortie",
        variant: "destructive",
      });
    }
  };

  const getEmployeeStatus = (employee) => {
    const attendance = attendances.find(a => a.employeeId === employee.id);
    if (!attendance) {
      return { hasClockedIn: false, hasClockedOut: false };
    }
    return {
      hasClockedIn: !!attendance.clockIn,
      hasClockedOut: !!attendance.clockOut,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pointage des Employés</h1>
          <p className="text-muted-foreground mt-1">
            Interface Vigile - Gestion des entrées et sorties
          </p>
        </div>
        <Button 
          onClick={loadData} 
          variant="outline" 
          size="lg"
          loading={loading}
          icon={<RefreshCw className="h-4 w-4" />}
        >
          Actualiser
        </Button>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher un employé par nom, prénom ou poste..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Employés</p>
                <p className="text-3xl font-bold text-primary mt-2">{employees.length}</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center">
                <Users className="h-7 w-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Entrées</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{attendances.filter(a => a.clockIn).length}</p>
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
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Sorties</p>
                <p className="text-3xl font-bold text-gray-600 mt-2">{attendances.filter(a => a.clockOut).length}</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-gray-600/5 flex items-center justify-center">
                <LogOut className="h-7 w-7 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Absents</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {employees.length - attendances.filter(a => a.clockIn).length}
                </p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-red-600/5 flex items-center justify-center">
                <XCircle className="h-7 w-7 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des employés */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Employés ({filteredEmployees.length})
          </h2>
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSearchTerm('')}
            >
              Réinitialiser la recherche
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => {
            const status = getEmployeeStatus(employee);
            const attendance = attendances.find(a => a.employeeId === employee.id);
            
            return (
              <Card key={employee.id} className="group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                          {employee.firstName[0]}{employee.lastName[0]}
                        </div>
                      <div>
                        <CardTitle className="text-lg">
                          {employee.firstName} {employee.lastName}
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {employee.poste}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={employee.isActive ? "default" : "secondary"}
                      className={employee.isActive ? "bg-green-500 hover:bg-green-500/80 text-white" : ""}
                    >
                      {employee.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Status Display */}
                  <div className="space-y-2 p-3 rounded-md bg-muted/50">
                    {status.hasClockedIn ? (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Entrée:</span>
                        <span className="font-semibold text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          {new Date(attendance?.clockIn).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Entrée:</span>
                        <span className="text-red-600 font-semibold">Non pointée</span>
                      </div>
                    )}

                    {status.hasClockedOut ? (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Sortie:</span>
                        <span className="font-semibold text-gray-600 flex items-center gap-1">
                          <LogOut className="h-4 w-4" />
                          {new Date(attendance?.clockOut).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    ) : status.hasClockedIn ? (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Sortie:</span>
                        <span className="text-muted-foreground font-semibold">En attente</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {!status.hasClockedIn ? (
                      <Button
                        onClick={() => handleClockIn(employee.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        disabled={!employee.isActive}
                        size="lg"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Pointer Entrée
                      </Button>
                    ) : !status.hasClockedOut ? (
                      <Button
                        onClick={() => handleClockOut(employee.id)}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                        disabled={!employee.isActive}
                        size="lg"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Pointer Sortie
                      </Button>
                    ) : (
                      <div className="w-full p-3 rounded-md bg-gray-100 border border-gray-200 text-center">
                        <p className="text-sm font-semibold text-gray-700">
                          ✓ Journée complète
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {filteredEmployees.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserCheck className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-semibold text-muted-foreground mb-2">
              {searchTerm ? "Aucun employé trouvé" : "Aucun employé disponible"}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchTerm ? "Essayez de modifier votre recherche" : "Aucun employé n'est enregistré dans le système"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VigileAttendance;
