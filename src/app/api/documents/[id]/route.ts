import { NextResponse } from "next/server";
import { demoSkuDocuments } from "@/lib/backend/mock-data";

export function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    const doc = demoSkuDocuments.find((candidate) => candidate.id === id);
    if (!doc) return new NextResponse("Document not found", { status: 404 });

    const body = [
      "%PDF-1.4",
      "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
      "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
      "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
      "4 0 obj << /Length 132 >> stream",
      `BT /F1 18 Tf 72 720 Td (${escapePdf(doc.title)}) Tj /F1 11 Tf 0 -32 Td (Summit HVAC Supply verified launch document.) Tj 0 -20 Td (${escapePdf(doc.storagePath)}) Tj ET`,
      "endstream endobj",
      "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
      "xref",
      "0 6",
      "0000000000 65535 f ",
      "0000000009 00000 n ",
      "0000000058 00000 n ",
      "0000000115 00000 n ",
      "0000000241 00000 n ",
      "0000000424 00000 n ",
      "trailer << /Size 6 /Root 1 0 R >>",
      "startxref",
      "494",
      "%%EOF",
    ].join("\n");

    return new NextResponse(body, {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `inline; filename="${doc.id}.pdf"`,
      },
    });
  });
}

function escapePdf(value: string): string {
  return value.replace(/[()\\]/g, "\\$&");
}
