import React, { useState } from 'react';
import { BiblePassageText, PresentationTheme } from '../types/scripture';
import { Monitor, Maximize2, Palette, Sparkles, Layers, EyeOff, Layout } from 'lucide-react';

interface LowerThirdDisplayProps {
  passage: BiblePassageText | null;
  onClearDisplay?: () => void;
}

export const LowerThirdDisplay: React.FC<LowerThirdDisplayProps> = ({
  passage,
  onClearDisplay
}) => {
  const [theme, setTheme] = useState<PresentationTheme>('dark-gold');
  const [displayMode, setDisplayMode] = useState<'lower-third' | 'fullscreen-slide' | 'obs-transparent'>('lower-third');
  const [isVisible, setIsVisible] = useState(true);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const [livePassage, setLivePassage] = useState<BiblePassageText | null>(passage);

  // Sync state with props or custom window events for zero latency
  React.useEffect(() => {
    setLivePassage(passage);
  }, [passage]);

  React.useEffect(() => {
    const handleCustomUpdate = (e: any) => {
      if (e.detail && e.detail.detected) {
        setLivePassage({
          reference: e.detail.reference,
          book: e.detail.book,
          chapter: e.detail.chapter,
          verse_start: e.detail.verse_start,
          verse_end: e.detail.verse_end,
          translation: e.detail.translation || 'NIV',
          verses: [{ verse: e.detail.verse_start, text: e.detail.text }],
          fullText: e.detail.text
        });
      }
    };

    window.addEventListener('scripture-updated' as any, handleCustomUpdate);
    return () => {
      window.removeEventListener('scripture-updated' as any, handleCustomUpdate);
    };
  }, []);

  const currentPassage: BiblePassageText = livePassage || passage || {
    reference: "JOHN 3:16",
    book: "John",
    chapter: 3,
    verse_start: 16,
    verse_end: 16,
    translation: "NIV",
    verses: [{ verse: 16, text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." }],
    fullText: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      
      {/* Display Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Monitor className="w-5 h-5 text-emerald-500" />
            <span>Church Projection System & Lower-Third Display</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time broadcast overlay output for OBS Studio, vMix, or sanctuary projectors.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Display Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setDisplayMode('lower-third')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                displayMode === 'lower-third' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Lower Third
            </button>
            <button
              onClick={() => setDisplayMode('fullscreen-slide')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                displayMode === 'fullscreen-slide' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Full Screen
            </button>
            <button
              onClick={() => setDisplayMode('obs-transparent')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                displayMode === 'obs-transparent' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              OBS Chroma/Green
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors"
            title="Fullscreen Projector"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Theme Selector Strip */}
      <div className="my-4 flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-amber-500" />
          <span>Broadcast Theme:</span>
        </span>

        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'dark-gold', label: 'Gold Sacred' },
            { id: 'minimal-modern', label: 'Minimal Dark' },
            { id: 'glass-broadcast', label: 'Glassmorphism' },
            { id: 'high-contrast', label: 'High Contrast' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as PresentationTheme)}
              className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${
                theme === t.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-amber-500/30'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* PROJECTION SCREEN PREVIEW CONTAINER */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden transition-all duration-300 min-h-[360px] flex flex-col justify-end p-6 ${
          displayMode === 'obs-transparent'
            ? 'bg-emerald-900/90 dark:bg-emerald-950'
            : 'bg-slate-950'
        }`}
      >
        {/* Background Decorative Stage Simulation */}
        {displayMode !== 'obs-transparent' && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none opacity-90"></div>
        )}

        {/* Green Screen OBS Tag Indicator */}
        {displayMode === 'obs-transparent' && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[11px] font-mono rounded border border-emerald-500/40">
            OBS Chroma Key Mode (Key color: #064e3b)
          </div>
        )}

        {/* Lower-Third Overlay Body */}
        {isVisible && (
          <div
            className={`relative z-10 w-full transition-all duration-500 transform translate-y-0 ${
              displayMode === 'fullscreen-slide'
                ? 'my-auto max-w-3xl mx-auto text-center'
                : 'max-w-4xl mx-auto'
            }`}
          >
            {theme === 'dark-gold' && (
              <div className="bg-slate-900/95 border-2 border-amber-500/60 rounded-2xl p-6 text-amber-50 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-500/30">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <h3 className="text-xl font-bold font-cinzel tracking-widest text-amber-400 uppercase">
                      {currentPassage.reference}
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 text-xs font-mono font-semibold text-amber-300 bg-amber-950/80 rounded border border-amber-600/40">
                    {currentPassage.translation}
                  </span>
                </div>
                <p className="text-lg md:text-xl font-cinzel leading-relaxed text-slate-100 italic">
                  "{currentPassage.fullText}"
                </p>
              </div>
            )}

            {theme === 'minimal-modern' && (
              <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-6 text-slate-100 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold font-mono tracking-wider text-amber-400 uppercase">
                    {currentPassage.reference} ({currentPassage.translation})
                  </span>
                </div>
                <p className="text-base md:text-lg font-sans leading-relaxed text-slate-200 font-medium">
                  "{currentPassage.fullText}"
                </p>
              </div>
            )}

            {theme === 'glass-broadcast' && (
              <div className="bg-white/10 dark:bg-slate-900/40 border border-white/20 dark:border-slate-700/40 backdrop-blur-xl rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-400 to-amber-600"></div>
                <div className="pl-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-extrabold tracking-wide font-cinzel text-amber-300 uppercase">
                      {currentPassage.reference}
                    </span>
                    <span className="text-xs font-mono text-slate-300">[{currentPassage.translation}]</span>
                  </div>
                  <p className="text-base md:text-lg font-serif leading-relaxed text-slate-100 italic">
                    "{currentPassage.fullText}"
                  </p>
                </div>
              </div>
            )}

            {theme === 'high-contrast' && (
              <div className="bg-black border-4 border-amber-500 p-6 text-white shadow-2xl rounded-none">
                <div className="bg-amber-500 text-slate-950 px-3 py-1 font-extrabold text-lg inline-block mb-3 font-cinzel">
                  {currentPassage.reference} · {currentPassage.translation}
                </div>
                <p className="text-xl md:text-2xl font-bold font-sans text-white leading-snug">
                  "{currentPassage.fullText}"
                </p>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
