import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeEmergency(text: string, imageBase64?: string) {
  // Using gemini-1.5-flash for lowest latency and highest deterministic performance
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
  
  const systemInstruction = `You are an elite AI emergency triage agent. 
Convert messy unstructured human emergency inputs into verified, actionable JSON protocols.
Do not hallucinate medical facts. Rely strictly on universal emergency guidelines.
Your payload must exactly match this JSON structure:
{
  "emergencyType": "string (e.g., Road Accident)",
  "riskLevel": "Low | Medium | High | Critical | Unknown",
  "summary": "string",
  "actions": ["array of strings (safe action steps)"],
  "recommendedContacts": ["array of strings (e.g. Ambulance, Police)"]
}`;

  const prompt = `Emergency Input: ${text}\n\nStrictly return ONLY valid JSON matching the exact schema requested.`;

  const parts: any[] = [];
  
  if (imageBase64) {
    // Basic base64 payload extraction
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

  const result = await model.generateContent({
    contents: [{ role: 'user', parts }],
    systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
    generationConfig: {
      temperature: 0.1, // Low temp for maximum determinism
      responseMimeType: "application/json",
    }
  });

  const responseText = result.response.text();
  return JSON.parse(responseText);
}
