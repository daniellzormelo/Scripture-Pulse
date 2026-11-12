import React, { useState } from 'react';
import { Tv, Copy, Check, Video, Monitor, Database, ShieldCheck } from 'lucide-react';
import { BiblePassageText } from '../types/scripture';
import { getPublicAppUrl } from '../utils/urlUtils';

interface VmixIntegrationProps {
  currentPassage: BiblePassageText | null;
}

export const VmixIntegration: React.FC<VmixIntegrationProps> = ({ currentPassage }) => {
  const [copiedBrowserUrl, setCopiedBrowserUrl] = useState(false);
  const [copiedDataSourceUrl, setCopiedDataSourceUrl] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'gold-sacred' | 'minimal-dark' | 'glass-broadcast' | 'high-contrast'>('gold-sacred');

  const publicBaseUrl = getPublicAppUrl();
  const vmixWebUrl = `${publicBaseUrl}?displayMode=obs-transparent&theme=${selectedTheme}`;
  const vmixDataSourceUrl = `${publicBaseUrl}/api/parse-speech`;

  const handleCopyBrowserUrl = () => {
    navigator.clipboard.writeText(vmixWebUrl);
    setCopiedBrowserUrl(true);
    setTimeout(() => setCopiedBrowserUrl(false), 2000);
  };

  const handleCopyDataSourceUrl = () => {
    navigator.clipboard.writeText(vmixDataSourceUrl);
    setCopiedDataSourceUrl(true);
    setTimeout(() => setCopiedDataSourceUrl(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center justify-center font-bold text-lg">
            vMix
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>vMix Live Production Integration</span>
              <span className="px-2 py-0.5 text-[11px] font-mono text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 rounded border border-sky-200 dark:border-sky-800">
                vMix Ready
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Integrate real-time AI Bible detection directly into vMix Web Browser inputs, vMix Data Sources, and XAML Title overlays.
            </p>
          </div>
        </div>
      </div>

      {/* Public URL Notice */}
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span><strong>Public vMix Overlay Active:</strong> This link is publicly accessible so vMix will load the transparent lower-third display directly without prompting for Google Login.</span>
      </div>

      {/* Method 1: vMix Web Browser Input */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Monitor className="w-4 h-4 text-sky-500" />
          <span>Method 1: vMix Web Browser Input (Public Link)</span>
        </h3>

        <ol className="list-decimal list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1.5 font-medium pl-1">
          <li>In vMix, click <strong>Add Input</strong> at the bottom left.</li>
          <li>Select <strong>Web Browser</strong> from the category list.</li>
          <li>Paste the copied Public Overlay URL:</li>
        </ol>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-300 dark:border-slate-800">
          <code className="text-xs font-mono text-sky-700 dark:text-sky-300 flex-1 truncate">
            {vmixWebUrl}
          </code>
          <button
            onClick={handleCopyBrowserUrl}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 shrink-0"
          >
            {copiedBrowserUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedBrowserUrl ? 'Copied' : 'Copy Public vMix URL'}</span>
          </button>
        </div>

        <ol start={4} className="list-decimal list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1.5 font-medium pl-1">
          <li>Set Width: <strong>1920</strong> and Height: <strong>1080</strong>.</li>
          <li>Check <strong>"Alpha Channel"</strong> (Transparent) in vMix Web Browser settings.</li>
          <li>Assign the Web Browser input as an <strong>Overlay channel (1, 2, 3, or 4)</strong>.</li>
        </ol>
      </div>

      {/* Method 2: vMix Data Sources & XAML Title Designer */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-sky-500" />
          <span>Method 2: vMix Data Sources (XAML Lower-Third Titles)</span>
        </h3>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-300 dark:border-slate-800">
          <code className="text-xs font-mono text-sky-700 dark:text-sky-300 flex-1 truncate">
            {vmixDataSourceUrl}
          </code>
          <button
            onClick={handleCopyDataSourceUrl}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 shrink-0"
          >
            {copiedDataSourceUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedDataSourceUrl ? 'Copied' : 'Copy Endpoint'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
