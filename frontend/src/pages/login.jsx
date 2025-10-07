//  of timport * as React from "react"
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
      } else if (user.role === 'EMPLOYE' || user.role === 'EMPLOYEE') {
        navigate('/employe')
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
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background decorations */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-30 animate-pulse" style={{ background: "radial-gradient(circle at 30% 30%, hsl(var(--primary)), transparent 70%)", animationDuration: "4s" }} />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl opacity-30 animate-pulse" style={{ background: "radial-gradient(circle at 70% 70%, hsl(var(--primary-glow)), transparent 70%)", animationDuration: "6s", animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full blur-3xl opacity-20 animate-pulse" style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)", animationDuration: "5s", animationDelay: "2s" }} />
        </div>
      </div>

      <div className="w-full max-w-md space-y-8 animate-slide-up">
        {/* Logo & Title */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-3xl animate-pulse" style={{ animationDuration: "3s" }} />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-glow shadow-2xl">
                <Calculator className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold gradient-text">GES-Salary</h1>
            <p className="text-muted-foreground text-base font-medium">
              Plateforme professionnelle de gestion des salaires
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="glass-card shadow-2xl border-white/30">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
            <CardDescription className="text-base">
              Entrez vos informations pour accéder à votre espace
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
                      <FormLabel className="text-sm font-semibold">Adresse email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="votre@email.com"
                          className="h-11"
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
                      <FormLabel className="text-sm font-semibold">Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="h-11 pr-10 transition-all focus:shadow-md"
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
                  className="w-full mt-2 shadow-lg hover:shadow-xl"
                  loading={loading}
                  icon={!loading ? <LogIn className="h-5 w-5" /> : undefined}
                >
                  {loading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground font-medium">
          <p>© 2024 GES-Salary · Tous droits réservés</p>
        </div>
      </div>
    </div>
  )
}

export default Login
