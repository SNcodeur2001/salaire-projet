import * as React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Calculator, Eye, EyeOff, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"

// Validation schema
const loginSchema = z.object({
  email: z.string().min(1, "L'adresse email est requise").email("Format d'email invalide"),
  password: z.string().min(1, "Le mot de passe est requis").min(6, "Le mot de passe doit contenir au moins 6 caractères")
})

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)

    try {
      const user = await login(data)
      // Navigate based on role
      if (user.role === 'SUPER_ADMIN') {
        navigate('/super-admin')
      } else if (user.role === 'ADMIN') {
        navigate('/admin')
      } else if (user.role === 'CAISSIER') {
        navigate('/caissier')
      } else if (user.role === 'VIGILE') {
        navigate('/vigile')
      } else {
        toast({
          title: "Erreur",
          description: "Rôle non reconnu",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Vérifiez vos identifiants",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-lg">
              <Calculator className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold gradient-text">GES-Salary</h1>
            <p className="text-muted-foreground">
              Plateforme de gestion des salaires
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>
              Entrez vos informations pour vous connecter à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="votre@email.com"
                          {...field}
                        />
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
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="h-11 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  loading={loading}
                  icon={!loading ? <LogIn className="h-4 w-4" /> : undefined}
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 GES-Salary. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
