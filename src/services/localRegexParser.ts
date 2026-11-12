import { DetectionResponse, ActiveContext, BiblePassageText } from '../types/scripture';
import { normalizeBookName, getBiblePassageText } from '../data/bibleDatabase';

// Standard 66 Bible books list with single chapter books tagged
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

// Single chapter books where "Jude 24" or "Obadiah 4" means Chapter 1 Verse 24
const SINGLE_CHAPTER_BOOKS = ["Obadiah", "Philemon", "2 John", "3 John", "Jude"];

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
  'twenty four': 24, 'twenty-four': 24, 'twenty 4': 24,
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
 * False-positive ambiguous guard
 * Disqualifies conversational phrases like:
 * "when I was 16, John told me"
 * "in chapter 3 of my book"
 */
function isAmbiguousFalsePositive(text: string): boolean {
  const lower = text.toLowerCase();
  // Conversation patterns
  if (/\b(when i was|years old|told me|spoke with me|friend of mine)\b/i.test(lower)) {
    return true;
  }
  if (/\b(my book|this book|my life)\b/i.test(lower) && !/\bbible|scripture|word of god\b/i.test(lower)) {
    return true;
  }
  return false;
}

/**
 * Engine 1: Instant deterministic local pattern and citation parser (<5ms, zero API cost)
 */
export function parseScriptureLocally(
  text: string,
  context?: ActiveContext
): DetectionResponse {
  if (!text || typeof text !== 'string') {
    return { detected: false };
  }

  const rawSpoken = text.trim();
  if (rawSpoken.length < 3) return { detected: false };

  // Guard against conversational false positives
  if (isAmbiguousFalsePositive(rawSpoken)) {
    return { detected: false };
  }

  const lower = rawSpoken.toLowerCase();

  // Pattern 0: Single-chapter shortcuts (e.g., "Jude 24", "Jude verse 24", "Philemon 4")
  for (const singleBook of SINGLE_CHAPTER_BOOKS) {
    const singlePattern = new RegExp(`\\b${singleBook}\\s*(?:verse|v\\.)?\\s*(\\d+|[a-z\\s]+?)(?:\\s*(?:to|through|until|-)\\s*(\\d+|[a-z\\s]+?))?\\b`, 'i');
    const sMatch = lower.match(singlePattern);
    if (sMatch) {
      const vStart = parseNumber(sMatch[1]) || parseInt(sMatch[1], 10);
      const vEnd = sMatch[2] ? (parseNumber(sMatch[2]) || parseInt(sMatch[2], 10)) : vStart;
      if (vStart && !isNaN(vStart) && vStart > 0) {
        return {
          detected: true,
          book: singleBook,
          chapter: 1,
          verse_start: vStart,
          verse_end: vEnd && !isNaN(vEnd) ? vEnd : vStart,
          confidence: 0.99,
          raw_spoken_phrase: rawSpoken,
          engine: 'regex'
        };
      }
    }
  }

  // Pattern 1: Standard Scripture Notation (e.g., "John 3:16", "Romans 8:28-31", "1 Cor 13:4-7", "Ps 23:1-4")
  const colonMatch = lower.match(/\b([1-3]?\s*[a-z]+)\s*(\d+)\s*:\s*(\d+)(?:\s*(?:-|to|through)\s*(\d+))?\b/i);
  if (colonMatch) {
    const rawBookStr = colonMatch[1].trim();
    const chapterNum = parseInt(colonMatch[2], 10);
    const vStart = parseInt(colonMatch[3], 10);
    const vEnd = colonMatch[4] ? parseInt(colonMatch[4], 10) : vStart;

    const norm = normalizeBookName(rawBookStr);
    if (chapterNum > 0 && vStart > 0) {
      return {
        detected: true,
        book: norm,
        chapter: chapterNum,
        verse_start: vStart,
        verse_end: vEnd,
        confidence: 0.99,
        raw_spoken_phrase: rawSpoken,
        engine: 'regex'
      };
    }
  }

  // Pattern 2: Explicit Spoken Scripture (e.g., "John chapter 3 verse 16", "First Corinthians thirteen verse 4")
  for (const book of BIBLE_BOOKS) {
    const bookRegexPattern = book
      .replace('1 ', '(1|1st|first|one)\\s*')
      .replace('2 ', '(2|2nd|second|two)\\s*')
      .replace('3 ', '(3|3rd|third|three)\\s*')
      .replace('Psalms', '(psalms?|psa)')
      .replace('Psalm', '(psalms?|psa)');

    // Regex matching "Book + [chapter] X + [verse] Y"
    const spokenPattern = new RegExp(
      `\\b${bookRegexPattern}\\s*(?:chapter)?\\s*(\\d+|[a-z\\s]+?)\\s*(?:verse|v\\.|verses)?\\s*(\\d+|[a-z\\s]+?)(?:\\s*(?:to|through|until|-)\\s*(\\d+|[a-z\\s]+?))?\\b`,
      'i'
    );

    const match = lower.match(spokenPattern);
    if (match) {
      const chapterVal = parseNumber(match[2]) || parseInt(match[2], 10);
      const verseStartVal = parseNumber(match[3]) || parseInt(match[3], 10);
      const verseEndVal = match[4] ? (parseNumber(match[4]) || parseInt(match[4], 10)) : verseStartVal;

      if (chapterVal && verseStartVal && !isNaN(chapterVal) && !isNaN(verseStartVal) && chapterVal > 0 && verseStartVal > 0) {
        return {
          detected: true,
          book: normalizeBookName(book),
          chapter: chapterVal,
          verse_start: verseStartVal,
          verse_end: verseEndVal && !isNaN(verseEndVal) ? verseEndVal : verseStartVal,
          confidence: 0.98,
          raw_spoken_phrase: rawSpoken,
          engine: 'regex'
        };
      }
    }
  }

  // Pattern 3: Relative Reference Resolution (Context-Carry)
  // When pastor says: "Now look at verse 18", "skip to verse 20", "read verses 28 through 30"
  if (context && context.book && context.chapter) {
    const relativeMatch = lower.match(/\b(?:look at|jump to|skip to|turn to|now|read|and)?\s*verses?\s*(\d+|[a-z\\s]+?)(?:\s*(?:to|through|until|-)\s*(\d+|[a-z\\s]+?))?\b/i);
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
          confidence: 0.96,
          raw_spoken_phrase: rawSpoken,
          engine: 'regex'
        };
      }
    }
  }

  return { detected: false };
}
