import React, { useState, useEffect } from 'react';
import { PresentationTheme } from '../types/scripture';

export const ObsStandaloneOverlay: React.FC = () => {
  const [feedData, setFeedData] = useState<any>({
    detected: true,
    reference: "JOHN 3:16",
    translation: "NIV",
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
  });

  const [theme, setTheme] = useState<PresentationTheme>('dark-gold');
  const [bgMode, setBgMode] = useState<string>('transparent');

  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const urlTheme = (params.get('theme') as PresentationTheme) || 'dark-gold';
    const urlBg = params.get('bg') || 'transparent';

    setTheme(urlTheme);
    setBgMode(urlBg);

    // Set body background style for OBS Browser Source
    if (urlBg === 'green') {
      document.body.style.backgroundColor = '#00ff00';
    } else if (urlBg === 'blue') {
      document.body.style.backgroundColor = '#0000ff';
    } else {
      document.body.style.backgroundColor = 'transparent';
    }

    // 1. Initial sync from localStorage if available on same origin
    try {
      const saved = localStorage.getItem('active_verse_feed');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.detected) setFeedData(parsed);
      }
    } catch (e) {}

    // 2. Listen for real-time localStorage events & custom window events
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'active_verse_feed' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.detected) setFeedData(parsed);
        } catch (err) {}
      }
    };
    const handleCustomFeed = (e: any) => {
      if (e.detail && e.detail.detected) {
        setFeedData(e.detail);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('scripture-updated' as any, handleCustomFeed);

    // 3. Continuous high-frequency polling (250ms) for real-time server feed updates
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/easyworship-feed');
        if (response.ok) {
          const data = await response.json();
          if (data && data.detected) {
            setFeedData(data);
            try {
              localStorage.setItem('active_verse_feed', JSON.stringify(data));
            } catch (err) {}
          }
        }
      } catch (e) {
        // Fallback gracefully
      }
    }, 250);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('scripture-updated' as any, handleCustomFeed);
      clearInterval(interval);
    };
  }, []);

    const verseText = feedData.text || feedData.fullText || feedData.content_text || "";

    return (
    <div className={`w-screen h-screen flex flex-col justify-end p-8 font-sans select-none overflow-hidden ${
      bgMode === 'green' ? 'bg-[#00ff00]' : bgMode === 'blue' ? 'bg-[#0000ff]' : 'bg-transparent'
    }`}>
      
      {/* Lower Third Floating Container */}
      <div className="max-w-5xl mx-auto w-full transition-all duration-500 transform translate-y-0">
        
        {/* Theme 1: Gold Sacred */}
        {theme === 'gold-sacred' || theme === 'dark-gold' ? (
          <div className="bg-slate-950/95 border-2 border-amber-500/80 rounded-2xl p-6 text-amber-50 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-500/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <h3 className="text-2xl font-bold font-cinzel tracking-widest text-amber-400 uppercase">
                  {feedData.reference}
                </h3>
              </div>
              <span className="px-3 py-1 text-xs font-mono font-bold text-amber-300 bg-amber-950/80 rounded border border-amber-600/40 uppercase">
                {feedData.translation || 'NIV'}
              </span>
            </div>
            <p className="text-xl md:text-2xl font-cinzel leading-relaxed text-slate-100 italic font-medium">
              "{verseText}"
            </p>
          </div>
        ) : theme === 'glass-broadcast' ? (
          /* Theme 2: Glassmorphism Broadcast */
          <div className="bg-slate-900/80 border border-white/20 backdrop-blur-2xl rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2.5 h-full bg-amber-500"></div>
            <div className="pl-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-extrabold tracking-wide font-cinzel text-amber-300 uppercase">
                  {feedData.reference}
                </span>
                <span className="text-xs font-mono text-slate-300">[{feedData.translation || 'NIV'}]</span>
              </div>
              <p className="text-xl md:text-2xl font-serif leading-relaxed text-slate-100 italic">
                "{verseText}"
              </p>
            </div>
          </div>
        ) : theme === 'high-contrast' ? (
          /* Theme 3: High Contrast */
          <div className="bg-black border-4 border-amber-500 p-6 text-white shadow-2xl">
            <div className="bg-amber-500 text-slate-950 px-3 py-1 font-extrabold text-xl inline-block mb-3 font-cinzel">
              {feedData.reference} · {feedData.translation || 'NIV'}
            </div>
            <p className="text-2xl font-bold font-sans text-white leading-snug">
              "{verseText}"
            </p>
          </div>
        ) : (
          /* Theme 4: Minimal Dark */
          <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-bold font-mono tracking-wider text-amber-400 uppercase">
                {feedData.reference} ({feedData.translation || 'NIV'})
              </span>
            </div>
            <p className="text-xl font-sans leading-relaxed text-slate-200 font-medium">
              "{verseText}"
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
