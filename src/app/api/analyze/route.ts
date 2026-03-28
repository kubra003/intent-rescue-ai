import { NextResponse } from 'next/server';
import { analyzeEmergency } from '../../../lib/gemini';
import { EmergencyResponseSchema, FallbackEmergencyResponse } from '../../../schema/emergency';

// Strict Edge routing helps performance but note that google generative-ai requires Node.js environment
// We will export default dynamic mode for Vercel/Firebase.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function sanitizePII(text: string): string {
  // Enhanced PII sanitization: Stripping potential phones and SSNs from text.
  let sanitized = text.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE REDACTED]');
  sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN REDACTED]');
  sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REDACTED]');
  return sanitized;
}

export async function POST(req: Request) {
  try {
    const { text, imageBase64 } = await req.json();

    if (!text && !imageBase64) {
      return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    const cleanText = sanitizePII(text || "");

    // 1. Analyze using Gemini
    let rawJsonResult;
    try {
      rawJsonResult = await analyzeEmergency(cleanText, imageBase64);
    } catch (e) {
      console.error("Gemini Failure:", e);
      return NextResponse.json(FallbackEmergencyResponse);
    }

    // 2. Deterministic Verification Layer using Zod
    const validationResult = EmergencyResponseSchema.safeParse(rawJsonResult);

    if (validationResult.success) {
      // Passes verification 
      return NextResponse.json(validationResult.data);
    } else {
      console.warn("Zod Validation Failed:", validationResult.error);
      // Hallucination Guardrail: Fall back to safe deterministic default
      return NextResponse.json(FallbackEmergencyResponse);
    }
    
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(FallbackEmergencyResponse, { status: 500 });
  }
}
