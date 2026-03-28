import { z } from 'zod';

export const EmergencyResponseSchema = z.object({
  emergencyType: z.string().describe("The categorization of the emergency (e.g., Road Accident, Chemical Exposure)."),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'Critical', 'Unknown']).describe("Assess the current risk level."),
  conditionSeverity: z.number().min(1).max(5).describe("Triage score: 1 (Minimal) to 5 (Critical/Life-Threatening)."),
  summary: z.string().describe("A one-sentence summary of the understood situation."),
  actions: z.array(z.string()).describe("A step-by-step list of verified, safe, actionable instructions."),
  firstAidInstructions: z.array(z.string()).describe("Specific first-aid steps if applicable (e.g. CPR, Pressure to wound)."),
  recommendedContacts: z.array(z.string()).describe("List of contacts (Ambulance, Poison Control, etc.) to call immediately."),
  nearbyHospitalSearchTerms: z.array(z.string()).describe("Search terms for Google Maps (e.g. 'Trauma Center', 'Burn Unit').")
});

export type EmergencyResponse = z.infer<typeof EmergencyResponseSchema>;

export const FallbackEmergencyResponse: EmergencyResponse = {
  emergencyType: "Unknown Emergency",
  riskLevel: "Unknown",
  conditionSeverity: 3,
  summary: "The input was unclear or verification failed. Stay safe and seek human assistance.",
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
  nearbyHospitalSearchTerms: ["Emergency Room", "General Hospital"]
};
