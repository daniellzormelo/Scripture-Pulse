import React, { useState, useEffect } from 'react';
import { LiveOutputContent, PresentationTheme } from '../types/scripture';
import { liveSync } from '../services/liveSyncService';

export const LowerThirdOverlay: React.FC = () => {
  const [content, setContent] = useState<LiveOutputContent>(liveSync.getInitialContent());
  const [theme, setTheme] = useState<PresentationTheme>('gold-sacred');
  const [bgMode, setBgMode] = useState<string>('transparent');

  useEffect(() => {
    // Transparent body setup for OBS / vMix / EasyWorship Web Source
    const params = new URLSearchParams(window.location.search);
    const urlTheme = (params.get('theme') as PresentationTheme) || 'gold-sacred';
    const urlBg = params.get('bg') || 'transparent';

    setTheme(urlTheme);
    setBgMode(urlBg);

    if (urlBg === 'green') {
      document.body.style.backgroundColor = '#00ff00';
    } else if (urlBg === 'blue') {
      document.body.style.backgroundColor = '#0000ff';
    } else {
      document.body.style.backgroundColor = 'transparent';
    }

    document.documentElement.style.overflow = 'hidden';

    // 1. Instant cross-tab/cross-window BroadcastChannel subscription (<5ms)
    const unsubscribe = liveSync.subscribe((newContent) => {
      setContent(newContent);
    });

    // 2. Continuous server poll fallback (250ms) for external OBS engines on foreign PCs
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/easyworship-feed');
        if (response.ok) {
          const feed = await response.json();
          if (feed && feed.detected && feed.reference) {
            setContent({
              type: 'scripture',
              passage: {
                reference: feed.reference,
                book: feed.book || 'John',
                chapter: feed.chapter || 3,
                verse_start: feed.verse_start || 16,
                verse_end: feed.verse_end || 16,
                translation: feed.translation || 'NIV',
                verses: [{ verse: feed.verse_start || 16, text: feed.text || feed.fullText || '' }],
                fullText: feed.text || feed.fullText || ''
              }
            });
          }
        }
      } catch (e) {}
    }, 250);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  if (content.type === 'hold') {
    return (
      <div className={`w-screen h-screen flex flex-col justify-end p-8 select-none overflow-hidden ${
        bgMode === 'green' ? 'bg-[#00ff00]' : bgMode === 'blue' ? 'bg-[#0000ff]' : 'bg-transparent'
      }`}></div>
    );
  }

  return (
    <div className={`w-screen h-screen flex flex-col justify-end p-8 font-sans select-none overflow-hidden ${
      bgMode === 'green' ? 'bg-[#00ff00]' : bgMode === 'blue' ? 'bg-[#0000ff]' : 'bg-transparent'
    }`}>
      {/* Lower Third Floating Container with smooth slide-up animation */}
      <div className="max-w-5xl mx-auto w-full transition-all duration-500 transform translate-y-0 animate-slideUp">
        
        {/* CASE A: SCRIPTURE VERSE */}
        {content.type === 'scripture' && (
          <>
            {theme === 'gold-sacred' || (theme as string) === 'dark-gold' ? (
              <div className="bg-slate-950/95 border-2 border-amber-500/80 rounded-2xl p-6 text-amber-50 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-500/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <h3 className="text-2xl font-bold font-cinzel tracking-widest text-amber-400 uppercase">
                      {content.passage.reference}
                    </h3>
                  </div>
                  <span className="px-3 py-1 text-xs font-mono font-bold text-amber-300 bg-amber-950/80 rounded border border-amber-600/40 uppercase">
                    {content.passage.translation}
                  </span>
                </div>
                <p className="text-xl md:text-2xl font-cinzel leading-relaxed text-slate-100 italic font-medium">
                  "{content.passage.fullText}"
                </p>
              </div>
            ) : theme === 'glass-broadcast' ? (
              <div className="bg-slate-900/85 border border-white/20 backdrop-blur-2xl rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2.5 h-full bg-amber-500"></div>
                <div className="pl-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-extrabold tracking-wide font-cinzel text-amber-300 uppercase">
                      {content.passage.reference}
                    </span>
                    <span className="text-xs font-mono text-slate-300">[{content.passage.translation}]</span>
                  </div>
                  <p className="text-xl md:text-2xl font-serif leading-relaxed text-slate-100 italic">
                    "{content.passage.fullText}"
                  </p>
                </div>
              </div>
            ) : theme === 'high-contrast' ? (
              <div className="bg-black border-4 border-amber-500 p-6 text-white shadow-2xl">
                <div className="bg-amber-500 text-slate-950 px-3 py-1 font-extrabold text-xl inline-block mb-3 font-cinzel">
                  {content.passage.reference} · {content.passage.translation}
                </div>
                <p className="text-2xl font-bold font-sans text-white leading-snug">
                  "{content.passage.fullText}"
                </p>
              </div>
            ) : (
              <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-6 text-slate-100 shadow-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold font-mono tracking-wider text-amber-400 uppercase">
                    {content.passage.reference} ({content.passage.translation})
                  </span>
                </div>
                <p className="text-xl font-sans leading-relaxed text-slate-200 font-medium">
                  "{content.passage.fullText}"
                </p>
              </div>
            )}
          </>
        )}

        {/* CASE B: WORSHIP LYRICS LOWER-THIRD */}
        {content.type === 'worship' && (
          <div className="bg-slate-950/90 border border-slate-700/80 rounded-2xl p-6 text-white shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800 text-xs font-mono text-amber-400">
              <span className="font-bold">{content.songTitle}</span>
              <span>·</span>
              <span className="uppercase text-slate-400">{content.section}</span>
            </div>
            <div className="space-y-1">
              {content.lines.map((line, idx) => (
                <p key={idx} className="text-xl md:text-2xl font-bold text-slate-100 font-sans">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* CASE C: CUSTOM SLIDE LOWER-THIRD */}
        {content.type === 'custom' && (
          <div className="bg-slate-950/90 border-2 border-amber-500/80 rounded-2xl p-6 text-white shadow-2xl backdrop-blur-xl">
            <h4 className="text-lg font-bold font-cinzel text-amber-400 uppercase mb-2">
              {content.title}
            </h4>
            <p className="text-xl font-sans text-slate-100">
              {content.content}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
