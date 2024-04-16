// Importing necessary types from Next.js
import { login } from "@/lib/auth";
import { type JsonObject } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

// Default handler function for the API route
export async function POST(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  try {
    const json = (await req.json()) as JsonObject;
    const result = await login({
      username: json.username as string,
      password: json.password as string,
    });
    if (result === true) {
      return NextResponse.json({ authorized: true });
    } else {
      return NextResponse.json({ authorized: false });
    }
  } catch (error) {
    console.log("Error in login");
    return NextResponse.error();
  }
}
