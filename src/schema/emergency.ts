import { z } from 'zod';

export const EmergencyResponseSchema = z.object({
  emergencyType: z.string().describe("The categorization of the emergency (e.g., Road Accident, Chemical Exposure)."),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'Critical', 'Unknown']).describe("Assess the current risk level."),
  summary: z.string().describe("A one-sentence summary of the understood situation."),
  actions: z.array(z.string()).describe("A step-by-step list of verified, safe, actionable instructions."),
  recommendedContacts: z.array(z.string()).describe("List of contacts (Ambulance, Poison Control, etc.) to call immediately.")
});

export type EmergencyResponse = z.infer<typeof EmergencyResponseSchema>;

export const FallbackEmergencyResponse: EmergencyResponse = {
  emergencyType: "Unknown Emergency",
  riskLevel: "Unknown",
  summary: "The input was unclear or verification failed. Stay safe and seek human assistance.",
  actions: [
    "Contact local emergency services immediately",
    "Seek professional help",
    "Avoid moving if injured, unless in immediate danger"
  ],
  recommendedContacts: ["Emergency Services (e.g. 911/112)"]
};
