// Importing necessary types from Next.js
import { saveExerciseFileSchema } from "@/components/codeSpace/Codespace";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { api } from "@/trpc/server";

// Default handler function for the API route
export async function POST(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  try {
    const json = (await req.json()) as saveExerciseFileSchema;
    const result = await api.file.saveFile({
      exerciseId: json.exerciseId,
      groupId: json.groupId,
      data: json.data,
    });
    return NextResponse.json({ saved: result });
  } catch (error) {
    console.log("Error in login");
    return NextResponse.error();
  }
}
