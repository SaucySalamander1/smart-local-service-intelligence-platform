// backend/services/groqService.js
const Groq = require("groq-sdk");

let groq;

if (process.env.GROQ_API_KEY) {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
} else {
  console.warn("⚠️ GROQ_API_KEY not set. AI features will be unavailable.");
}

const SYSTEM_PROMPT = `
You are an expert AI assistant for a Smart Local Service Platform in Bangladesh.
Your job is to help users diagnose home/local service problems.

You will receive either:
1. An initial problem description
2. A follow-up answer to your previous question

ALWAYS respond with ONLY valid JSON — no markdown, no backticks, no extra text.

--- RESPONSE TYPE 1: Need more info (confidence < 70) ---
{
  "type": "question",
  "question": "Your single clarifying question here?",
  "category": "detected category",
  "confidence": 45
}

--- RESPONSE TYPE 2: Have enough info (confidence >= 70) ---
{
  "type": "result",
  "category": "electrical | plumbing | ac_cooling | appliance | gas | structural | carpentry | painting | pest_control | cleaning | general",
  "threatLevel": "low | medium | high",
  "confidence": 85,
  "diagnosis": "Clear 1-2 sentence explanation of the problem",
  "precautions": [
    { "text": "Precaution description here", "icon": "⚠️", "imageQuery": "electrical safety warning sign" },
    { "text": "Another precaution", "icon": "🔴", "imageQuery": "danger do not touch electrical wire" }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "title": "Short step title",
      "description": "Detailed 2-3 sentence description of exactly what to do in this step",
      "imageQuery": "person turning off electrical circuit breaker panel",
      "warning": "Safety warning for this step, or null if none"
    },
    {
      "stepNumber": 2,
      "title": "Next step title",
      "description": "Detailed description",
      "imageQuery": "electrician checking wiring with multimeter",
      "warning": null
    }
  ],
  "emergency": {
    "show": false,
    "message": "Why professional help is needed, or null",
    "callNumber": "999"
  }
}

--- STRICT RULES ---
1. Categories: electrical, plumbing, ac_cooling, appliance, gas, structural, carpentry, painting, pest_control, cleaning, general
2. Threat levels:
   - low: user can fix themselves, provide 3-5 steps
   - medium: needs attention, provide 2-3 steps + recommend professional
   - high: dangerous, emergency.show must be TRUE, minimal steps, strong precautions
3. For HIGH threat: set emergency.show = true
4. imageQuery must be very specific (5-8 words) for accurate Unsplash results
5. Understand both English and Bengali language
6. Context is Bangladesh — reference local numbers: Fire: 9555555, Emergency: 999
7. Always provide at least 2 precautions
8. Steps should be practical and actionable
`;

// ─── SANITIZE MESSAGES ────────────────────────────────────────────────────────
function sanitizeMessages(messages = []) {
  return messages.map(msg => ({
    role: String(msg.role),
    content: String(msg.content)
  }));
}

// ─── FALLBACK RESPONSE ────────────────────────────────────────────────────────
const FALLBACK = {
  type: "result",
  category: "general",
  threatLevel: "medium",
  confidence: 40,
  diagnosis: "I could not fully analyze your problem. Please consult a professional for safety.",
  precautions: [
    { text: "Do not attempt unsafe repairs yourself", icon: "⚠️", imageQuery: "danger warning safety sign" },
    { text: "Call a professional if unsure about the issue", icon: "🔴", imageQuery: "call technician professional repair" }
  ],
  steps: [
    {
      stepNumber: 1,
      title: "Describe your problem in detail",
      description: "Try again with more specific details — mention sounds, smells, when it started, and what happened before the problem.",
      imageQuery: "person describing problem to technician",
      warning: null
    }
  ],
  emergency: { show: false, message: null, callNumber: "999" }
};

// ─── TEXT ANALYSIS ────────────────────────────────────────────────────────────
async function analyzeInput(conversationHistory) {
  try {
    const cleanMessages = sanitizeMessages(conversationHistory);

    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...cleanMessages
      ],
      temperature: 0.2,
      max_tokens: 1500,
    });

    const raw = res.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Groq text error:", err.message);
    return FALLBACK;
  }
}

// ─── IMAGE ANALYSIS ───────────────────────────────────────────────────────────
async function analyzeImage(base64Image, mimeType = "image/jpeg", userText = "") {
  try {
    const res = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64Image}` }
            },
            {
              type: "text",
              text: userText || "Please analyze this image and identify the home/service problem you see. Assess the severity and provide guidance."
            }
          ]
        }
      ],
      temperature: 0.2,
      max_tokens: 1500,
    });

    const raw = res.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Groq vision error:", err.message);
    return FALLBACK;
  }
}

module.exports = { analyzeInput, analyzeImage };