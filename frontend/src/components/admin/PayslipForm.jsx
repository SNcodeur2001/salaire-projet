import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "@/contexts/AuthContext"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/enhanced-button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { DialogClose } from "@/components/ui/dialog"

// Validation schema for payslip adjustments
const payslipSchema = z.object({
  grossSalary: z.coerce.number().positive("Le salaire brut doit être positif"),
  deductions: z.coerce.number().min(0, "Les charges ne peuvent pas être négatives"),
  netSalary: z.coerce.number().positive("Le salaire net doit être positif"),
  notes: z.string().optional(),
})

export function PayslipForm({ defaultValues = {}, onSuccess, isEdit = false, onCancel }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(payslipSchema),
    defaultValues: {
      ...defaultValues,
      entrepriseId: user?.entrepriseId,
    },
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const submitData = {
        ...data,
        entrepriseId: user?.entrepriseId,
      }

      if (isEdit && defaultValues.id) {
        await apiClient.updatePayslip(defaultValues.id, submitData)
        toast({
          title: "Bulletin mis à jour",
          description: "Le bulletin de paie a été mis à jour avec succès.",
        })
      } else {
        // Creation not typically needed for payslips, but included for completeness
        toast({
          title: "Erreur",
          description: "La création de bulletins se fait via génération.",
          variant: "destructive",
        })
        return
      }

      form.reset()
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="grossSalary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salaire Brut (€)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="3000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deductions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Charges (€)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="netSalary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salaire Net (€)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="2500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input placeholder="Notes supplémentaires..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Mettre à jour" : "Sauvegarder"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
