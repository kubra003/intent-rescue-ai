import { z } from 'zod';

/**
 * IntentRescue AI: Principal Emergency Schema (Types Layer)
 * Enforces strict clinical data structure for first responders.
 * Updated: Confidence scoring and Observability latency metrics.
 */
export const EmergencyResponseSchema = z.object({
  emergencyType: z.string(),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'Critical', 'Unknown']),
  conditionSeverity: z.number().min(1).max(5),
  summary: z.string(),
  actions: z.array(z.string()),
  firstAidInstructions: z.array(z.string()),
  recommendedContacts: z.array(z.string()),
  nearbyHospitalSearchTerms: z.array(z.string()),
  confidence: z.number().min(0).max(1), // AI Confidence (0-1)
  latency: z.number().optional() // Performance metric (ms)
});

export type EmergencyResponse = z.infer<typeof EmergencyResponseSchema>;

// Hallucination Guardrail: Deterministic safe fallback
export const FallbackEmergencyResponse: EmergencyResponse = {
  emergencyType: "Unknown Emergency",
  riskLevel: "Unknown",
  conditionSeverity: 3,
  summary: "Clinical analysis suspended due to input ambiguity or technical error.",
  actions: [
    "Contact local emergency services immediately",
    "Seek professional help",
    "Avoid moving if injured, unless in immediate danger"
  ],
  firstAidInstructions: [
    "Stay calm and wait for help",
    "Do not attempt advanced medical procedures without training"
  ],
  recommendedContacts: ["Emergency Services (e.g. 911/112)"],
  nearbyHospitalSearchTerms: ["Emergency Room", "General Hospital"],
  confidence: 0,
  latency: 0
};
