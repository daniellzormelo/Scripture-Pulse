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

const SYSTEM_INSTRUCTION = `You are a real-time speech parser for a church projection system. Your sole task is to listen to the audio stream or read live speech transcripts from the pastor/speaker, identify when a Bible passage or verse is referenced, and extract the reference into structured JSON.

### GUIDELINES:
1. CONTINUOUS LISTENING: Analyze every sentence spoken by the preacher.
2. EXPLICIT CITATIONS: When a speaker mentions a Bible book, chapter, and verse (e.g., "Turn with me to John chapter 3 verse 16" or "Romans 8 verse 28"), immediately capture it.
3. RELATIVE REFERENCE RESOLUTION: If the speaker previously cited a chapter (e.g., "John Chapter 3") and later says "Now look at verse 18" or "Skip to verse 20", maintain context and resolve the implied reference to "John 3:18" or "John 3:20".
4. ACCENT & PHONETIC FLEXIBILITY: Account for common phonetic speech variations, regional pronunciations, and fast speech patterns (e.g., "First John" vs "1 John", "Psalms" vs "Psalm").

### OUTPUT RULES:
- Output ONLY valid, raw JSON. Do not include markdown formatting, markdown code fences (\`\`\`json), commentary, or introductory text.
- If a Bible verse is detected, output this exact schema:
{
  "detected": true,
  "book": "John",
  "chapter": 3,
  "verse_start": 16,
  "verse_end": 16,
  "confidence": 0.98,
  "raw_spoken_phrase": "John chapter 3 verse 16"
}

- If no Bible reference is spoken, output:
{
  "detected": false
}`;

export async function parseSpeechWithGemini(
  text: string,
  currentContext?: ActiveContext
): Promise<DetectionResponse> {
  const localResult = parseScriptureLocally(text, currentContext);

  // If API Key is not set or empty, fallback gracefully to deterministic local regex parser
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
    return localResult;
  }

  try {
    let contextPrompt = `Spoken transcript: "${text}"`;
    if (currentContext && currentContext.book && currentContext.chapter) {
      contextPrompt += `\n[PREVIOUS ACTIVE CONTEXT: Book="${currentContext.book}", Chapter=${currentContext.chapter}]`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
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
    if (!jsonText) {
      return localResult;
    }

    // Clean potential code fences if any
    const cleanJsonStr = jsonText.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "").trim();
    const parsed = JSON.parse(cleanJsonStr) as DetectionResponse;

    if (parsed.detected && (!parsed.book || !parsed.chapter || !parsed.verse_start)) {
      return localResult;
    }

    return parsed;
  } catch (error) {
    console.warn("Gemini API call failed, using local parser fallback:", error);
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
    model: "gemini-3.8-flash",
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
