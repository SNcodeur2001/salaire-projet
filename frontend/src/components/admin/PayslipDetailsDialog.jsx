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
  Download,
  Mail,
  Printer,
  Edit,
  Euro,
  Calendar,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react"
import { PayslipForm } from "./PayslipForm"

export function PayslipDetailsDialog({ payslipId, open, onOpenChange }) {
  const [editMode, setEditMode] = React.useState(false)

  // Fetch payslip details
  const { data: payslip, isLoading, error } = useQuery({
    queryKey: ['payslip', payslipId],
    queryFn: () => apiClient.getPayslip(payslipId),
    enabled: !!payslipId && open,
  })

  // Fetch payments for this payslip
  const { data: payments = [] } = useQuery({
    queryKey: ['payslip-payments', payslipId],
    queryFn: () => apiClient.getPayslipPayments(payslipId),
    enabled: !!payslipId && open,
  })

  const handleDownloadPdf = async () => {
    try {
      await apiClient.downloadPayslipPdf(payslipId)
    } catch (error) {
      console.error('Error downloading PDF:', error)
    }
  }

  const handleSendEmail = async () => {
    try {
      await apiClient.sendPayslipEmail(payslipId)
      // Show success toast
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }

  const handlePrint = () => {
    // For printing, we can open the PDF in a new window or use browser print
    window.open(`/api/payslips/${payslipId}/pdf`, '_blank')
  }

  const handleDownloadReceipt = async (paymentId) => {
    try {
      await apiClient.downloadPaymentReceipt(paymentId)
    } catch (error) {
      console.error('Error downloading receipt:', error)
      // You could add a toast notification here
    }
  }

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

  if (error || !payslip) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Erreur de chargement</h3>
              <p className="text-muted-foreground">{error?.message || "Bulletin non trouvé"}</p>
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
            <FileText className="h-5 w-5" />
            <span>Bulletin de paie - {payslip.employee.firstName} {payslip.employee.lastName}</span>
          </DialogTitle>
          <DialogDescription>
            Période: {payslip.cycle.period} | Statut: <Badge variant={payslip.status === 'PAYE' ? 'default' : 'secondary'}>
              {payslip.status === 'PAYE' ? 'Payé' : 'En attente'}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Informations employé</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                  <p className="font-medium">{payslip.employee.firstName} {payslip.employee.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Poste</p>
                  <p className="font-medium">{payslip.employee.position}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Département</p>
                  <p className="font-medium">{payslip.employee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{payslip.employee.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Euro className="h-4 w-4" />
                <span>Détail de la rémunération</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Salaire brut</span>
                  <span className="font-medium">€{payslip.grossSalary?.toLocaleString()}</span>
                </div>
                {payslip.employee.contract === 'HONORAIRE' && payslip.hoursWorked && (
                  <div className="flex justify-between">
                    <span>Heures travaillées</span>
                    <span className="font-medium">{payslip.hoursWorked.toFixed(2)}h</span>
                  </div>
                )}
                <div className="flex justify-between text-destructive">
                  <span>Charges sociales</span>
                  <span>-€{payslip.deductions?.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Salaire net</span>
                  <span>€{payslip.netSalary?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payments History */}
          {payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Historique des paiements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            €{payment.amount?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">
                            {payment.mode} • Réf: {payment.id.slice(-8)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800">
                          Payé
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReceipt(payment.id)}
                          className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-950"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Reçu
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {payslip.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{payslip.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" icon={<Download className="h-4 w-4" />} onClick={handleDownloadPdf}>
              PDF
            </Button>
            <Button variant="outline" icon={<Mail className="h-4 w-4" />} onClick={handleSendEmail}>
              Email
            </Button>
            <Button variant="outline" icon={<Printer className="h-4 w-4" />} onClick={handlePrint}>
              Imprimer
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" icon={<Edit className="h-4 w-4" />} onClick={() => setEditMode(true)}>
              Modifier
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
          </div>
        </DialogFooter>

        {/* Edit Form Dialog */}
        {editMode && (
          <PayslipForm
            defaultValues={payslip}
            isEdit={true}
            onSuccess={() => {
              setEditMode(false)
              // Refetch data
            }}
            onCancel={() => setEditMode(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}