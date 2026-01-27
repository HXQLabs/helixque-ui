import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth";
import LinkedIn from "next-auth/providers/linkedin";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      isOnboarded?: boolean;
    } & DefaultSession["user"];
  }
}

const config = {
  providers: [
    LinkedIn({
      clientId: process.env.AUTH_LINKEDIN_ID,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET,
      authorization: {
        params: { scope: "openid profile email" },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      try {
        // Sync with backend
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:4001";
        const response = await fetch(`${backendUrl}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            linkedinId: user.id || account?.providerAccountId,
            email: user.email,
            username: user.name || "User",
            imageUrl: user.image,
          }),
        });

        if (!response.ok) {
          console.error(
            "Failed to sync user with backend",
            await response.text(),
          );
          return true;
        }

        const data = await response.json();
        if (data?.id) {
          user.id = data.id; // Capture backend ID
        }
        // Capture onboarding status
        // We attach it to the 'user' object which persists to the 'jwt' callback on first sign in
        (user as any).isOnboarded = data.isOnboarded;

        return true;
      } catch (error) {
        console.error("Backend sync error:", error);
        return true;
      }
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.isOnboarded = token.isOnboarded as boolean;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.isOnboarded = (user as any).isOnboarded;
      }

      if (trigger === "update" && session) {
        token.isOnboarded = session.isOnboarded;
      }

      return token;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
} satisfies NextAuthConfig;

// Use type assertion to bypass "inferred type cannot be named" error (TS2742)
// This is common with next-auth v5 beta in pnpm monorepos
export const { handlers, signIn, signOut, auth } = NextAuth(config) as any;
