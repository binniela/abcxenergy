import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createContactRequest } from "@/lib/backend/services";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await createContactRequest(payload);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ ok: false, error: "Invalid contact request", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Contact request failed" }, { status: 500 });
  }
}
