import * as React from "react"
import { useForm } from "react-hook-form"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Euro, CreditCard, Receipt } from "lucide-react"

export function PaymentForm({ payslipId, onSuccess, onCancel }) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm({
    defaultValues: {
      amount: "",
      mode: "ESPECES",
      receiptUrl: "",
    },
  })

  const onSubmit = async (data) => {
    if (!payslipId) {
      toast({ title: "Erreur", description: "ID du bulletin manquant", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      await apiClient.createPayment({
        payslipId,
        amount: parseFloat(data.amount),
        mode: data.mode,
        receiptUrl: data.receiptUrl || undefined,
      })

      toast({
        title: "Paiement enregistré",
        description: "Le paiement a été enregistré avec succès."
      })

      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'enregistrement du paiement",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Enregistrer un paiement</span>
        </CardTitle>
        <CardDescription>
          Saisissez les informations du paiement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              rules={{
                required: "Le montant est requis",
                min: { value: 0.01, message: "Le montant doit être positif" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-1">
                    <Euro className="h-4 w-4" />
                    <span>Montant (€)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mode"
              rules={{ required: "Le mode de paiement est requis" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-1">
                    <Receipt className="h-4 w-4" />
                    <span>Mode de paiement</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ESPECES">Espèces</SelectItem>
                      <SelectItem value="VIREMENT">Virement bancaire</SelectItem>
                      <SelectItem value="CHEQUE">Chèque</SelectItem>
                      <SelectItem value="OM">Orange Money</SelectItem>
                      <SelectItem value="WAVE">Wave</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="receiptUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL du reçu (optionnel)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/receipt.pdf"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                className="flex-1"
              >
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}