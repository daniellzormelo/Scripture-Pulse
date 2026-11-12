/**
 * Comprehensive ScripturePulse Types
 * Upgraded for Scripture Live Studio Architecture
 */

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

export interface BibleVerseDetectionResult {
  detected: true;
  book: string;
  chapter: number;
  verse_start: number;
  verse_end: number;
  confidence: number;
  raw_spoken_phrase: string;
  engine: 'regex' | 'semantic' | 'gemini';
  passage?: BiblePassageText;
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

export type BibleTranslation = 
  | 'NIV'
  | 'KJV'
  | 'NKJV'
  | 'ESV'
  | 'NLT'
  | 'NASB'
  | 'CSB'
  | 'AMP'
  | 'MSG'
  | 'CEV'
  | 'RSV'
  | 'NRSV'
  | 'ASV'
  | 'NET'
  | 'TPT'
  | 'WEB'
  | 'TWI'     // Asante Twi / Akuapem Twi
  | 'RVR1960' // Spanish
  | 'LSG';    // French

export interface TranslationMeta {
  id: BibleTranslation;
  name: string;
  shortName: string;
  language: string;
  category: 'Popular' | 'Literal / Formal' | 'Dynamic / Thought' | 'Paraphrase' | 'Global / Indigenous';
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

export type PresentationTheme = 
  | 'gold-sacred' 
  | 'dark-gold'
  | 'minimal-dark' 
  | 'minimal-modern'
  | 'glass-broadcast' 
  | 'high-contrast' 
  | 'radiant-light' 
  | 'royal-blue'
  | 'slate-clean';

export interface DetectionQueueItem {
  id: string;
  timestamp: string;
  reference: string;
  book: string;
  chapter: number;
  verse_start: number;
  verse_end: number;
  confidence: number;
  raw_spoken_phrase: string;
  engine: 'regex' | 'semantic' | 'gemini';
  passage: BiblePassageText;
  tier: 'high-confidence' | 'suggestion';
  isPinned?: boolean;
}

export interface TranscriptSnippet {
  id: string;
  text: string;
  timestamp: string;
  isFinal: boolean;
  detectedRef?: string;
}

export interface WorshipSongSlide {
  id: string;
  section: 'Verse 1' | 'Verse 2' | 'Verse 3' | 'Chorus' | 'Chorus 2' | 'Bridge' | 'Outro' | 'Tag';
  lines: string[];
}

export interface WorshipSong {
  id: string;
  title: string;
  author?: string;
  key?: string;
  slides: WorshipSongSlide[];
}

export interface CustomSlide {
  id: string;
  title: string;
  content: string;
  theme?: string;
}

export type LiveOutputContent = 
  | { type: 'scripture'; passage: BiblePassageText }
  | { type: 'worship'; songTitle: string; section: string; lines: string[] }
  | { type: 'custom'; title: string; content: string }
  | { type: 'hold' }; // Hold / Blank Screen

export interface ProjectorSettings {
  theme: PresentationTheme;
  fontFamily: 'Cinzel' | 'Plus Jakarta Sans' | 'JetBrains Mono' | 'Georgia' | 'Arial';
  fontSize: 'small' | 'medium' | 'large' | 'huge';
  alignment: 'center' | 'left';
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundValue: string;
  churchLogoUrl?: string;
  holdScreenOpacity: number;
  lowerThirdTheme: 'gold-sacred' | 'minimal-dark' | 'glass-broadcast' | 'high-contrast';
  lowerThirdPosition: 'bottom' | 'top';
}
