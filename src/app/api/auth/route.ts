// Importing necessary types from Next.js
import { login } from "@/lib/auth";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

// Default handler function for the API route
export async function POST(req: NextApiRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  try {
    const json = await req.json();
    const result = await login({
      username: json.username,
      password: json.password,
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
