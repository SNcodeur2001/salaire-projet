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
  FormDescription,
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
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import { DialogClose } from "@/components/ui/dialog"

// Validation schema
const employeeSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  position: z.string().min(1, "Le poste est requis"),
  department: z.string().min(1, "Le département est requis"),
  contractType: z.enum(["CDI", "CDD", "Stage"], {
    required_error: "Le type de contrat est requis",
  }),
  salary: z.coerce.number().positive("Le salaire doit être positif"),
  startDate: z.date({
    required_error: "La date d'embauche est requise",
  }),
  status: z.enum(["active", "on_leave", "inactive"], {
    required_error: "Le statut est requis",
  }),
})

export function EmployeeForm({ defaultValues = {}, onSuccess, isEdit = false, onCancel }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      ...defaultValues,
      entrepriseId: user?.entrepriseId,
    },
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [date, setDate] = React.useState(defaultValues.startDate ? new Date(defaultValues.startDate) : undefined)

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const submitData = {
        ...data,
        startDate: date.toISOString().split('T')[0], // Format YYYY-MM-DD
        entrepriseId: user?.entrepriseId,
      }

      if (isEdit && defaultValues.id) {
        await apiClient.updateEmployee(defaultValues.id, submitData)
        toast({
          title: "Employé mis à jour",
          description: "Les informations de l'employé ont été mises à jour avec succès.",
        })
      } else {
        await apiClient.createEmployee(submitData)
        toast({
          title: "Employé créé",
          description: "L'employé a été ajouté avec succès.",
        })
      }

      form.reset()
      setDate(undefined)
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poste</FormLabel>
                <FormControl>
                  <Input placeholder="Développeur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Département</FormLabel>
                <FormControl>
                  <Input placeholder="IT" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="contractType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de contrat</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CDI">CDI</SelectItem>
                    <SelectItem value="CDD">CDD</SelectItem>
                    <SelectItem value="Stage">Stage</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salaire (€)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="3000" {...field} />
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
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="on_leave">En congé</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="startDate"
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel>Date d'embauche</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date ? (
                        format(date, "PPP", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate)
                      form.setValue("startDate", selectedDate)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Sélectionnez la date d'embauche de l'employé.
              </FormDescription>
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
            {isEdit ? "Mettre à jour" : "Créer employé"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
