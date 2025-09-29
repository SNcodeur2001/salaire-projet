import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Euro,
  FileText,
  Briefcase,
  Building,
  AlertCircle,
  CheckCircle
} from "lucide-react"

export function EmployeeProfileDialog({ employeeId, open, onOpenChange }) {
  // Fetch employee details
  const { data: employee, isLoading, error } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => apiClient.getEmployee(employeeId),
    enabled: !!employeeId && open,
  })

  // Fetch all payslips and filter by employee
  const { data: allPayslips = [] } = useQuery({
    queryKey: ['payslips', 'all'],
    queryFn: () => apiClient.getPayslips({}),
    enabled: !!employeeId && open,
  })

  const payslips = allPayslips.filter(p => p.employeeId === employeeId)

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Chargement...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error || !employee) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Erreur de chargement</h3>
              <p className="text-muted-foreground">{error?.message || "Employé non trouvé"}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profil de {employee.firstName} {employee.lastName}</span>
          </DialogTitle>
          <DialogDescription>
            Informations détaillées de l'employé
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nom complet</p>
                    <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Poste</p>
                    <p className="font-medium">{employee.position}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Département</p>
                    <p className="font-medium">{employee.department}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date d'embauche</p>
                    <p className="font-medium">{new Date(employee.startDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Salaire</p>
                    <p className="font-medium">€{employee.salary?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Badge variant={employee.status === 'active' ? 'default' : employee.status === 'on_leave' ? 'secondary' : 'destructive'}>
                  {employee.status === 'active' ? 'Actif' : employee.status === 'on_leave' ? 'En congé' : 'Inactif'}
                </Badge>
                <Badge variant="outline" className="ml-2">
                  {employee.contractType}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Payslips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Bulletins de paie récents</span>
              </CardTitle>
              <CardDescription>
                {payslips.length} bulletin{payslips.length > 1 ? 's' : ''} trouvé{payslips.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payslips.length > 0 ? (
                <div className="space-y-3">
                  {payslips.slice(0, 5).map((payslip) => (
                    <div key={payslip.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">{payslip.cycle.period}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payslip.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">€{payslip.netSalary?.toLocaleString()}</p>
                        <Badge variant={payslip.status === 'PAYE' ? 'default' : 'secondary'} className="text-xs">
                          {payslip.status === 'PAYE' ? 'Payé' : 'En attente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {payslips.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      Et {payslips.length - 5} autres bulletins...
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Aucun bulletin de paie trouvé pour cet employé.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Salary Summary */}
          {payslips.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Résumé salarial</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      €{payslips.reduce((sum, p) => sum + (p.grossSalary || 0), 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total brut</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-destructive">
                      €{payslips.reduce((sum, p) => sum + (p.deductions || 0), 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total charges</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">
                      €{payslips.reduce((sum, p) => sum + (p.netSalary || 0), 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total net</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}