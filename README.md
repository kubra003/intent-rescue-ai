# IntentRescue AI: Smart Emergency Triage & Coordination

**Ranking Up Submission &bull; PromptWars Hackathon &bull; Google Antigravity**

IntentRescue AI is a high-stakes emergency orchestration assistant built to demonstrate the power of **Google Gemini 1.5 Pro** and integrated **Google Services**. It transforms unstructured, multimodal emergency signals (Voice, Text, Images) into deterministic clinical protocols and real-world coordination actions.

## 🏥 Vertical: Healthcare & Emergency Response
Our solution targets the critical 'Golden Hour' in emergency medicine where rapid, accurate triage and coordination save lives.

## 🧠 Approach and Logic

### 1. Multimodal Intake (The 'Smart Assistant')
- **Voice-to-Intent**: Uses browser SpeechRecognition for immediate hands-free dictation in stressful environments.
- **Multimodal Perception**: Gemini 1.5 Pro analyzes both text descriptions and casualty images simultaneously to detect trauma types and severity.
- **PII Sanitization**: A custom regex-based sanitization layer ensures phone numbers, emails, and SSNs are redacted before hitting the LLM, aligning with HIPAA-inspired safety standards.

### 2. Clinical Reasoning Engine
- **Deterministic Triage**: We use **Zod-backed schema validation** on Gemini's JSON output. This ensures that the AI never 'hallucinates' the structure of a protocol. If validation fails, it triggers a 'Clinical Edge' fallback.
- **ABC Protocol**: The system prompt enforces adherence to universal medical standards (Airway, Breathing, Circulation) for all instructions.

### 3. Google Services Orchestration
- **Google Maps Interaction**: Automatically generates trauma-specific search terms (e.g., 'Trauma Center' for fractures) to find the nearest specialized hospital.
- **Google Calendar Integration**: Simulates immediate slot reservation for clinical callbacks, allowing victims or responders to book a telehealth bridge or ER notification.
- **Google Cloud Storage (Architecture)**: Designed to store intake logs and images with safe lifecycle policies for medical audit trails.

## 🛠️ How it Works
1.  **Intake**: User speaks or uploads a photo of an injury.
2.  **Analysis**: The `api/analyze` route calls Gemini 1.5 Pro with a high-stakes clinical system prompt.
3.  **Synthesis**: The engine returns a Triage Level (1-5), First Aid directions, and Hospital search terms.
4.  **Action**: 
    -   The UI renders a **Google Map** showing nearby medical facilities.
    -   The **Calendar Booking** component allows immediate coordination with on-call specialists.

## ⚖️ Assumptions & Security
- **Simulator Mode**: This application is a clinical simulator and includes a mandatory medical disclaimer.
- **Deterministic Guardrails**: We assume that in high-stakes environments, a 'safe fallback' is better than an 'AI guess'. We use a 3-layer validation (Schema -> PII -> Fallback).
- **API Availability**: Assumes valid Google Cloud project credentials for Maps, Calendar, and Generative AI.

## 🚀 Future Roadmap
- **Real-time Vitals**: Integrating with Wearables API.
- **Ambulance Telemetry**: Real-time traffic-aware routing using Google Maps Routes API.

---
**Built with Google Antigravity | Intent-Driven Development**
