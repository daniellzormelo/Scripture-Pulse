import React, { useState } from 'react';
import { EasyWorshipIntegration } from './EasyWorshipIntegration';
import { ObsNdiIntegration } from './ObsNdiIntegration';
import { VmixIntegration } from './VmixIntegration';
import { BiblePassageText } from '../types/scripture';
import { Video, Monitor, Radio, Send, Check } from 'lucide-react';

interface SoftwareIntegrationsHubProps {
  currentPassage: BiblePassageText | null;
}

export const SoftwareIntegrationsHub: React.FC<SoftwareIntegrationsHubProps> = ({ currentPassage }) => {
  const [subTab, setSubTab] = useState<'easyworship' | 'obs-ndi' | 'vmix'>('easyworship');
  const [signalSent, setSignalSent] = useState(false);

  const handleSendTestSignal = async () => {
    try {
      await fetch('/api/parse-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Turn with me to John chapter 3 verse 16' })
      });

      localStorage.setItem('active_verse_feed', JSON.stringify({
        detected: true,
        book: 'John',
        chapter: 3,
        verse_start: 16,
        verse_end: 16,
        reference: 'John 3:16',
        translation: 'NIV',
        text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
        raw_spoken_phrase: 'John chapter 3 verse 16',
        timestamp: new Date().toISOString()
      }));

      setSignalSent(true);
      setTimeout(() => setSignalSent(false), 2500);
    } catch (e) {
      console.warn('Signal send error:', e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-navigation bar for software platforms */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2 uppercase tracking-wide">
            Select Software:
          </span>
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
            <button
              onClick={() => setSubTab('easyworship')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                subTab === 'easyworship'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-4 h-4 rounded bg-slate-950/20 text-slate-950 font-bold text-[10px] flex items-center justify-center">EW</span>
              <span>EasyWorship</span>
            </button>

            <button
              onClick={() => setSubTab('obs-ndi')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                subTab === 'obs-ndi'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>OBS Studio & NDI</span>
            </button>

            <button
              onClick={() => setSubTab('vmix')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                subTab === 'vmix'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>vMix Live</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleSendTestSignal}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
        >
          {signalSent ? <Check className="w-3.5 h-3.5 text-white" /> : <Send className="w-3.5 h-3.5" />}
          <span>{signalSent ? 'Test Signal Sent!' : 'Send Test Signal to Displays'}</span>
        </button>
      </div>

      {/* Render selected software panel */}
      {subTab === 'easyworship' && <EasyWorshipIntegration currentPassage={currentPassage} />}
      {subTab === 'obs-ndi' && <ObsNdiIntegration currentPassage={currentPassage} />}
      {subTab === 'vmix' && <VmixIntegration currentPassage={currentPassage} />}

    </div>
  );
};
