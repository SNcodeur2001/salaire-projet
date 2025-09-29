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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { DialogClose } from "@/components/ui/dialog"

// Validation schema
const payrunSchema = z.object({
  period: z.string().min(1, "La période est requise"),
  status: z.enum(["BROUILLON", "APPROUVE", "CLOS"], {
    required_error: "Le statut est requis",
  }),
})

export function PayrunForm({ defaultValues = {}, onSuccess, isEdit = false, onCancel }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(payrunSchema),
    defaultValues: {
      period: defaultValues.period || "",
      status: defaultValues.status || "BROUILLON",
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
        await apiClient.updatePayrun(defaultValues.id, submitData)
        toast({
          title: "Cycle mis à jour",
          description: "Le cycle de paie a été mis à jour avec succès.",
        })
      } else {
        await apiClient.createPayrun(submitData)
        toast({
          title: "Cycle créé",
          description: "Le cycle de paie a été créé avec succès.",
        })
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
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Période</FormLabel>
              <FormControl>
                <Input placeholder="Février 2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="BROUILLON">Brouillon</SelectItem>
                  <SelectItem value="APPROUVE">Approuvé</SelectItem>
                  <SelectItem value="CLOS">Clos</SelectItem>
                </SelectContent>
              </Select>
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
            {isEdit ? "Mettre à jour" : "Créer cycle"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
