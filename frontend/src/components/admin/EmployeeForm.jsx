import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
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
import { Loader2 } from "lucide-react"
import { DialogClose } from "@/components/ui/dialog"

// Validation schema
const employeeSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  poste: z.string().min(1, "Le poste est requis"),
  contract: z.enum(["JOURNALIER", "FIXE", "HONORAIRE"], {
    required_error: "Le type de contrat est requis",
  }),
  baseSalary: z.coerce.number().positive("Le salaire doit être positif"),
})

// Predefined posts for searchable dropdown
const predefinedPosts = [
  "Développeur",
  "Designer",
  "Chef de projet",
  "Analyste",
  "Consultant",
  "Technicien",
  "Administrateur",
  "Commercial",
  "Support",
  "RH",
]


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

  // Watch contract field for dynamic salary label
  const contract = useWatch({
    control: form.control,
    name: "contract",
    defaultValue: defaultValues.contract || "FIXE",
  })

  const getSalaryLabel = () => {
    switch (contract) {
      case "JOURNALIER":
        return "Salaire journalier (€)"
      case "HONORAIRE":
        return "Honoraire (€)"
      case "FIXE":
      default:
        return "Salaire mensuel (€)"
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const submitData = {
        ...data,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
          name="poste"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poste</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un poste" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedPosts.map((post) => (
                      <SelectItem key={post} value={post}>
                        {post}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contract"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de contrat</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JOURNALIER">Journalier</SelectItem>
                    <SelectItem value="FIXE">Fixe</SelectItem>
                    <SelectItem value="HONORAIRE">Honoraire</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="baseSalary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{getSalaryLabel()}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="3000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
