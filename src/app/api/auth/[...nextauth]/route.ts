import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize attempt for:", credentials?.email)
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          throw new Error("Email et mot de passe requis")
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          console.log("User found:", user ? "Yes" : "No")

          if (!user || !user.password) {
            console.log("User not found or no password")
            throw new Error("Utilisateur non trouvé")
          }

          const isValid = await bcrypt.compare(credentials.password, user.password)
          console.log("Password valid:", isValid)

          if (!isValid) {
            console.log("Invalid password")
            throw new Error("Mot de passe incorrect")
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        } catch (error) {
          console.error("Authorize error:", error)
          throw error
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
