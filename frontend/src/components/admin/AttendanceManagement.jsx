import * as React from "react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api"
import { Button } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DataTable } from "@/components/ui/data-table"
import { Clock, Calendar, AlertTriangle, CheckCircle, LogIn, LogOut } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function AttendanceManagement() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const queryClient = useQueryClient()

  // Fetch attendance data for selected date
  const { data: attendances = [], isLoading, error, refetch } = useQuery({
    queryKey: ['attendance-by-date', selectedDate],
    queryFn: () => apiClient.getAttendanceByDate(selectedDate),
    enabled: !!selectedDate,
  })

  // Fetch all employees
  const { data: allEmployees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => apiClient.getEmployees(),
  })

  // Mutations for marking attendance
  const markClockInMutation = useMutation({
    mutationFn: ({ employeeId, date }) => apiClient.markClockIn(employeeId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-by-date', selectedDate] })
      toast.success("Pointage d'entrée marqué avec succès")
    },
    onError: (error) => {
      toast.error("Erreur lors du pointage d'entrée: " + error.message)
    },
  })

  const markClockOutMutation = useMutation({
    mutationFn: ({ employeeId, date }) => apiClient.markClockOut(employeeId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-by-date', selectedDate] })
      toast.success("Pointage de sortie marqué avec succès")
    },
    onError: (error) => {
      toast.error("Erreur lors du pointage de sortie: " + error.message)
    },
  })

  const markAbsentMutation = useMutation({
    mutationFn: ({ employeeId, date }) => apiClient.markAbsent(employeeId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-by-date', selectedDate] })
      toast.success("Employé marqué absent")
    },
    onError: (error) => {
      toast.error("Erreur lors du marquage absent: " + error.message)
    },
  })

  const markAllAbsentMutation = useMutation({
    mutationFn: (employeeIds) => Promise.all(employeeIds.map(id => apiClient.markAbsent(id, selectedDate))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-by-date', selectedDate] })
      toast.success("Tous les employés absents marqués")
    },
    onError: (error) => {
      toast.error("Erreur lors du marquage des absents: " + error.message)
    },
  })

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAttendanceStatus = (clockIn) => {
    if (!clockIn) return 'ABSENT'
    const time = new Date(clockIn)
    const hours = time.getHours()
    const minutes = time.getMinutes()
    const totalMinutes = hours * 60 + minutes

    if (totalMinutes >= 480 && totalMinutes <= 495) { // 8:00 - 8:15
      return 'PRESENT'
    } else if (totalMinutes > 495 && totalMinutes <= 510) { // 8:15 - 8:30
      return 'LATE'
    } else {
      return 'ABSENT'
    }
  }

  const isAfter10AM = () => {
    const now = new Date()
    return now.getHours() >= 10
  }

  const absentEmployees = React.useMemo(() => {
    if (!isAfter10AM() || selectedDate !== new Date().toISOString().split('T')[0]) return []
    const attendedEmployeeIds = new Set(attendances.map(a => a.employeeId))
    return allEmployees.filter(emp => !attendedEmployeeIds.has(emp.id))
  }, [attendances, allEmployees, selectedDate])

  const columns = [
    {
      key: 'employee',
      title: 'Employé',
      render: (value, row) => (
        <div>
          <p className="font-medium text-sm">{row.employee?.firstName} {row.employee?.lastName}</p>
          <p className="text-xs text-muted-foreground">{row.employee?.poste}</p>
        </div>
      )
    },
    {
      key: 'clockIn',
      title: 'Entrée',
      render: (value) => value ? formatTime(value) : '--:--'
    },
    {
      key: 'clockOut',
      title: 'Sortie',
      render: (value) => value ? formatTime(value) : '--:--'
    },
    {
      key: 'status',
      title: 'Statut',
      render: (value, row) => {
        const status = getAttendanceStatus(row.clockIn)
        return (
          <Badge variant={
            status === 'PRESENT' ? 'default' :
            status === 'ABSENT' ? 'destructive' :
            status === 'LATE' ? 'secondary' : 'outline'
          }>
            {status === 'PRESENT' ? 'Présent' :
             status === 'ABSENT' ? 'Absent' :
             status === 'LATE' ? 'En retard' : status}
          </Badge>
        )
      }
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => markClockInMutation.mutate({ employeeId: row.employeeId, date: selectedDate })}
            disabled={markClockInMutation.isPending || row.clockIn}
          >
            <LogIn className="h-4 w-4 mr-1" />
            Entrée
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => markClockOutMutation.mutate({ employeeId: row.employeeId, date: selectedDate })}
            disabled={markClockOutMutation.isPending || !row.clockIn || row.clockOut}
          >
            <LogOut className="h-4 w-4 mr-1" />
            Sortie
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => markAbsentMutation.mutate({ employeeId: row.employeeId, date: selectedDate })}
            disabled={markAbsentMutation.isPending}
          >
            Absent
          </Button>
        </div>
      )
    }
  ]

  if (error) {
    return (
      <Alert className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement des données de pointage: {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Pointages</h1>
          <p className="text-muted-foreground">
            Suivi et gestion des heures de travail{user?.entreprise ? ` - ${user.entreprise.name}` : ''}
          </p>
        </div>
      </div>

      {/* Date Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Sélectionner une date</span>
          </CardTitle>
          <CardDescription>
            Choisissez la date pour consulter les pointages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-xs">
              <label htmlFor="date" className="block text-sm font-medium mb-2">
                Date
              </label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
            <Button onClick={() => refetch()}>
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Pointages du {new Date(selectedDate).toLocaleDateString('fr-FR')}</span>
          </CardTitle>
          <CardDescription>
            Liste des pointages pour la date sélectionnée
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-muted rounded"></div>
                    <div className="h-3 w-24 bg-muted rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-muted rounded"></div>
                    <div className="h-6 w-16 bg-muted rounded"></div>
                    <div className="h-6 w-16 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : attendances.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun pointage enregistré pour cette date</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={attendances}
            />
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {attendances.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-success" />
                <div>
                  <p className="text-2xl font-bold text-success">
                    {attendances.filter(a => a.clockIn && a.clockOut).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pointages complets</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-warning" />
                <div>
                  <p className="text-2xl font-bold text-warning">
                    {attendances.filter(a => a.clockIn && !a.clockOut).length}
                  </p>
                  <p className="text-sm text-muted-foreground">En cours</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold text-destructive">
                    {attendances.filter(a => !a.clockIn).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Absents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Absent Employees */}
      {isAfter10AM() && absentEmployees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span>Employés absents (après 10h)</span>
            </CardTitle>
            <CardDescription>
              Liste des employés qui n'ont pas encore pointé leur entrée aujourd'hui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {absentEmployees.map(employee => (
                <div key={employee.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">{employee.firstName} {employee.lastName}</p>
                    <p className="text-xs text-muted-foreground">{employee.poste}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => markAbsentMutation.mutate({ employeeId: employee.id, date: selectedDate })}
                    disabled={markAbsentMutation.isPending}
                  >
                    Marquer Absent
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button
                onClick={() => markAllAbsentMutation.mutate(absentEmployees.map(emp => emp.id))}
                disabled={markAllAbsentMutation.isPending}
                className="w-full"
                variant="destructive"
              >
                Marquer tous comme absents
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
