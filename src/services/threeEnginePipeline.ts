import {
  BiblePassageText,
  DetectionResponse,
  ActiveContext,
  DetectionQueueItem
} from '../types/scripture';
import { parseScriptureLocally } from './localRegexParser';
import { searchOfflineBiblePhrases, getBiblePassageText } from '../data/bibleDatabase';

export interface MultiEngineResult {
  detected: boolean;
  engine: 'regex' | 'semantic' | 'gemini';
  tier: 'high-confidence' | 'suggestion';
  confidence: number;
  book?: string;
  chapter?: number;
  verse_start?: number;
  verse_end?: number;
  raw_spoken_phrase?: string;
  passage?: BiblePassageText;
}

/**
 * Three-Engine Parallel Scripture Detection Pipeline
 * - Engine 1: Instant Local Pattern & Regex Matcher (<500ms, 0 API cost)
 * - Engine 2: Local Offline Phrase & Semantic Search (sub-10ms)
 * - Engine 3: Gemini AI Paraphrase & Context Engine (async confirmation & paraphrase resolution)
 */
export async function runThreeEnginePipeline(
  text: string,
  currentContext: ActiveContext,
  currentTranslation: string = 'NIV',
  isOnline: boolean = true
): Promise<MultiEngineResult | null> {
  const clean = text.trim();
  if (!clean || clean.length < 3) return null;

  // ENGINE 1: Instant Local Regex Parser (<5ms)
  const regexResult = parseScriptureLocally(clean, currentContext.book ? currentContext : undefined);
  if (regexResult.detected && regexResult.confidence >= 0.90) {
    const passage = getBiblePassageText(
      regexResult.book,
      regexResult.chapter,
      regexResult.verse_start,
      regexResult.verse_end,
      currentTranslation
    );

    return {
      detected: true,
      engine: 'regex',
      tier: 'high-confidence',
      confidence: regexResult.confidence,
      book: regexResult.book,
      chapter: regexResult.chapter,
      verse_start: regexResult.verse_start,
      verse_end: regexResult.verse_end,
      raw_spoken_phrase: regexResult.raw_spoken_phrase,
      passage
    };
  }

  // ENGINE 2: Local Offline Phrase & Semantic Search (sub-10ms)
  const semanticMatches = searchOfflineBiblePhrases(clean, currentTranslation);
  if (semanticMatches.length > 0) {
    const topMatch = semanticMatches[0];
    if (topMatch.score >= 0.5) {
      const passage = getBiblePassageText(
        topMatch.book,
        topMatch.chapter,
        topMatch.verse_start,
        topMatch.verse_end,
        currentTranslation
      );

      return {
        detected: true,
        engine: 'semantic',
        tier: topMatch.score >= 0.75 ? 'high-confidence' : 'suggestion',
        confidence: topMatch.score,
        book: topMatch.book,
        chapter: topMatch.chapter,
        verse_start: topMatch.verse_start,
        verse_end: topMatch.verse_end,
        raw_spoken_phrase: clean,
        passage
      };
    }
  }

  // ENGINE 3: Gemini AI Paraphrase & Context Engine (Background Async)
  if (isOnline) {
    try {
      const response = await fetch('/api/parse-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: clean,
          current_context: currentContext.book ? currentContext : undefined
        })
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const geminiData = await response.json();
          if (geminiData.detected) {
            const passage = getBiblePassageText(
              geminiData.book,
              geminiData.chapter,
              geminiData.verse_start,
              geminiData.verse_end,
              currentTranslation
            );

            return {
              detected: true,
              engine: 'gemini',
              tier: (geminiData.confidence || 0.9) >= 0.85 ? 'high-confidence' : 'suggestion',
              confidence: geminiData.confidence || 0.88,
              book: geminiData.book,
              chapter: geminiData.chapter,
              verse_start: geminiData.verse_start,
              verse_end: geminiData.verse_end,
              raw_spoken_phrase: geminiData.raw_spoken_phrase || clean,
              passage
            };
          }
        }
      }
    } catch (e) {
      // Graceful offline fallback
    }
  }

  return null;
}
