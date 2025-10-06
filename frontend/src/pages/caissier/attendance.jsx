import * as React from "react"
import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, LogIn, LogOut, CheckCircle, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

const AttendancePage = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch attendance data
  const { data: attendances = [], isLoading, error } = useQuery({
    queryKey: ['my-attendance'],
    queryFn: () => apiClient.getMyAttendance(),
  })

  // Clock in mutation
  const clockInMutation = useMutation({
    mutationFn: () => apiClient.clockIn(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-attendance'] })
      toast.success("Pointage d'entrée enregistré avec succès")
    },
    onError: (error) => {
      toast.error("Erreur lors du pointage d'entrée: " + error.message)
    }
  })

  // Clock out mutation
  const clockOutMutation = useMutation({
    mutationFn: () => apiClient.clockOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-attendance'] })
      toast.success("Pointage de sortie enregistré avec succès")
    },
    onError: (error) => {
      toast.error("Erreur lors du pointage de sortie: " + error.message)
    }
  })

  // Get today's attendance
  const today = new Date().toISOString().split('T')[0]
  const todayAttendance = attendances.find(att => {
    const attDate = new Date(att.date).toISOString().split('T')[0]
    return attDate === today
  })

  const handleClockIn = () => {
    if (todayAttendance?.clockIn) {
      toast.error("Vous avez déjà pointé votre entrée aujourd'hui")
      return
    }
    clockInMutation.mutate()
  }

  const handleClockOut = () => {
    if (!todayAttendance?.clockIn) {
      toast.error("Vous devez d'abord pointer votre entrée")
      return
    }
    if (todayAttendance?.clockOut) {
      toast.error("Vous avez déjà pointé votre sortie aujourd'hui")
      return
    }
    clockOutMutation.mutate()
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement des données de pointage: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pointage</h1>
          <p className="text-muted-foreground">
            Gestion de vos heures de travail{user?.entreprise ? ` - ${user.entreprise.name}` : ''}
          </p>
        </div>
      </div>

      {/* Current Time and Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Heure Actuelle</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-primary mb-2">
                {currentTime.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <p className="text-muted-foreground">
                {currentTime.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut Aujourd'hui</CardTitle>
            <CardDescription>
              {formatDate(today)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Entrée:</span>
              <Badge variant={todayAttendance?.clockIn ? "default" : "secondary"}>
                {todayAttendance?.clockIn ? formatTime(todayAttendance.clockIn) : "Non pointé"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sortie:</span>
              <Badge variant={todayAttendance?.clockOut ? "default" : "secondary"}>
                {todayAttendance?.clockOut ? formatTime(todayAttendance.clockOut) : "Non pointé"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Statut:</span>
              <Badge variant={
                todayAttendance?.clockIn && todayAttendance?.clockOut ? "default" :
                todayAttendance?.clockIn ? "secondary" : "outline"
              }>
                {todayAttendance?.clockIn && todayAttendance?.clockOut ? "Complété" :
                 todayAttendance?.clockIn ? "En cours" : "Absent"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clock In/Out Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Actions de Pointage</CardTitle>
          <CardDescription>
            Enregistrez votre arrivée et départ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={handleClockIn}
              disabled={clockInMutation.isPending || !!todayAttendance?.clockIn}
              variant="default"
              icon={<LogIn className="h-4 w-4" />}
              className="flex-1"
            >
              {clockInMutation.isPending ? "Pointage en cours..." : "Pointer Entrée"}
            </Button>
            <Button
              onClick={handleClockOut}
              disabled={clockOutMutation.isPending || !todayAttendance?.clockIn || !!todayAttendance?.clockOut}
              variant="secondary"
              icon={<LogOut className="h-4 w-4" />}
              className="flex-1"
            >
              {clockOutMutation.isPending ? "Pointage en cours..." : "Pointer Sortie"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des Pointages</CardTitle>
          <CardDescription>
            Vos derniers enregistrements de pointage
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
                  </div>
                </div>
              ))}
            </div>
          ) : attendances.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun pointage enregistré</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attendances.slice(0, 10).map((attendance) => (
                <div key={attendance.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div>
                    <p className="font-medium">{formatDate(attendance.date)}</p>
                    <p className="text-sm text-muted-foreground">
                      Statut: {attendance.status}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Entrée</p>
                      <Badge variant={attendance.clockIn ? "default" : "outline"}>
                        {attendance.clockIn ? formatTime(attendance.clockIn) : "--:--"}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Sortie</p>
                      <Badge variant={attendance.clockOut ? "default" : "outline"}>
                        {attendance.clockOut ? formatTime(attendance.clockOut) : "--:--"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AttendancePage
