import * as React from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
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
import { User, Mail, Lock, Building2, Shield } from "lucide-react"

export function UserForm({ defaultValues, isEdit = false, onSuccess, onCancel }) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Fetch entreprises for SUPER_ADMIN
  const { data: entreprises = [] } = useQuery({
    queryKey: ['entreprises'],
    queryFn: () => apiClient.getEntreprises(),
  })

  const form = useForm({
    defaultValues: {
      email: defaultValues?.email || "",
      password: "",
      role: defaultValues?.role || "CAISSIER",
      entrepriseId: defaultValues?.entrepriseId || "",
      ...defaultValues,
    },
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const userData = {
        email: data.email,
        password: data.password,
        role: data.role,
        entrepriseId: data.role === 'SUPER_ADMIN' ? null : data.entrepriseId || undefined,
      }

      await apiClient.register(userData)

      toast({
        title: isEdit ? "Utilisateur modifié" : "Utilisateur créé",
        description: `L'utilisateur ${data.email} a été ${isEdit ? 'modifié' : 'créé'} avec succès.`
      })

      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message || `Erreur lors de la ${isEdit ? 'modification' : 'création'} de l'utilisateur`,
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
          <User className="h-5 w-5" />
          <span>{isEdit ? "Modifier l'utilisateur" : "Créer un utilisateur"}</span>
        </CardTitle>
        <CardDescription>
          {isEdit ? "Modifiez les informations de l'utilisateur." : "Remplissez les informations pour créer un nouvel utilisateur."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "L'email est requis",
                pattern: { value: /^\S+@\S+$/, message: "Format d'email invalide" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="utilisateur@exemple.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEdit && (
              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: "Le mot de passe est requis",
                  minLength: { value: 6, message: "Minimum 6 caractères" }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-1">
                      <Lock className="h-4 w-4" />
                      <span>Mot de passe</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Mot de passe sécurisé"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="role"
              rules={{ required: "Le rôle est requis" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>Rôle</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SUPER_ADMIN">Super Administrateur</SelectItem>
                      <SelectItem value="ADMIN">Administrateur</SelectItem>
                      <SelectItem value="CAISSIER">Caissier</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("role") !== "SUPER_ADMIN" && (
              <FormField
                control={form.control}
                name="entrepriseId"
                rules={{ required: "L'entreprise est requise pour ce rôle" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4" />
                      <span>Entreprise</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une entreprise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {entreprises.map((entreprise) => (
                          <SelectItem key={entreprise.id} value={entreprise.id}>
                            {entreprise.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                {isEdit ? "Modifier" : "Créer"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}