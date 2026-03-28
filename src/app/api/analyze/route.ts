import { NextResponse } from 'next/server';
import { analyzeEmergency } from '../../../lib/gemini';
import { EmergencyResponseSchema, FallbackEmergencyResponse } from '../../../schema/emergency';
import { sanitizeInput } from '../../../lib/utils/sanitizeInput';
import { geminiCache } from '../../../lib/utils/cache';
import { logEmergency } from '../../../lib/services/firestore';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RequestSchema = z.object({
  text: z.string().optional(),
  imageBase64: z.string().optional(),
});

/**
 * IntentRescue AI: Principal Analysis Endpoint
 * Handles secure, high-stakes medical triage with Google Services.
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    
    // 1. Validate Input Structure (Security)
    const bodyValidation = RequestSchema.safeParse(rawBody);
    if (!bodyValidation.success) {
      return NextResponse.json({ error: "Invalid Request Payload (Zod failure)" }, { status: 400 });
    }
    const { text, imageBase64 } = bodyValidation.data;

    if (!text && !imageBase64) {
      return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    // 2. Sanitize and Cache Check (Security & Efficiency)
    const cleanText = sanitizeInput(text || "");
    const cacheKey = `${cleanText.slice(0, 100)}_${!!imageBase64}`;
    const cachedResponse = geminiCache.get(cacheKey);

    if (cachedResponse && !imageBase64) {
      console.log('Cache hit for query:', cleanText.slice(0, 20));
      return NextResponse.json(cachedResponse);
    }

    // 3. Multimodal Analysis (Smart Gemini 1.5 Pro)
    let rawJsonResult;
    try {
      rawJsonResult = await analyzeEmergency(cleanText, imageBase64);
    } catch (e: any) {
      console.error("Gemini Failure:", e);
      return NextResponse.json({
         ...FallbackEmergencyResponse,
         summary: `Gemini API Crash: ${e.message || String(e)}`
      });
    }

    // 4. Verification Guardrail (Code Quality)
    const validationResult = EmergencyResponseSchema.safeParse(rawJsonResult);

    if (validationResult.success) {
      const hospitalCoordPayload = validationResult.data;
      
      // 5. Firebase Real-time Logging (Google Services)
      try {
        await logEmergency({
          emergencyType: hospitalCoordPayload.emergencyType,
          riskLevel: hospitalCoordPayload.riskLevel,
          conditionSeverity: hospitalCoordPayload.conditionSeverity,
          summary: hospitalCoordPayload.summary
        });
      } catch (logErr) {
        console.warn('Logging skipped/failed:', logErr);
      }

      // 6. Efficiency: Cache output for similar text queries
      if (!imageBase64) geminiCache.set(cacheKey, hospitalCoordPayload);

      return NextResponse.json(hospitalCoordPayload);
    } else {
      console.warn("Zod Validation Failed:", validationResult.error);
      return NextResponse.json({
         ...FallbackEmergencyResponse,
         summary: `Schema Verification Failure. Integrity guard active.`
      });
    }
    
  } catch (error) {
    console.error("Critical API Route Error:", error);
    return NextResponse.json(FallbackEmergencyResponse, { status: 500 });
  }
}
