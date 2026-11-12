import React, { useState } from 'react';
import {
  Radio,
  Tv,
  ExternalLink,
  Copy,
  Check,
  Volume2,
  Mic,
  MicOff,
  Zap,
  Sliders,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { BibleTranslation } from '../types/scripture';
import { ALL_TRANSLATIONS } from '../data/bibleDatabase';
import { getPublicAppUrl } from '../utils/urlUtils';

interface StudioTopBarProps {
  isMicActive: boolean;
  onToggleMic: () => void;
  sttStatus: 'connected' | 'listening' | 'idle' | 'error';
  autoPushEnabled: boolean;
  onToggleAutoPush: () => void;
  activeTranslation: BibleTranslation;
  onSelectTranslation: (trans: BibleTranslation) => void;
  onLaunchProjector: () => void;
  onCopyObsUrl: () => void;
  copiedObsUrl: boolean;
  audioLevel: number; // 0 to 100 for VU meter
  currentContextBook?: string | null;
  currentContextChapter?: number | null;
}

export const StudioTopBar: React.FC<StudioTopBarProps> = ({
  isMicActive,
  onToggleMic,
  sttStatus,
  autoPushEnabled,
  onToggleAutoPush,
  activeTranslation,
  onSelectTranslation,
  onLaunchProjector,
  onCopyObsUrl,
  copiedObsUrl,
  audioLevel,
  currentContextBook,
  currentContextChapter
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 text-slate-100 select-none shadow-lg">
      <div className="max-w-full px-4 h-14 flex items-center justify-between gap-3">
        
        {/* Left Zone: Brand Wordmark + Live Mic Status + VU Meter */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-cinzel text-lg flex items-center justify-center font-bold">
              ✞
            </span>
            <div className="leading-none">
              <span className="font-extrabold tracking-tight text-white font-cinzel text-sm sm:text-base">
                SCRIPTURE<span className="text-amber-400">PULSE</span>
              </span>
              <span className="block text-[9px] font-mono uppercase text-slate-400 tracking-wider">
                LIVE STUDIO PRO
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>

          {/* Mic Toggle Button + Live VU Meter */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl">
            <button
              onClick={onToggleMic}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isMicActive
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title={isMicActive ? "Mute Microphone" : "Unmute Live Microphone"}
            >
              {isMicActive ? <Mic className="w-3.5 h-3.5 animate-pulse" /> : <MicOff className="w-3.5 h-3.5" />}
              <span className="text-[11px] font-bold">{isMicActive ? "LIVE" : "MIC OFF"}</span>
            </button>

            {/* Audio VU Meter Bars */}
            <div className="flex items-end gap-0.5 h-4 w-12 px-1">
              {[0.15, 0.35, 0.55, 0.75, 0.95].map((thresh, idx) => {
                const active = isMicActive && (audioLevel / 100) >= thresh;
                const barColor = idx > 3 ? 'bg-red-500' : idx > 2 ? 'bg-amber-400' : 'bg-emerald-500';
                return (
                  <div
                    key={idx}
                    className={`w-1.5 rounded-sm transition-all duration-75 ${
                      active ? `${barColor} h-full` : 'bg-slate-800 h-1.5'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* STT Status Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-mono">
            <span className={`w-2 h-2 rounded-full ${
              sttStatus === 'listening' ? 'bg-emerald-400 animate-pulse' :
              sttStatus === 'connected' ? 'bg-emerald-500' : 'bg-slate-600'
            }`} />
            <span className="text-slate-300 capitalize">{sttStatus}</span>
          </div>
        </div>

        {/* Center Zone: Auto-Push Switch & Context-Carry Indicator */}
        <div className="flex items-center gap-3">
          
          {/* Auto-Push vs Manual Approval Switch */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl">
            <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">Auto-Push</span>
            <button
              onClick={onToggleAutoPush}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoPushEnabled ? 'bg-amber-500' : 'bg-slate-800'
              }`}
              title="Toggle Auto-Push (Instantly broadcasts high-confidence detected verses)"
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                  autoPushEnabled ? 'translate-x-4' : 'translate-x-0 bg-slate-400'
                }`}
              />
            </button>
            <span className={`text-[10px] font-mono font-bold uppercase ${autoPushEnabled ? 'text-amber-400' : 'text-slate-400'}`}>
              {autoPushEnabled ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* Context Carry Badge */}
          {currentContextBook && (
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-mono text-amber-300">
              <Layers className="w-3 h-3 text-amber-400" />
              <span>Context: {currentContextBook} {currentContextChapter || ''}</span>
            </div>
          )}

          {/* Active Translation Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-0.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase hidden sm:inline">Biblical Version:</span>
            <select
              value={activeTranslation}
              onChange={(e) => onSelectTranslation(e.target.value as BibleTranslation)}
              className="bg-transparent text-amber-400 font-bold text-xs py-1 px-1 focus:outline-none cursor-pointer"
            >
              {ALL_TRANSLATIONS.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.shortName} - {t.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Right Zone: Secondary Windows & OBS/vMix Copy URL */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Launch Projector Window */}
          <button
            onClick={onLaunchProjector}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Open Borderless Audience Projector Display in Secondary Window"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Audience Window</span>
          </button>

          {/* Copy OBS / vMix Lower-Third URL */}
          <button
            onClick={onCopyObsUrl}
            className="px-3 py-1.5 bg-purple-600/90 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Copy Public Transparent OBS Studio / vMix / EasyWorship Browser Source URL"
          >
            {copiedObsUrl ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copiedObsUrl ? "Copied!" : "OBS / vMix URL"}</span>
          </button>

        </div>

      </div>
    </header>
  );
};
