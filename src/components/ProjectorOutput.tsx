import React, { useState, useEffect } from 'react';
import { LiveOutputContent, ProjectorSettings } from '../types/scripture';
import { liveSync } from '../services/liveSyncService';

export const ProjectorOutput: React.FC = () => {
  const [content, setContent] = useState<LiveOutputContent>(liveSync.getInitialContent());
  const [settings, setSettings] = useState<ProjectorSettings>({
    theme: 'gold-sacred',
    fontFamily: 'Cinzel',
    fontSize: 'large',
    alignment: 'center',
    backgroundType: 'gradient',
    backgroundValue: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 100%)',
    churchLogoUrl: '',
    holdScreenOpacity: 0.85,
    lowerThirdTheme: 'gold-sacred',
    lowerThirdPosition: 'bottom'
  });

  useEffect(() => {
    // Hide default scrollbars and set viewport body styling
    document.documentElement.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#020617';

    // Subscribe to instantaneous (<5ms) BroadcastChannel updates
    const unsubscribe = liveSync.subscribe((newContent) => {
      setContent(newContent);
    });

    // Check query params for settings overrides
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get('theme');
    if (themeParam) {
      setSettings(prev => ({ ...prev, theme: themeParam as any }));
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const fontSizeClasses = {
    small: 'text-2xl md:text-3xl leading-relaxed',
    medium: 'text-3xl md:text-4xl leading-relaxed',
    large: 'text-4xl md:text-5xl lg:text-6xl leading-relaxed',
    huge: 'text-5xl md:text-6xl lg:text-7xl leading-snug'
  }[settings.fontSize];

  return (
    <div
      className="w-screen h-screen flex flex-col justify-center items-center p-8 md:p-16 select-none relative overflow-hidden transition-all duration-500"
      style={{
        background: settings.backgroundValue,
        fontFamily: settings.fontFamily === 'Cinzel' ? 'Cinzel, Georgia, serif' : 'Plus Jakarta Sans, sans-serif'
      }}
    >
      {/* Subtle Background Lighting Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* CASE 1: HOLD SCREEN / CHURCH LOGO */}
      {content.type === 'hold' && (
        <div
          className="flex flex-col items-center justify-center text-center space-y-6 transition-all duration-700 animate-fadeIn"
          style={{ opacity: settings.holdScreenOpacity }}
        >
          <div className="w-24 h-24 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center shadow-2xl backdrop-blur-md">
            <span className="text-amber-400 font-cinzel text-5xl">✞</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-widest text-amber-200 uppercase font-cinzel">
              SCRIPTURE<span className="text-amber-500">PULSE</span>
            </h1>
            <p className="text-sm md:text-base text-slate-400 font-sans tracking-wide">
              Live Sanctuary Projection System
            </p>
          </div>
        </div>
      )}

      {/* CASE 2: LIVE SCRIPTURE VERSE */}
      {content.type === 'scripture' && (
        <div className="max-w-6xl w-full mx-auto text-center space-y-8 z-10 transition-all duration-500 animate-fadeIn">
          {/* Scripture Passage Text */}
          <div className="relative">
            <p className={`${fontSizeClasses} text-slate-100 font-cinzel font-medium italic drop-shadow-lg tracking-wide text-balance`}>
              “{content.passage.fullText}”
            </p>
          </div>

          {/* Golden Reference Citation Card */}
          <div className="inline-flex items-center gap-4 px-6 py-2 rounded-2xl bg-slate-950/80 border-2 border-amber-500/60 shadow-2xl backdrop-blur-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-2xl md:text-3xl font-extrabold font-cinzel tracking-widest text-amber-400 uppercase">
              {content.passage.reference}
            </span>
            <span className="px-3 py-0.5 text-sm font-mono font-bold text-amber-300 bg-amber-950/80 rounded border border-amber-600/40 uppercase">
              {content.passage.translation}
            </span>
          </div>
        </div>
      )}

      {/* CASE 3: WORSHIP LYRICS */}
      {content.type === 'worship' && (
        <div className="max-w-5xl w-full mx-auto text-center space-y-8 z-10 animate-fadeIn">
          <div className="space-y-4">
            {content.lines.map((line, idx) => (
              <p
                key={idx}
                className={`${fontSizeClasses} font-bold text-white tracking-wide leading-tight drop-shadow-md`}
              >
                {line}
              </p>
            ))}
          </div>

          <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 shadow-lg text-slate-300 text-sm font-medium">
            <span className="text-amber-400 font-semibold">{content.songTitle}</span>
            <span className="text-slate-500">·</span>
            <span className="uppercase text-xs font-mono text-slate-400">{content.section}</span>
          </div>
        </div>
      )}

      {/* CASE 4: CUSTOM SLIDE */}
      {content.type === 'custom' && (
        <div className="max-w-5xl w-full mx-auto text-center space-y-6 z-10 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-extrabold font-cinzel tracking-widest text-amber-400 uppercase">
            {content.title}
          </h2>
          <p className="text-2xl md:text-3xl text-slate-100 font-sans leading-relaxed whitespace-pre-line">
            {content.content}
          </p>
        </div>
      )}

      {/* Watermark/Status Indicator in Lower Right */}
      <div className="absolute bottom-4 right-4 text-[10px] font-mono text-slate-600 flex items-center gap-1.5 select-none opacity-60">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>AUDIENCE PROJECTOR ONLINE</span>
      </div>
    </div>
  );
};
