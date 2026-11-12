import React from 'react';
import { Radio, Monitor, Tv, Code, Moon, Sun, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: 'parser' | 'projection' | 'integrations' | 'api';
  setActiveTab: (tab: 'parser' | 'projection' | 'integrations' | 'api') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenProjectionOverlay: () => void;
  hasActiveContext: boolean;
  currentBook: string | null;
  currentChapter: number | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onOpenProjectionOverlay,
  hasActiveContext,
  currentBook,
  currentChapter
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <a href="#" className="flex items-center gap-1.5 text-base font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
            <span className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-cinzel text-base">
              ✞
            </span>
            <span>Scripture<span className="text-amber-600 dark:text-amber-400">Pulse</span></span>
          </a>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 rounded-full border border-emerald-200 dark:border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live
          </span>
        </div>

        {/* Zone 2: Minimized 4 short-text navigation buttons */}
        <nav className="hidden md:flex items-center gap-1 font-medium text-xs text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('parser')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'parser'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-500" />
            <span>Parser</span>
          </button>

          <button
            onClick={() => setActiveTab('projection')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'projection'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-emerald-500" />
            <span>Projection</span>
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'integrations'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-indigo-500" />
            <span>Software</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'api'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-sky-500" />
            <span>API</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action + Light/Dark toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {hasActiveContext && currentBook && currentChapter && (
            <div className="hidden lg:flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded border border-amber-500/20 text-[11px] font-mono">
              <Layers className="w-3 h-3" />
              <span>{currentBook} {currentChapter}</span>
            </div>
          )}

          <button
            onClick={onOpenProjectionOverlay}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-amber-600 rounded-md hover:bg-slate-800 dark:hover:bg-amber-500 transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Display</span>
          </button>

          <button
            onClick={() => setIsDarkMode(prev => !prev)}
            aria-label="Toggle dark mode"
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors shrink-0"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>
    </header>
  );
};
