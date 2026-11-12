import React, { useState } from 'react';
import { Tv, Copy, Check, Video, Monitor, Radio, ShieldCheck } from 'lucide-react';
import { BiblePassageText } from '../types/scripture';
import { getPublicAppUrl } from '../utils/urlUtils';

interface ObsNdiIntegrationProps {
  currentPassage: BiblePassageText | null;
}

export const ObsNdiIntegration: React.FC<ObsNdiIntegrationProps> = ({ currentPassage }) => {
  const [copiedBrowserUrl, setCopiedBrowserUrl] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'gold-sacred' | 'minimal-dark' | 'glass-broadcast' | 'high-contrast'>('gold-sacred');
  const [selectedChroma, setSelectedChroma] = useState<'transparent' | 'green' | 'blue'>('transparent');

  const publicBaseUrl = getPublicAppUrl();
  const obsBrowserUrl = `${publicBaseUrl}?displayMode=obs-transparent&theme=${selectedTheme}&bg=${selectedChroma}`;

  const handleCopyBrowserUrl = () => {
    navigator.clipboard.writeText(obsBrowserUrl);
    setCopiedBrowserUrl(true);
    setTimeout(() => setCopiedBrowserUrl(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-lg">
            OBS
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>OBS Studio & NDI Network Integration</span>
              <span className="px-2 py-0.5 text-[11px] font-mono text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 rounded border border-purple-200 dark:border-purple-800">
                NDI Ready
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Broadcast transparent lower-third Bible scripture overlays directly in OBS Studio, vMix, and NDI streams.
            </p>
          </div>
        </div>
      </div>

      {/* Public URL Notice */}
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span><strong>Public OBS Overlay Active:</strong> This link is publicly accessible so OBS Studio will load the transparent lower-third display directly without prompting for Google Login.</span>
      </div>

      {/* OBS Overlay Customizer */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Video className="w-4 h-4 text-purple-500" />
          <span>OBS Browser Source URL Generator</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Overlay Theme:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'gold-sacred', label: 'Gold Sacred' },
                { id: 'minimal-dark', label: 'Minimal Dark' },
                { id: 'glass-broadcast', label: 'Glassmorphism' },
                { id: 'high-contrast', label: 'High Contrast' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id as any)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border text-left transition-all ${
                    selectedTheme === t.id
                      ? 'bg-purple-600 text-white border-purple-500 font-semibold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Background Mode:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'transparent', label: 'Alpha (Transparent)' },
                { id: 'green', label: 'Chroma Green' },
                { id: 'blue', label: 'Chroma Blue' }
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedChroma(b.id as any)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border text-center transition-all ${
                    selectedChroma === b.id
                      ? 'bg-purple-600 text-white border-purple-500 font-semibold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generated OBS Browser Source URL Box */}
        <div className="space-y-1.5 pt-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            OBS Browser Source URL (Public No-Login Link):
          </span>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-300 dark:border-slate-800">
            <code className="text-xs font-mono text-purple-700 dark:text-purple-300 flex-1 truncate">
              {obsBrowserUrl}
            </code>
            <button
              onClick={handleCopyBrowserUrl}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 shrink-0"
            >
              {copiedBrowserUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBrowserUrl ? 'Copied' : 'Copy Public OBS URL'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* STEP BY STEP OBS & NDI SETUP INSTRUCTIONS */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Radio className="w-4 h-4 text-purple-500" />
          <span>How to Add to OBS Studio & Output as NDI</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Column 1: OBS Browser Source */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-purple-700 dark:text-purple-300">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs">1</span>
              <span>Add Browser Source in OBS</span>
            </div>
            <ol className="list-decimal list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1.5 pl-1">
              <li>In OBS Studio, go to your <strong>Sources</strong> panel.</li>
              <li>Click <strong>+</strong> $\rightarrow$ Select <strong>Browser</strong>.</li>
              <li>Name it <em>"ScripturePulse Overlay"</em>.</li>
              <li>Set <strong>Width: 1920</strong> and <strong>Height: 1080</strong>.</li>
              <li>Paste the copied Public OBS URL above into the <em>URL</em> field.</li>
              <li>Click <strong>OK</strong>. Your live lower-third will float over your pastor camera video without any Google login prompt!</li>
            </ol>
          </div>

          {/* Column 2: Output as NDI */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-purple-700 dark:text-purple-300">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs">2</span>
              <span>Broadcast Scene as NDI Stream</span>
            </div>
            <ol className="list-decimal list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1.5 pl-1">
              <li>Install the free <strong>obs-ndi plugin</strong> (or NDI Tools).</li>
              <li>In OBS top menu, click <strong>Tools $\rightarrow$ NDI Output Settings</strong>.</li>
              <li>Check <strong>Enable Main Output</strong> (or Dedicated Source NDI Output).</li>
              <li>Give your NDI stream a name like <em>"OBS Scripture Stream"</em>.</li>
              <li>Now EasyWorship, vMix, ProPresenter, or secondary PCs on your network can receive this live transparent NDI stream instantly!</li>
            </ol>
          </div>

        </div>
      </div>

    </div>
  );
};
