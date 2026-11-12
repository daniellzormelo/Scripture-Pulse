import { DetectionResponse, ActiveContext } from '../types/scripture';
import { normalizeBookName } from '../data/bibleDatabase';

// Standard 66 Bible books list
const BIBLE_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings",
  "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job",
  "Psalms", "Psalm", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah",
  "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai",
  "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans",
  "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians",
  "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy",
  "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation"
];

const NUMBER_MAP: Record<string, number> = {
  'one': 1, 'first': 1, '1st': 1, '1': 1,
  'two': 2, 'second': 2, '2nd': 2, '2': 2,
  'three': 3, 'third': 3, '3rd': 3, '3': 3,
  'four': 4, 'fourth': 4, '4th': 4, '4': 4,
  'five': 5, 'fifth': 5, '5th': 5, '5': 5,
  'six': 6, 'sixth': 6, '6th': 6, '6': 6,
  'seven': 7, 'seventh': 7, '7th': 7, '7': 7,
  'eight': 8, 'eighth': 8, '8th': 8, '8': 8,
  'nine': 9, 'ninth': 9, '9th': 9, '9': 9,
  'ten': 10, 'tenth': 10, '10th': 10, '10': 10,
  'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
  'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
  'twenty one': 21, 'twenty-one': 21, 'twenty 1': 21,
  'twenty two': 22, 'twenty-two': 22, 'twenty 2': 22,
  'twenty three': 23, 'twenty-three': 23, 'twenty 3': 23,
  'twenty four': 24, 'twenty-four': 24,
  'twenty five': 25, 'twenty-five': 25,
  'twenty six': 26, 'twenty-six': 26,
  'twenty seven': 27, 'twenty-seven': 27,
  'twenty eight': 28, 'twenty-eight': 28,
  'twenty nine': 29, 'twenty-nine': 29,
  'thirty': 30, 'thirty one': 31, 'thirty-one': 31,
  'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90, 'one hundred': 100
};

function parseNumber(str: string): number | null {
  if (!str) return null;
  const trimmed = str.trim().toLowerCase();
  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10);
  }
  if (NUMBER_MAP[trimmed] !== undefined) {
    return NUMBER_MAP[trimmed];
  }
  return null;
}

/**
 * Perform fast deterministic scripture reference detection
 */
export function parseScriptureLocally(
  text: string,
  context?: ActiveContext
): DetectionResponse {
  if (!text || typeof text !== 'string') {
    return { detected: false };
  }

  const rawSpoken = text.trim();
  const lower = rawSpoken.toLowerCase();

  // Pattern 1: Explicit Book + Chapter + Verse (e.g. "John chapter 3 verse 16", "Romans 8:28", "First John 4 verse 7")
  // Clean prefixes like "turn with me to", "open your bibles to"
  for (const book of BIBLE_BOOKS) {
    const bookRegexPattern = book
      .replace('1 ', '(1|1st|first|one)\\s*')
      .replace('2 ', '(2|2nd|second|two)\\s*')
      .replace('3 ', '(3|3rd|third|three)\\s*')
      .replace('Psalms', '(psalms?|psa)')
      .replace('Psalm', '(psalms?|psa)');

    // Full match regex: Book + Chapter + Verse (optional range)
    const fullPattern = new RegExp(
      `\\b${bookRegexPattern}\\s*(?:chapter)?\\s*(\\d+|[a-z\\s]+?)\\s*(?:verse|v\\.|verses)?\\s*(\\d+|[a-z\\s]+?)(?:\\s*(?:to|through|until|-)\\s*(\\d+|[a-z\\s]+?))?\\b`,
      'i'
    );

    const match = lower.match(fullPattern);
    if (match) {
      const rawBookMatched = book;
      const chapterVal = parseNumber(match[2]) || parseInt(match[2], 10);
      const verseStartVal = parseNumber(match[3]) || parseInt(match[3], 10);
      const verseEndVal = match[4] ? (parseNumber(match[4]) || parseInt(match[4], 10)) : verseStartVal;

      if (chapterVal && verseStartVal && !isNaN(chapterVal) && !isNaN(verseStartVal)) {
        return {
          detected: true,
          book: normalizeBookName(rawBookMatched),
          chapter: chapterVal,
          verse_start: verseStartVal,
          verse_end: verseEndVal && !isNaN(verseEndVal) ? verseEndVal : verseStartVal,
          confidence: 0.98,
          raw_spoken_phrase: rawSpoken
        };
      }
    }
  }

  // Pattern 2: Standard Notation like "John 3:16", "Rom 8:28-30", "1 Cor 13:4-7"
  const colonMatch = lower.match(/\b([1-3]?\s*[a-z]+)\s*(\d+)\s*:\s*(\d+)(?:\s*-\s*(\d+))?\b/i);
  if (colonMatch) {
    const bookStr = colonMatch[1];
    const chapterNum = parseInt(colonMatch[2], 10);
    const vStart = parseInt(colonMatch[3], 10);
    const vEnd = colonMatch[4] ? parseInt(colonMatch[4], 10) : vStart;

    return {
      detected: true,
      book: normalizeBookName(bookStr),
      chapter: chapterNum,
      verse_start: vStart,
      verse_end: vEnd,
      confidence: 0.99,
      raw_spoken_phrase: rawSpoken
    };
  }

  // Pattern 3: Relative Reference Resolution (e.g. "now look at verse 18", "skip to verse 20", "verses 28 to 30")
  if (context && context.book && context.chapter) {
    const relativeMatch = lower.match(/\b(?:look at|jump to|skip to|turn to|now|read)?\s*verses?\s*(\d+|[a-z\s]+?)(?:\s*(?:to|through|until|-)\s*(\d+|[a-z\s]+?))?\b/i);
    if (relativeMatch) {
      const vStart = parseNumber(relativeMatch[1]) || parseInt(relativeMatch[1], 10);
      const vEnd = relativeMatch[2] ? (parseNumber(relativeMatch[2]) || parseInt(relativeMatch[2], 10)) : vStart;

      if (vStart && !isNaN(vStart) && vStart > 0 && vStart < 177) {
        return {
          detected: true,
          book: context.book,
          chapter: context.chapter,
          verse_start: vStart,
          verse_end: vEnd && !isNaN(vEnd) ? vEnd : vStart,
          confidence: 0.95,
          raw_spoken_phrase: rawSpoken
        };
      }
    }
  }

  return { detected: false };
}
