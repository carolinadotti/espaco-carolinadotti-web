import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./db"
import { rateLimit } from "./rate-limit"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
        turnstileToken: { label: "Turnstile", type: "text" },
        ip: { label: "IP", type: "text" },
      },
      async authorize(credentials) {
        const ip = (credentials?.ip as string) || "unknown"
        const email = credentials?.email as string
        const password = credentials?.password as string
        const turnstileToken = credentials?.turnstileToken as string

        if (!email || !password) return null

        // Rate limit: 5 attempts per IP per 15 min
        const limiter = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)
        if (!limiter.allowed) {
          throw new Error("RATE_LIMIT")
        }

        // Verify Turnstile token
        if (process.env.TURNSTILE_SECRET_KEY) {
          const verifyRes = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                secret: process.env.TURNSTILE_SECRET_KEY,
                response: turnstileToken || "",
              }),
            }
          )
          const verifyData = await verifyRes.json()
          if (!verifyData.success) {
            throw new Error("CAPTCHA_FAILED")
          }
        }

        // Validate user
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) return null

        return { id: user.id, email: user.email }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
  },
})
