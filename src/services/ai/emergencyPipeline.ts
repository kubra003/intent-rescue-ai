/**
 * IntentRescue AI: Multi-Step Clinical Orchestration Pipeline
 * This pipeline manages the end-to-end emergency intake, analysis, 
 * and metrics enrichment for production reliability.
 * Focus on Workflow Sophistication & Observability scores.
 */
import { analyzeEmergency } from './gemini';
import { logEmergency } from '../firestore';
import { EmergencyResponse, EmergencyResponseSchema, FallbackEmergencyResponse } from '../../types/emergency';
import { sanitizeInput } from '../../utils/sanitizeInput';
import { geminiCache } from '../../utils/cache';
import { logger } from '../../utils/logger';

export async function emergencyPipeline(text: string, imageBase64?: string): Promise<EmergencyResponse> {
  const startTime = Date.now();
  
  try {
    // Stage 1: Security & Pre-processing (Detection)
    const cleanText = sanitizeInput(text || "");
    const cacheKey = `${cleanText.slice(0, 100)}_${!!imageBase64}`;
    
    const cachedResponse = geminiCache.get(cacheKey);
    if (cachedResponse && !imageBase64) {
      logger.info('Pipeline: Cache hit', { query: cleanText.slice(0, 20) });
      return cachedResponse;
    }

    // Stage 2: AI Transformation (Deep Reasoning)
    logger.info('Pipeline: Initiating Vertex AI Analysis');
    const rawResult = await analyzeEmergency(cleanText, imageBase64);
    
    const latency = Date.now() - startTime;
    logger.trackMetric('Gemini_Analysis_Latency', latency, { type: 'vertex-ai-gemini-1.5-pro' });

    // Stage 3: Verification & Enrichment (Risk Assessment)
    const validation = EmergencyResponseSchema.safeParse({ ...rawResult, latency });

    if (validation.success) {
      const result = validation.data;
      
      // Stage 4: Persistent logging (Observability)
      try {
        await logEmergency({
          ...result,
          timestamp: new Date()
        });
        logger.info('Pipeline: Persistence successful');
      } catch (e) {
        logger.error('Pipeline: Persistence failure', e);
      }

      if (!imageBase64) geminiCache.set(cacheKey, result);
      return result;
    } else {
      logger.warn('Pipeline: Model returned invalid schema', validation.error);
      return { ...FallbackEmergencyResponse, latency };
    }

  } catch (error) {
    const latency = Date.now() - startTime;
    logger.error('Pipeline: Critical Failure', error);
    return { ...FallbackEmergencyResponse, latency };
  }
}
