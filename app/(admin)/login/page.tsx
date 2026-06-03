"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { Eye, EyeOff, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const turnstileRef = useRef<TurnstileInstance>(undefined)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!turnstileToken) {
      setError("Por favor, complete a verificação de segurança.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const ip = await fetch("https://api.ipify.org?format=json")
        .then((r) => r.json())
        .then((d) => d.ip)
        .catch(() => "unknown")

      const result = await signIn("credentials", {
        email,
        password,
        turnstileToken,
        ip,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === "RATE_LIMIT") {
          setError("Muitas tentativas. Aguarde 15 minutos.")
        } else if (result.error === "CAPTCHA_FAILED") {
          setError("Verificação de segurança falhou. Tente novamente.")
        } else {
          setError("Credenciais inválidas. Verifique seu e-mail e senha.")
        }
        turnstileRef.current?.reset?.()
        setTurnstileToken("")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      setError("Erro inesperado. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
            <Scissors className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            Espaço Carolina Dotti
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Área Administrativa</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Acesse o painel com suas credenciais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={loading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Cloudflare Turnstile */}
              <div className="flex justify-center py-2">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={
                    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
                    "1x00000000000000000000AA"
                  }
                  onSuccess={(token) => setTurnstileToken(token)}
                  onExpire={() => setTurnstileToken("")}
                  onError={() => {
                    setTurnstileToken("")
                    setError("Erro no captcha. Tente novamente.")
                  }}
                  options={{ theme: "auto", language: "pt-BR" }}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !turnstileToken}
              >
                {loading ? "Entrando…" : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
