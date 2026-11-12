import { GoogleGenAI, Type } from "@google/genai";
import { DetectionResponse, ActiveContext } from "../types/scripture";
import { parseScriptureLocally } from "../services/localRegexParser";

// Initialize Server-Side Gemini API SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const SYSTEM_INSTRUCTION = `You are the real-time AI Paraphrase & Context Detection Engine for "ScripturePulse" church projection system.
Your job is to listen to live spoken sermon transcripts from the pastor/speaker, identify when Bible passages are cited, paraphrased, or referenced, and extract the scripture citation into structured JSON.

### GUIDELINES:
1. CITATIONS & PARAPHRASES: Capture both explicit citations (e.g. "John 3:16", "First Corinthians 13:4") and direct paraphrases of scripture (e.g., "The Lord is my shepherd I will never lack", "God loved the world so much that He gave His Son", "we know all things work together for good").
2. CONTEXT-CARRY: If an active context is provided (e.g., Book="John", Chapter=3) and the pastor says "Look at verse 18" or "Skip down to verse 20", resolve it to "John 3:18" or "John 3:20".
3. AMBIGUOUS GUARDS: DO NOT trigger on ordinary conversational mentions (e.g., "When I was 16, John told me...", "In chapter 3 of my business book").
4. ACCENTS & PHONETICS: Accurately normalize "First John" -> "1 John", "Second Corinthians" -> "2 Corinthians", "Psalms" -> "Psalms".

### OUTPUT FORMAT:
Output strictly valid JSON with no markdown wrapping.
- When scripture is detected:
{
  "detected": true,
  "book": "John",
  "chapter": 3,
  "verse_start": 16,
  "verse_end": 16,
  "confidence": 0.95,
  "raw_spoken_phrase": "exact phrase from transcript",
  "engine": "gemini"
}
- When no scripture is detected:
{
  "detected": false
}`;

let quotaCooldownUntil = 0;

export async function parseSpeechWithGemini(
  text: string,
  currentContext?: ActiveContext
): Promise<DetectionResponse> {
  const localResult = parseScriptureLocally(text, currentContext);

  // If local parser detected with 95%+ confidence, return immediately for sub-500ms response
  if (localResult.detected && localResult.confidence >= 0.95) {
    return localResult;
  }

  // If API Key is not set or empty, or under quota cooldown, fallback gracefully to deterministic local regex parser
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY" || Date.now() < quotaCooldownUntil) {
    return localResult;
  }

  try {
    let contextPrompt = `Spoken transcript: "${text}"`;
    if (currentContext && currentContext.book && currentContext.chapter) {
      contextPrompt += `\n[ACTIVE SERMON CONTEXT: Book="${currentContext.book}", Chapter=${currentContext.chapter}]`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contextPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detected: { type: Type.BOOLEAN, description: "True if a Bible passage or verse was referenced, false otherwise" },
            book: { type: Type.STRING, description: "Normalized name of the Bible book (e.g. John, Romans, 1 Corinthians, Psalms)" },
            chapter: { type: Type.INTEGER, description: "Chapter number" },
            verse_start: { type: Type.INTEGER, description: "Starting verse number" },
            verse_end: { type: Type.INTEGER, description: "Ending verse number" },
            confidence: { type: Type.NUMBER, description: "Detection confidence score between 0.0 and 1.0" },
            raw_spoken_phrase: { type: Type.STRING, description: "Exact spoken phrase extracted from speaker transcript" }
          },
          required: ["detected"]
        }
      }
    });

    const jsonText = (response.text ?? "").trim();
    if (!jsonText) return localResult;

    const cleanJsonStr = jsonText.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "").trim();
    const parsed = JSON.parse(cleanJsonStr);

    if (parsed.detected && (!parsed.book || !parsed.chapter || !parsed.verse_start)) {
      return localResult;
    }

    if (parsed.detected) {
      return {
        detected: true,
        book: parsed.book,
        chapter: parsed.chapter,
        verse_start: parsed.verse_start,
        verse_end: parsed.verse_end || parsed.verse_start,
        confidence: parsed.confidence || 0.90,
        raw_spoken_phrase: parsed.raw_spoken_phrase || text,
        engine: 'gemini'
      };
    }

    return { detected: false };
  } catch (error: any) {
    const errorMsg = String(error?.message || error || "");
    if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || error?.status === 429) {
      quotaCooldownUntil = Date.now() + 60000; // 1-minute safety cooldown
    }
    return localResult;
  }
}

export async function parseAudioWithGemini(
  audioBase64: string,
  mimeType: string = "audio/mp3",
  currentContext?: ActiveContext
): Promise<{ text: string; detection: DetectionResponse }> {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY is missing. Audio transcription requires a valid API key.");
  }

  let prompt = "Transcribe the pastor's sermon audio and detect any Bible scripture references mentioned.";
  if (currentContext && currentContext.book && currentContext.chapter) {
    prompt += ` [Active sermon context: Book=${currentContext.book}, Chapter=${currentContext.chapter}]`;
  }

  const audioPart = {
    inlineData: {
      data: audioBase64,
      mimeType: mimeType
    }
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        audioPart,
        { text: prompt }
      ]
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + "\nAlso provide the transcript text along with detection.",
      responseMimeType: "application/json"
    }
  });

  const rawText = (response.text ?? "").trim();
  const cleanJsonStr = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "").trim();
  const parsed = JSON.parse(cleanJsonStr);

  return {
    text: parsed.raw_spoken_phrase || parsed.transcript || "Audio input parsed",
    detection: parsed.detected !== undefined ? parsed : { detected: false }
  };
}
