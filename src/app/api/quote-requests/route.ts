import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createQuoteRequest } from "@/lib/backend/services";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await createQuoteRequest(payload);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ ok: false, error: "Invalid quote request", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Quote request failed" }, { status: 500 });
  }
}
