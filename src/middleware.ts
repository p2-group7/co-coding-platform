import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";
import { JWTExpired } from "jose/errors";

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

  if (req.cookies.get("session")?.value !== undefined) {
    console.log(req.cookies.get("session")?.value); // this is the session cookie
    try {
      const value = await decrypt(req.cookies.get("session")!.value);
      console.log(value);
    } catch (error) {
      let errorMessage = "unknown";
      if (error instanceof JWTExpired) {
        errorMessage = "sessionExp";
      }
      return NextResponse.redirect(
        new URL("/login" + "?error=" + errorMessage, req.url),
      );
    }
  } else {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}
