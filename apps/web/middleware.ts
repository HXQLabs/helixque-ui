import { auth } from "@/auth"

export default async function middleware(req: any) {
  const middlewareLogic = (auth as any)((req: any) => {
    const isLoggedIn = !!req.auth
    const isOnboarded = req.auth?.user?.isOnboarded === true
    const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
    const isOnMeet = req.nextUrl.pathname.startsWith("/meet")
    const isOnOnboarding = req.nextUrl.pathname.startsWith("/onboarding")
    const isOnAuth = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/signup")

    if (isOnAuth) {
      if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", req.nextUrl))
      }
      return
    }

    if (isOnOnboarding) {
       if (!isLoggedIn) return Response.redirect(new URL("/login", req.nextUrl));
       if (isOnboarded) return Response.redirect(new URL("/dashboard", req.nextUrl));
       return;
    }

    if ((isOnDashboard || isOnMeet) && !isLoggedIn) {
      return Response.redirect(new URL("/login", req.nextUrl))
    }
    
    // Enforce onboarding for logged in users
    if (isLoggedIn && !isOnboarded && !isOnOnboarding) {
       return Response.redirect(new URL("/onboarding", req.nextUrl))
    }

    return
  });

  return middlewareLogic(req);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
