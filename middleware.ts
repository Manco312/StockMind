import { auth } from "@/src/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;

  // Si no está logueado, lo mando al login
  if (!isLoggedIn) {
    const loginUrl = new URL("/accounting/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

// Aplica a todas las rutas privadas
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/inventory/:path*",
    "/intelligence/:path*",
    "/orders/:path*",
  ],
};
