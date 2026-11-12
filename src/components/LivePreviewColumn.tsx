import React from 'react';
import {
  LiveOutputContent,
  BiblePassageText
} from '../types/scripture';
import { getBiblePassageText, scriptureDatabase } from '../data/bibleDatabase';
import {
  Monitor,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface LivePreviewColumnProps {
  currentContent: LiveOutputContent;
  onClearScreen: () => void;
  onNavigateVerse: (direction: 'next' | 'prev') => void;
  onJumpToVerse: (verseNum: number) => void;
  onLaunchProjector: () => void;
}

export const LivePreviewColumn: React.FC<LivePreviewColumnProps> = ({
  currentContent,
  onClearScreen,
  onNavigateVerse,
  onJumpToVerse,
  onLaunchProjector
}) => {
  // Extract active chapter verse count for the Smart Chapter Navigator
  let activeBook = 'John';
  let activeChapter = 3;
  let activeVerse = 16;
  let totalVersesInChapter = 25;

  if (currentContent.type === 'scripture') {
    activeBook = currentContent.passage.book;
    activeChapter = currentContent.passage.chapter;
    activeVerse = currentContent.passage.verse_start;
    
    // Estimate or lookup verses in current chapter
    const chapterMap = scriptureDatabase[activeBook]?.[activeChapter];
    if (chapterMap) {
      const verseKeys = Object.keys(chapterMap).map(v => parseInt(v, 10));
      totalVersesInChapter = Math.max(...verseKeys, 25);
    }
  }

  const verseNumbers = Array.from({ length: Math.min(35, totalVersesInChapter) }, (_, i) => i + 1);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full shadow-lg overflow-hidden">
      
      {/* Column Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Live Preview & Navigator
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onClearScreen}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              currentContent.type !== 'hold'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            title="Take off air (Return Projector to Hold Screen)"
          >
            <EyeOff className="w-3 h-3" />
            <span>Hold Screen</span>
          </button>
        </div>
      </div>

      <div className="p-3 space-y-4 flex-1 flex flex-col overflow-y-auto">
        
        {/* Miniature Live Output Monitor (16:9 Aspect Ratio) */}
        <div className="relative aspect-video w-full bg-slate-950 border-2 border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-end p-4 select-none group">
          
          {/* Status Indicator */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-300">
            <span className={`w-1.5 h-1.5 rounded-full ${currentContent.type !== 'hold' ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
            <span>{currentContent.type !== 'hold' ? 'ON AIR' : 'HOLD SCREEN'}</span>
          </div>

          <button
            onClick={onLaunchProjector}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            title="Pop out Full Audience Window"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Monitor Screen Content */}
          {currentContent.type === 'hold' && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-60 my-auto">
              <span className="text-amber-500 text-3xl font-cinzel">✞</span>
              <span className="text-[11px] font-cinzel font-bold text-amber-200 uppercase tracking-widest">
                ScripturePulse Hold Screen
              </span>
            </div>
          )}

          {currentContent.type === 'scripture' && (
            <div className="bg-slate-900/95 border border-amber-500/60 rounded-lg p-3 text-white shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-1 mb-1 border-b border-amber-500/30">
                <span className="text-xs font-bold font-cinzel text-amber-400 uppercase tracking-wider">
                  {currentContent.passage.reference}
                </span>
                <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-950 px-1 rounded">
                  {currentContent.passage.translation}
                </span>
              </div>
              <p className="text-xs font-cinzel leading-snug line-clamp-3 text-slate-200 italic">
                "{currentContent.passage.fullText}"
              </p>
            </div>
          )}

          {currentContent.type === 'worship' && (
            <div className="bg-slate-900/90 border border-indigo-500/60 rounded-lg p-3 text-white">
              <div className="text-[10px] font-mono text-indigo-400 font-bold mb-1">
                {currentContent.songTitle} · {currentContent.section}
              </div>
              <div className="text-xs font-bold line-clamp-3 leading-snug text-slate-100">
                {currentContent.lines.join(' / ')}
              </div>
            </div>
          )}

          {currentContent.type === 'custom' && (
            <div className="bg-slate-900/90 border border-amber-500/60 rounded-lg p-3 text-white">
              <h4 className="text-xs font-bold text-amber-400 uppercase font-cinzel">{currentContent.title}</h4>
              <p className="text-xs text-slate-200 line-clamp-3">{currentContent.content}</p>
            </div>
          )}

        </div>

        {/* Live Stepper Controls */}
        <div className="flex items-center justify-between gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => onNavigateVerse('prev')}
            disabled={currentContent.type !== 'scripture'}
            className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev Verse</span>
          </button>

          <span className="text-[10px] font-mono text-slate-500 px-1">
            Arrow Keys
          </span>

          <button
            onClick={() => onNavigateVerse('next')}
            disabled={currentContent.type !== 'scripture'}
            className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <span>Next Verse</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Smart Chapter Navigator */}
        <div className="space-y-2 flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Chapter Navigator ({activeBook} {activeChapter})
            </span>
            <span className="text-[10px] font-mono text-slate-500">1-Click Jump</span>
          </div>

          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex-1 max-h-[160px] overflow-y-auto">
            <div className="grid grid-cols-7 gap-1.5">
              {verseNumbers.map((vNum) => {
                const isSelected = currentContent.type === 'scripture' && activeVerse === vNum;
                return (
                  <button
                    key={vNum}
                    onClick={() => onJumpToVerse(vNum)}
                    className={`h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold scale-105'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
                    }`}
                  >
                    {vNum}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
