import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Search, Clock, LogOut, User, RefreshCw } from 'lucide-react';
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
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pointage des Employés</h1>
        <p className="text-gray-600">Interface Vigile - Gestion du pointage</p>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un employé (nom, prénom, poste)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{employees.length}</p>
                <p className="text-sm text-gray-600">Total Employés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{attendances.filter(a => a.clockIn).length}</p>
                <p className="text-sm text-gray-600">Pointés Entrée</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <LogOut className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{attendances.filter(a => a.clockOut).length}</p>
                <p className="text-sm text-gray-600">Pointés Sortie</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <RefreshCw className="h-8 w-8 text-gray-500 mr-3" />
              <div>
                <Button onClick={loadData} variant="outline" size="sm">
                  Actualiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des employés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((employee) => {
          const status = getEmployeeStatus(employee);
          return (
            <Card key={employee.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{employee.firstName} {employee.lastName}</span>
                  <Badge variant={employee.isActive ? "default" : "secondary"}>
                    {employee.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-gray-600">{employee.poste}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {status.hasClockedIn && (
                    <p className="text-sm text-green-600">
                      Entrée: {new Date(attendances.find(a => a.employeeId === employee.id)?.clockIn).toLocaleTimeString()}
                    </p>
                  )}
                  {status.hasClockedOut && (
                    <p className="text-sm text-orange-600">
                      Sortie: {new Date(attendances.find(a => a.employeeId === employee.id)?.clockOut).toLocaleTimeString()}
                    </p>
                  )}
                  {!status.hasClockedIn ? (
                    <Button
                      onClick={() => handleClockIn(employee.id)}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={!employee.isActive}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Pointer Entrée
                    </Button>
                  ) : (
                    <div className="text-center text-green-600 font-medium">
                      Entrée Pointée
                    </div>
                  )}

                  {status.hasClockedIn && !status.hasClockedOut ? (
                    <Button
                      onClick={() => handleClockOut(employee.id)}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      disabled={!employee.isActive}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Pointer Sortie
                    </Button>
                  ) : status.hasClockedOut ? (
                    <div className="text-center text-orange-600 font-medium">
                      Sortie Pointée
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredEmployees.length === 0 && !loading && (
        <Alert className="mt-6">
          <AlertDescription>
            {searchTerm ? "Aucun employé trouvé pour cette recherche." : "Aucun employé disponible."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default VigileAttendance;
