import { BiblePassageText, BibleTranslation } from '../types/scripture';
import { getBiblePassageText } from '../data/bibleDatabase';

export type VoiceCommandAction =
  | { type: 'NEXT_VERSE' }
  | { type: 'PREV_VERSE' }
  | { type: 'CLEAR_SCREEN' }
  | { type: 'CHANGE_TRANSLATION'; translation: BibleTranslation }
  | { type: 'NONE' };

/**
 * Evaluates spoken interim/final speech for strict preacher voice commands.
 * CRITICAL SAFETY RULE: Only active when a verse is currently live on air.
 */
export function parsePreacherVoiceCommand(
  text: string,
  isVerseLive: boolean
): VoiceCommandAction {
  if (!isVerseLive || !text) return { type: 'NONE' };

  const clean = text.trim().toLowerCase();

  // 1. Clear Screen Commands
  if (
    clean.includes('clear screen') ||
    clean.includes('take it down') ||
    clean.includes('clear the screen') ||
    clean.includes('blank screen') ||
    clean.includes('drop the verse') ||
    clean.includes('hold screen')
  ) {
    return { type: 'CLEAR_SCREEN' };
  }

  // 2. Next Verse Commands
  if (
    clean === 'next' ||
    clean === 'next verse' ||
    clean === 'next one' ||
    clean.includes('go to the next verse') ||
    clean.includes('read the next verse') ||
    clean.includes('move to the next verse') ||
    clean.endsWith('next verse')
  ) {
    return { type: 'NEXT_VERSE' };
  }

  // 3. Previous Verse Commands
  if (
    clean === 'previous' ||
    clean === 'back' ||
    clean === 'verse before' ||
    clean.includes('go back a verse') ||
    clean.includes('read the previous verse') ||
    clean.includes('previous verse')
  ) {
    return { type: 'PREV_VERSE' };
  }

  // 4. Dynamic Translation Voice Commands
  if (clean.includes('king james') || clean.includes('in kjv') || clean.includes('read kjv')) {
    return { type: 'CHANGE_TRANSLATION', translation: 'KJV' };
  }
  if (clean.includes('new international') || clean.includes('in niv') || clean.includes('read it in niv')) {
    return { type: 'CHANGE_TRANSLATION', translation: 'NIV' };
  }
  if (clean.includes('new king james') || clean.includes('in nkjv')) {
    return { type: 'CHANGE_TRANSLATION', translation: 'NKJV' };
  }
  if (clean.includes('english standard') || clean.includes('in esv') || clean.includes('read esv')) {
    return { type: 'CHANGE_TRANSLATION', translation: 'ESV' };
  }
  if (clean.includes('new living') || clean.includes('in nlt') || clean.includes('read nlt')) {
    return { type: 'CHANGE_TRANSLATION', translation: 'NLT' };
  }
  if (clean.includes('amplified') || clean.includes('in amp')) {
    return { type: 'CHANGE_TRANSLATION', translation: 'AMP' };
  }
  if (clean.includes('message bible') || clean.includes('in msg')) {
    return { type: 'CHANGE_TRANSLATION', translation: 'MSG' };
  }
  if (clean.includes('switch to twi') || clean.includes('read in twi') || clean.includes('in twi') || clean.includes('give me twi')) {
    return { type: 'CHANGE_TRANSLATION', translation: 'TWI' };
  }
  if (clean.includes('spanish') || clean.includes('reina valera')) {
    return { type: 'CHANGE_TRANSLATION', translation: 'RVR1960' };
  }
  if (clean.includes('french') || clean.includes('louis segond')) {
    return { type: 'CHANGE_TRANSLATION', translation: 'LSG' };
  }

  return { type: 'NONE' };
}

/**
 * Calculate next or previous verse for live on-air navigation
 */
export function stepPassageVerse(
  passage: BiblePassageText,
  direction: 'next' | 'prev',
  translation: string = passage.translation
): BiblePassageText {
  const currentV = passage.verse_start;
  const newV = direction === 'next' ? currentV + 1 : Math.max(1, currentV - 1);
  return getBiblePassageText(passage.book, passage.chapter, newV, newV, translation);
}
