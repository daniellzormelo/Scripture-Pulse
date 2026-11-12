import React, { useState } from 'react';
import { Layers, Copy, Check, Tv, FileText, Settings, Rss, Radio, ShieldCheck } from 'lucide-react';
import { BiblePassageText } from '../types/scripture';
import { getPublicAppUrl } from '../utils/urlUtils';

interface EasyWorshipIntegrationProps {
  currentPassage: BiblePassageText | null;
}

export const EasyWorshipIntegration: React.FC<EasyWorshipIntegrationProps> = ({ currentPassage }) => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'feed' | 'web' | 'script'>('feed');

  const publicBaseUrl = getPublicAppUrl();

  const feedUrls = [
    {
      id: 'json',
      name: 'EasyWorship JSON Live Feed',
      url: `${publicBaseUrl}/api/easyworship-feed`,
      desc: 'Live JSON payload auto-updated whenever pastor speaks a scripture verse.'
    },
    {
      id: 'xml',
      name: 'EasyWorship RSS / XML Feed',
      url: `${publicBaseUrl}/feed.xml`,
      desc: 'Standard RSS/XML feed compatible with EasyWorship Media Feeds.'
    },
    {
      id: 'txt',
      name: 'EasyWorship Raw Text Stream',
      url: `${publicBaseUrl}/feed.txt`,
      desc: 'Plain text formatted passage output (Reference + Passage text).'
    },
    {
      id: 'web',
      name: 'EasyWorship Web Overlay Feed',
      url: `${publicBaseUrl}?displayMode=obs-transparent&theme=gold-sacred`,
      desc: 'Transparent lower-third HTML display overlay for EasyWorship Web Page items.'
    }
  ];

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const pythonWatcherScript = `# EasyWorship Real-time Scripture Hot-Folder Sync Script
import requests
import time

SCRIPTURE_FEED_URL = "${publicBaseUrl}/api/easyworship-feed"
OUTPUT_FILE = "C:\\\\EasyWorship\\\\LiveVerses\\\\current_verse.txt"

def poll_feed():
    try:
        response = requests.get(SCRIPTURE_FEED_URL)
        data = response.json()
        if data.get("detected"):
            ref = data.get("reference")
            text = data.get("text")
            print(f"[EasyWorship Feed] Live Verse: {ref}")
            with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                f.write(f"{ref}\\n{text}")
    except Exception as e:
        print("Error connecting to feed:", e)

if __name__ == "__main__":
    print("Listening to ScripturePulse EasyWorship Live Feed...")
    poll_feed()
`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-lg">
            EW
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>EasyWorship Live Feed Integration</span>
              <span className="px-2 py-0.5 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 rounded border border-emerald-200 dark:border-emerald-800">
                Live Feed Stream Active
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Integrate ScripturePulse as a live audio-driven scripture feed directly in EasyWorship 7, EasyWorship 6, or EasyWorship 2009.
            </p>
          </div>
        </div>
      </div>

      {/* Public URL Notice */}
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span><strong>Public EasyWorship Links Active:</strong> These URLs are publicly accessible so EasyWorship will load the live feeds directly without prompting for Google Login.</span>
      </div>

      {/* Integration Options Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setSelectedMethod('feed')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
            selectedMethod === 'feed'
              ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Live Feed URLs (JSON / RSS / Text)</span>
        </button>

        <button
          onClick={() => setSelectedMethod('web')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
            selectedMethod === 'web'
              ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>Web Page Feed Overlay</span>
        </button>

        <button
          onClick={() => setSelectedMethod('script')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
            selectedMethod === 'script'
              ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Hot-Folder Feed Script</span>
        </button>
      </div>

      {/* METHOD 1: LIVE FEED URLS */}
      {selectedMethod === 'feed' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Rss className="w-4 h-4 text-amber-500" />
              <span>EasyWorship Live Feed URLs (No-Login Public Links)</span>
            </h3>

            <div className="space-y-3">
              {feedUrls.map((item) => (
                <div key={item.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</span>
                    <span className="text-[11px] text-slate-500">{item.desc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded flex-1 truncate">
                      {item.url}
                    </code>
                    <button
                      onClick={() => handleCopy(item.url, item.id)}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white dark:bg-amber-500 dark:text-slate-950 text-xs font-semibold rounded transition-colors flex items-center gap-1 shrink-0"
                    >
                      {copiedIndex === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === item.id ? 'Copied' : 'Copy Feed URL'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* METHOD 2: WEB OVERLAY FEED IN EASYWORSHIP */}
      {selectedMethod === 'web' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Tv className="w-4 h-4 text-emerald-500" />
              <span>How to Add Live Feed Overlay in EasyWorship</span>
            </h3>

            <ol className="list-decimal list-inside text-xs text-slate-700 dark:text-slate-300 space-y-2 font-medium">
              <li>Open <strong>EasyWorship</strong>.</li>
              <li>Go to <strong>Web Tab</strong> (or <em>Media $\rightarrow$ Web Pages</em>).</li>
              <li>Click <strong>+ Add Web Page</strong>.</li>
              <li>Paste Public Feed URL: <code className="font-mono text-amber-600 dark:text-amber-400 bg-slate-200 dark:bg-slate-800 px-1 rounded">{publicBaseUrl}?displayMode=obs-transparent&theme=gold-sacred</code></li>
              <li>Drag the web feed into your <strong>Live Presentation Schedule</strong>.</li>
            </ol>
          </div>
        </div>
      )}

      {/* METHOD 3: HOT FOLDER SCRIPT */}
      {selectedMethod === 'script' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>Automated EasyWorship Text Feed Sync</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Run this script on your EasyWorship presentation computer to sync live audio scripture into <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">current_verse.txt</code> automatically:
            </p>

            <div className="relative bg-slate-900 border border-slate-800 rounded-lg p-3 font-jetbrains text-xs text-amber-300 overflow-x-auto">
              <button
                onClick={() => handleCopy(pythonWatcherScript, 'script')}
                className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-sans flex items-center gap-1"
              >
                {copiedIndex === 'script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 'script' ? 'Copied' : 'Copy Script'}</span>
              </button>
              <pre>{pythonWatcherScript}</pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
