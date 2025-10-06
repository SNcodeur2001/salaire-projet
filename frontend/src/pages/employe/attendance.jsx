import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  useEffect(() => {
    if (user) {
      loadAttendance();
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
    <div className="p-6 space-y-6">
      <Card className="bg-white shadow rounded-lg">
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

      <div className="grid grid-cols-3 gap-6">
        <Card className="bg-green-50">
          <CardContent>
            <p className="text-2xl font-bold text-green-700">{presentCount}</p>
            <p className="text-green-700 font-semibold">Présent</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50">
          <CardContent>
            <p className="text-2xl font-bold text-orange-700">{lateCount}</p>
            <p className="text-orange-700 font-semibold">Retard</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50">
          <CardContent>
            <p className="text-2xl font-bold text-red-700">{absentCount}</p>
            <p className="text-red-700 font-semibold">Absent</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Historique de présence</CardTitle>
          <div className="flex space-x-4">
            <Input
              placeholder="Rechercher par date (jj/mm/aaaa)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Select onValueChange={setStatusFilter} value={statusFilter} className="w-48">
              <SelectTrigger>
                <SelectValue>{statusFilter === 'ALL' ? 'Tous les statuts' : statusFilter}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les statuts</SelectItem>
                <SelectItem value="PRESENT">Présent</SelectItem>
                <SelectItem value="LATE">Retard</SelectItem>
                <SelectItem value="ABSENT">Absent</SelectItem>
              </SelectContent>
            </Select>
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
              {filteredAttendances.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    Aucun enregistrement trouvé.
                  </TableCell>
                </TableRow>
              )}
              {filteredAttendances.map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell>{new Date(attendance.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-block rounded-full px-3 py-1 text-xs font-semibold',
                        statusColors[attendance.status] || 'bg-gray-100 text-gray-800'
                      )}
                    >
                      {attendance.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeAttendance;
