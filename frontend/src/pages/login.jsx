import * as React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Button } from "@/components/ui/enhanced-button.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Label } from "@/components/ui/label.jsx"
import { Calculator, Eye, EyeOff, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = await login(formData)
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${user.name || user.email}`,
      })

      // Redirect based on role
      if (user.role === 'SUPER_ADMIN') {
        navigate('/super-admin')
      } else if (user.role === 'ADMIN') {
        navigate('/admin')
      } else if (user.role === 'CAISSIER') {
        navigate('/caissier')
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants incorrects",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const demoUsers = [
    { role: 'Super Admin', email: 'superadmin@payrollpro.com', password: 'demo123' },
    { role: 'Administrateur', email: 'admin@entreprise.com', password: 'demo123' },
    { role: 'Caissier', email: 'caissier@entreprise.com', password: 'demo123' }
  ]

  const quickLogin = (email, password) => {
    setFormData({ email, password })
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
            <h1 className="text-3xl font-bold gradient-text">PayrollPro</h1>
            <p className="text-muted-foreground">
              Plateforme de gestion des salaires
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">
              Connexion
            </CardTitle>
            <CardDescription className="text-center">
              Connectez-vous à votre espace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-11 pr-10"
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
              </div>

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

            {/* Demo Users */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Comptes de démonstration
              </p>
              <div className="space-y-2">
                {demoUsers.map((user, index) => (
                  <button
                    key={index}
                    onClick={() => quickLogin(user.email, user.password)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors",
                      "flex items-center justify-between text-sm"
                    )}
                  >
                    <div>
                      <p className="font-medium">{user.role}</p>
                      <p className="text-muted-foreground text-xs">{user.email}</p>
                    </div>
                    <LogIn className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 PayrollPro. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
