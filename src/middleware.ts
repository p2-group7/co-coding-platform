import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { api } from "./trpc/server";
import { decrypt } from "@/lib/auth";

// Middleware function that handles Basic Authentication
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }
  if (req.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const value = await decrypt(req.cookies.get("session")?.value);
  // Check if the user is authenticated
  if (value !== "true") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}
