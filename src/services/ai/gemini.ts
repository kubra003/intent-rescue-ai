import { VertexAI } from '@google-cloud/vertexai';

/**
 * IntentRescue AI: Principal Intelligence Engine (Vertex AI Edition)
 * Migrated from Google AI Studio to Vertex AI for production-grade reliability
 * and identity-based security (IAM) on Cloud Run.
 */

// Initialize Vertex AI with the project and location (Default to us-central1)
const project = process.env.GOOGLE_CLOUD_PROJECT || 'intent-rescue-ai-kh';
const location = 'us-central1';

const vertexAI = new VertexAI({ project: project, location: location });

// Instantiate the model
const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

export async function analyzeEmergency(text: string, imageBase64?: string) {
  const systemInstruction = `You are an elite AI emergency medical triage and coordination agent. 
Your goal is to convert unstructured human emergency inputs into high-precision, verified JSON protocols for first responders and victims.

CRITICAL GUIDELINES:
1. Do not hallucinate medical facts. Rely on universal emergency medicine standards (e.g., ABCs - Airway, Breathing, Circulation).
2. Assess "conditionSeverity" on a scale of 1 (Stable/Minimal) to 5 (Critical/Life-Threatening).
3. "firstAidInstructions" should be immediate, safe actions for a layperson to perform before help arrives.
4. "nearbyHospitalSearchTerms" should be specific to the trauma (e.g., if there's a burn, include 'Burn Center'; if it's a child, include 'Pediatric ER').
5. Provide a "confidence" score (0.0 to 1.0) based on the clarity and evidence in the input.

Your payload must exactly match this JSON structure:
{
  "emergencyType": "string",
  "riskLevel": "Low | Medium | High | Critical | Unknown",
  "conditionSeverity": number (1-5),
  "summary": "string",
  "actions": ["string"],
  "firstAidInstructions": ["string"],
  "recommendedContacts": ["string"],
  "nearbyHospitalSearchTerms": ["string"],
  "confidence": number
}`;

  const prompt = `Emergency Input: ${text}\n\nStrictly return ONLY valid JSON matching the exact schema requested.`;

  const contents: any[] = [];
  const parts: any[] = [];

  if (imageBase64) {
    const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      parts.push({
        inlineData: {
          mimeType: match[1],
          data: match[2]
        }
      });
    }
  }

  parts.push({ text: prompt });
  contents.push({ role: 'user', parts });

  // Vertex AI Generation
  const result = await generativeModel.generateContent({
    contents: contents,
    systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    }
  });

  const response = result.response;
  const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  
  return JSON.parse(responseText);
}
