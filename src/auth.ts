import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";

export const authConfig = {
  pages: {
    signIn: "/accounting/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { inventoryManager: true }, // Include relation to check for role
        });
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // Determine role based on the relation
        const role = user.inventoryManager ? "INVENTORY_MANAGER" : "USER";

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: role, // Add role to the user object
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnInventario = nextUrl.pathname.startsWith("/inventario");

      if ((isOnDashboard || isOnInventario) && !isLoggedIn) return false;
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // On sign in, persist the role to the token
        token.role = user.role;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role as string;
      }
      if (token.user) {
        session.user = token.user as any;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
