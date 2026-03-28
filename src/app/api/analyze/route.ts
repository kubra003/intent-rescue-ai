import { NextResponse } from 'next/server';
import { emergencyPipeline } from '../../../services/ai/emergencyPipeline';
import { FallbackEmergencyResponse } from '../../../types/emergency';
import { logger } from '../../../utils/logger';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RequestSchema = z.object({
  text: z.string().optional(),
  imageBase64: z.string().optional(),
});

/**
 * IntentRescue AI: Principal Analysis Endpoint (Architect Edition)
 * Leveraging multi-step AI orchestration and identity-based security.
 */
export async function POST(req: Request) {
  const startTime = Date.now();
  
  try {
    const rawBody = await req.json();
    const bodyValidation = RequestSchema.safeParse(rawBody);

    if (!bodyValidation.success) {
      logger.warn('API: Invalid Request Structure', bodyValidation.error);
      return NextResponse.json({ error: "Invalid Request Payload (Zod failure)" }, { status: 400 });
    }

    const { text, imageBase64 } = bodyValidation.data;

    if (!text && !imageBase64) {
      return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    // Call the high-orchestration AI Pipeline (Step 1-4)
    const result = await emergencyPipeline(text || "", imageBase64);
    
    const latency = Date.now() - startTime;
    logger.trackMetric('API_Total_Latency', latency, { route: '/analyze' });

    return NextResponse.json(result);
    
  } catch (error) {
    logger.error('API: Critical Route Failure', error);
    return NextResponse.json(FallbackEmergencyResponse, { status: 500 });
  }
}
