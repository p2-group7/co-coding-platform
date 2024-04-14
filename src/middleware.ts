import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
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

  if (req.cookies.get("session")?.value !== undefined) {
    console.log(req.cookies.get("session")?.value); // this is the session cookie
    const value = await decrypt(req.cookies.get("session")!.value);
    //const currentTime = new Date().getTime();
    /* if (value.exp === undefined || value.exp < currentTime) {
      return NextResponse.redirect(
        new URL("/login" + "?error=sessionExp", req.url),
      );
    }
     */ // Check if the user is authenticated
    /* if (value !== "true") {
      return NextResponse.redirect(new URL("/login", req.url));
    } */
  } else {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}
