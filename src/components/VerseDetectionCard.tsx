import React, { useState, useEffect } from 'react';
import { DetectionResponse, BiblePassageText } from '../types/scripture';
import { getBiblePassageText, ALL_TRANSLATIONS } from '../data/bibleDatabase';
import { CheckCircle2, XCircle, BookOpen, Send, Copy, Check, Sparkles } from 'lucide-react';

interface VerseDetectionCardProps {
  detection: DetectionResponse | null;
  onSendToProjection: (passage: BiblePassageText) => void;
}

export const VerseDetectionCard: React.FC<VerseDetectionCardProps> = ({
  detection,
  onSendToProjection
}) => {
  const [translation, setTranslation] = useState<string>('NIV');
  const [copied, setCopied] = useState<boolean>(false);
  const [passageText, setPassageText] = useState<BiblePassageText | null>(null);

  // Synchronously update passage when detection or translation changes, or via instant event
  useEffect(() => {
    if (detection && detection.detected) {
      const textData = getBiblePassageText(
        detection.book,
        detection.chapter,
        detection.verse_start,
        detection.verse_end,
        translation
      );
      setPassageText(textData);
    } else {
      setPassageText(null);
    }
  }, [detection, translation]);

  // Zero-latency instant window event listener
  useEffect(() => {
    const handleInstantFeed = (e: any) => {
      if (e.detail && e.detail.detected) {
        setPassageText({
          reference: e.detail.reference,
          book: e.detail.book,
          chapter: e.detail.chapter,
          verse_start: e.detail.verse_start,
          verse_end: e.detail.verse_end,
          translation: e.detail.translation || translation,
          verses: [{ verse: e.detail.verse_start, text: e.detail.text }],
          fullText: e.detail.text
        });
      }
    };
    window.addEventListener('scripture-updated' as any, handleInstantFeed);
    return () => {
      window.removeEventListener('scripture-updated' as any, handleInstantFeed);
    };
  }, [translation]);

  if (!detection) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Awaiting Speech Stream
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Start the microphone listener or select a sermon preset to detect Bible verses in real time.
        </p>
      </div>
    );
  }

  if (!detection.detected) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-all">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
            <XCircle className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                No Bible Reference Detected
              </span>
              <span className="px-2 py-0.5 text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded">
                {"detected: false"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              General pastoral commentary or congregation dialogue spoken without scripture citations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const confidencePercent = Math.round(detection.confidence * 100);

  const handleCopyText = () => {
    if (!passageText) return;
    navigator.clipboard.writeText(`${passageText.reference} (${passageText.translation})\n"${passageText.fullText}"`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 dark:border-amber-500/30 rounded-2xl p-6 shadow-lg relative overflow-hidden transition-all">
      
      {/* Decorative Golden Accent Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none blur-xl"></div>

      {/* Card Header: Citation Badge & Confidence */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
                Scripture Detected
              </span>
              <span className="px-2 py-0.5 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded border border-emerald-200 dark:border-emerald-800">
                {confidencePercent}% Confidence
              </span>
            </div>
            <h2 className="text-2xl font-bold font-cinzel text-slate-900 dark:text-white mt-0.5">
              {passageText?.reference || `${detection.book} ${detection.chapter}:${detection.verse_start}`}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => passageText && onSendToProjection(passageText)}
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send to Broadcast Display</span>
          </button>
        </div>
      </div>

      {/* Raw Spoken Phrase Extracted */}
      <div className="my-4 p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 rounded-xl flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Raw Spoken Phrase:</span>{" "}
          <span className="font-mono italic">"{detection.raw_spoken_phrase}"</span>
        </div>
      </div>

      {/* Live Broadcast Graphic Lower-Third Preview Box */}
      {passageText && (
        <div className="mb-4 bg-slate-950 border-2 border-amber-500/80 rounded-2xl p-4 text-amber-50 shadow-md relative overflow-hidden transition-all">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-500/40">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold text-amber-400 tracking-wider uppercase">
                LIVE BROADCAST OVERLAY PREVIEW (OBS / EASYWORSHIP / VMIX)
              </span>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300 bg-amber-950/90 rounded border border-amber-500/50 uppercase">
              {passageText.translation} · &lt; 2ms STREAM
            </span>
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold font-cinzel text-amber-300 tracking-wider">
              {passageText.reference}
            </h4>
            <p className="text-sm font-cinzel leading-snug text-slate-100 italic">
              "{passageText.fullText}"
            </p>
          </div>
        </div>
      )}

      {/* Scripture Text Box & Translation Switcher */}
      {passageText && (
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>Passage Text ({passageText.translation})</span>
            </span>

            {/* Full Bible Translations Selector */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="hidden sm:flex items-center gap-1 p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
                {['NIV', 'KJV', 'NKJV', 'ESV', 'NLT'].map((trans) => (
                  <button
                    key={trans}
                    onClick={() => setTranslation(trans)}
                    className={`px-2 py-0.5 text-[11px] font-semibold rounded transition-all ${
                      translation === trans
                        ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {trans}
                  </button>
                ))}
              </div>

              <select
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                className="px-2 py-1 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {ALL_TRANSLATIONS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.shortName} - {t.name} ({t.language})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-base font-serif-cinzel text-slate-800 dark:text-slate-100 leading-relaxed italic">
            "{passageText.fullText}"
          </p>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Book: {passageText.book} · Chapter: {passageText.chapter} · Verses: {passageText.verse_start}-{passageText.verse_end}</span>
            <button
              onClick={handleCopyText}
              className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1 font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Passage'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
