/**
 * Structured Bible Reference Detection Schema & System Types
 */

export interface BibleVerseDetectionResult {
  detected: true;
  book: string;
  chapter: number;
  verse_start: number;
  verse_end: number;
  confidence: number;
  raw_spoken_phrase: string;
}

export interface NoVerseDetectionResult {
  detected: false;
}

export type DetectionResponse = BibleVerseDetectionResult | NoVerseDetectionResult;

export interface ActiveContext {
  book: string | null;
  chapter: number | null;
  lastUpdated?: number;
}

export interface ParseLogEntry {
  id: string;
  timestamp: string;
  input_text: string;
  response: DetectionResponse;
  latency_ms: number;
  resolved_from_context?: boolean;
  source: 'live_mic' | 'typed' | 'preset' | 'audio_upload';
}

export interface BibleVerseItem {
  verse: number;
  text: string;
}

export interface BiblePassageText {
  reference: string;
  book: string;
  chapter: number;
  verse_start: number;
  verse_end: number;
  translation: string;
  verses: BibleVerseItem[];
  fullText: string;
}

export type BibleTranslation = 
  | 'NIV' // New International Version
  | 'KJV' // King James Version
  | 'NKJV' // New King James Version
  | 'ESV' // English Standard Version
  | 'NASB' // New American Standard Bible
  | 'NLT' // New Living Translation
  | 'CSB' // Christian Standard Bible
  | 'AMP' // Amplified Bible
  | 'MSG' // The Message
  | 'CEV' // Contemporary English Version
  | 'RSV' // Revised Standard Version
  | 'NRSV' // New Revised Standard Version
  | 'ASV' // American Standard Version
  | 'NET' // New English Translation
  | 'TPT' // The Passion Translation
  | 'WEB' // World English Bible
  | 'RVR1960' // Reina-Valera Spanish
  | 'LSG'; // Louis Segond French

export interface TranslationMeta {
  id: BibleTranslation;
  name: string;
  shortName: string;
  language: string;
  category: 'Popular' | 'Literal / Formal' | 'Dynamic / Thought' | 'Paraphrase' | 'Global / Non-English';
}

export type PresentationTheme = 'dark-gold' | 'gold-sacred' | 'minimal-modern' | 'minimal-dark' | 'glass-broadcast' | 'slate-clean' | 'high-contrast';
