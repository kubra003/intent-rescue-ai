import { EmergencyResponseSchema, FallbackEmergencyResponse } from '../src/schema/emergency';

describe('Deterministic Verification Layer - Zod Schema', () => {
  it('should cleanly validate a well-formed Gemini JSON payload', () => {
    const validJson = {
      emergencyType: "Chemical Spill",
      riskLevel: "High",
      conditionSeverity: 4,
      summary: "A green gas leak is affecting the factory floor.",
      actions: [
        "Evacuate the immediate area upwind", 
        "Cover mouth and nose with a damp cloth", 
        "Do not turn on electrical switches"
      ],
      firstAidInstructions: ["Flush eyes if exposed", "Deep breaths in fresh air"],
      recommendedContacts: ["Hazmat Unit", "Ambulance"],
      nearbyHospitalSearchTerms: ["Toxicology Center", "ER"]
    };

    const result = EmergencyResponseSchema.safeParse(validJson);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.riskLevel).toBe("High");
      expect(result.data.actions.length).toBe(3);
    }
  });

  it('should safely fail and reject hallucinated or malformed JSON (Missing Fields)', () => {
    const invalidJsonMisingData = {
      emergencyType: "Heart Attack",
      actions: ["Do CPR"]
      // Missing riskLevel, summary, recommendedContacts
    };

    const result = EmergencyResponseSchema.safeParse(invalidJsonMisingData);
    expect(result.success).toBe(false);
  });

  it('should safely fail on invalid enum types in riskLevel', () => {
    const invalidJsonBadEnum = {
      emergencyType: "Fire",
      riskLevel: "Super Critical", // Not in 'Low' | 'Medium' | 'High' | 'Critical' | 'Unknown'
      summary: "Big fire.",
      actions: ["Get out"],
      recommendedContacts: ["Fire Dept"]
    };

    const result = EmergencyResponseSchema.safeParse(invalidJsonBadEnum);
    expect(result.success).toBe(false);
  });

  it('should guarantee that the FallbackEmergencyResponse is exactly schema-compliant', () => {
    // This test ensures our "Safe Fallback" never accidentally causes a system crash itself
    const result = EmergencyResponseSchema.safeParse(FallbackEmergencyResponse);
    expect(result.success).toBe(true);
  });
});
