import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ActiveContextBanner } from './components/ActiveContextBanner';
import { LiveSpeechInput } from './components/LiveSpeechInput';
import { VerseDetectionCard } from './components/VerseDetectionCard';
import { LowerThirdDisplay } from './components/LowerThirdDisplay';
import { JsonOutputConsole } from './components/JsonOutputConsole';
import { ParseLogHistory } from './components/ParseLogHistory';
import { DetectionResponse, ActiveContext, ParseLogEntry, BiblePassageText } from './types/scripture';
import { getBiblePassageText } from './data/bibleDatabase';
import { Radio, Monitor, Code, Sparkles, BookOpen, Layers, Volume2 } from 'lucide-react';

import { SoftwareIntegrationsHub } from './components/SoftwareIntegrationsHub';
import { parseScriptureLocally } from './services/localRegexParser';

import { ObsStandaloneOverlay } from './components/ObsStandaloneOverlay';

export default function App() {
  const [activeTab, setActiveTab] = useState<'parser' | 'projection' | 'integrations' | 'api'>('parser');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [currentContext, setCurrentContext] = useState<ActiveContext>({ book: null, chapter: null });
  const [latestDetection, setLatestDetection] = useState<DetectionResponse | null>(null);
  const [passageForProjection, setPassageForProjection] = useState<BiblePassageText | null>(null);
  const [logs, setLogs] = useState<ParseLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastLatencyMs, setLastLatencyMs] = useState<number>(18);
  const [lastSpokenText, setLastSpokenText] = useState<string>('');

  // Detect OBS Browser Source Overlay URL mode
  const isObsOverlay = typeof window !== 'undefined' && 
    (new URLSearchParams(window.location.search).get('displayMode') === 'obs-transparent' || 
     new URLSearchParams(window.location.search).get('displayMode') === 'overlay');

  // Sync dark mode class on <html> element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (isObsOverlay) {
    return <ObsStandaloneOverlay />;
  }

  // Helper to sync detected passage across localStorage, window events, and Express server feed
  const broadcastVerseFeed = (data: DetectionResponse, text: string) => {
    if (!data.detected) return;

    const passage = getBiblePassageText(data.book, data.chapter, data.verse_start, data.verse_end);
    setPassageForProjection(passage);

    const feedPayload = {
      detected: true,
      book: data.book,
      chapter: data.chapter,
      verse_start: data.verse_start,
      verse_end: data.verse_end,
      reference: passage.reference,
      translation: passage.translation,
      text: passage.fullText,
      raw_spoken_phrase: data.raw_spoken_phrase || text,
      timestamp: new Date().toISOString()
    };

    // 1. Instant local window event for same-page overlay components (0ms)
    window.dispatchEvent(new CustomEvent('scripture-updated', { detail: feedPayload }));

    // 2. Instant localStorage event for cross-tab OBS/EasyWorship overlays (< 1ms)
    try {
      localStorage.setItem('active_verse_feed', JSON.stringify(feedPayload));
    } catch (e) {}

    // 3. Post to backend server feed for external OBS / EasyWorship / vMix pollers
    fetch('/api/easyworship-feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedPayload)
    }).catch(() => {});

    return passage;
  };

  // Main API Parsing Handler with Zero-Latency Instant Local Parsing
  const handleParseText = async (
    text: string,
    source: 'live_mic' | 'typed' | 'preset' | 'audio_upload' = 'typed'
  ) => {
    if (!text.trim()) return;

    setLastSpokenText(text);
    const startTime = Date.now();

    // STEP 1: Synchronous Zero-Latency Local Deterministic Detection (< 2ms)
    const localResult = parseScriptureLocally(text, currentContext.book ? currentContext : undefined);
    const localLatency = Date.now() - startTime;

    if (localResult.detected) {
      setLastLatencyMs(localLatency);
      setLatestDetection(localResult);

      let resolvedFromContext = false;
      if (currentContext.book && currentContext.chapter && localResult.book === currentContext.book && localResult.chapter === currentContext.chapter && !text.toLowerCase().includes(currentContext.book.toLowerCase())) {
        resolvedFromContext = true;
      }

      setCurrentContext({
        book: localResult.book,
        chapter: localResult.chapter,
        lastUpdated: Date.now()
      });

      broadcastVerseFeed(localResult, text);

      const newEntry: ParseLogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        input_text: text,
        response: localResult,
        latency_ms: localLatency,
        resolved_from_context: resolvedFromContext,
        source
      };
      setLogs(prev => [newEntry, ...prev]);
    }

    // STEP 2: Asynchronous Gemini API Call (Background confirmation/refinement)
    setIsLoading(true);
    try {
      const response = await fetch('/api/parse-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          current_context: currentContext.book ? currentContext : undefined
        })
      });

      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const serverData: DetectionResponse = await response.json();
        const serverLatency = Date.now() - startTime;

        if (serverData.detected) {
          setLastLatencyMs(serverLatency);
          setLatestDetection(serverData);

          let resolvedFromContext = false;
          if (currentContext.book && currentContext.chapter && serverData.book === currentContext.book && serverData.chapter === currentContext.chapter && !text.toLowerCase().includes(currentContext.book.toLowerCase())) {
            resolvedFromContext = true;
          }

          setCurrentContext({
            book: serverData.book,
            chapter: serverData.chapter,
            lastUpdated: Date.now()
          });

          broadcastVerseFeed(serverData, text);

          // Update log entry if not already added by local parser
          if (!localResult.detected) {
            const newEntry: ParseLogEntry = {
              id: Math.random().toString(36).substring(2, 9),
              timestamp: new Date().toLocaleTimeString(),
              input_text: text,
              response: serverData,
              latency_ms: serverLatency,
              resolved_from_context: resolvedFromContext,
              source
            };
            setLogs(prev => [newEntry, ...prev]);
          }
        } else if (!localResult.detected) {
          setLatestDetection({ detected: false });
        }
      }
    } catch (err) {
      console.warn('Background Gemini API check skipped/failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearContext = () => {
    setCurrentContext({ book: null, chapter: null });
  };

  const handleSetContext = (book: string, chapter: number) => {
    setCurrentContext({ book, chapter, lastUpdated: Date.now() });
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleSelectLog = (log: ParseLogEntry) => {
    setLatestDetection(log.response);
    setLastSpokenText(log.input_text);
    if (log.response.detected) {
      const passage = getBiblePassageText(
        log.response.book,
        log.response.chapter,
        log.response.verse_start,
        log.response.verse_end
      );
      setPassageForProjection(passage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col">
      
      {/* Top Bar Contract Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenProjectionOverlay={() => setActiveTab('projection')}
        hasActiveContext={Boolean(currentContext.book)}
        currentBook={currentContext.book}
        currentChapter={currentContext.chapter}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Relative Reference Resolution Context Banner */}
        <ActiveContextBanner
          context={currentContext}
          onClearContext={handleClearContext}
          onSetContext={handleSetContext}
        />

        {/* Tab 1: Parser Console (Default Minimalist View) */}
        {activeTab === 'parser' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Live Audio Speech Listener */}
              <div className="lg:col-span-5 space-y-6">
                <LiveSpeechInput
                  onParseText={handleParseText}
                  isLoading={isLoading}
                />
              </div>

              {/* Right Column: Prominent Scripture Detection View */}
              <div className="lg:col-span-7 space-y-6">
                <VerseDetectionCard
                  detection={latestDetection}
                  onSendToProjection={(passage) => {
                    setPassageForProjection(passage);
                    setActiveTab('projection');
                  }}
                />
              </div>

            </div>

            {/* Collapsible Inspection Drawer for Logs & JSON Terminal */}
            <details className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
              <summary className="p-4 flex items-center justify-between cursor-pointer font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors select-none">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Developer Inspection & Transcript Log ({logs.length})</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono group-open:rotate-180 transition-transform">
                  ▼ Click to Expand
                </span>
              </summary>

              <div className="p-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ParseLogHistory
                  logs={logs}
                  onClearLogs={handleClearLogs}
                  onSelectLog={handleSelectLog}
                />
                <JsonOutputConsole
                  detection={latestDetection}
                  lastSpokenPhrase={lastSpokenText}
                  latencyMs={lastLatencyMs}
                />
              </div>
            </details>
          </div>
        )}



        {/* Tab 3: Projection Broadcast System */}
        {activeTab === 'projection' && (
          <div className="space-y-6">
            <LowerThirdDisplay
              passage={passageForProjection}
              onClearDisplay={() => setPassageForProjection(null)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VerseDetectionCard
                detection={latestDetection}
                onSendToProjection={(passage) => setPassageForProjection(passage)}
              />
              <JsonOutputConsole
                detection={latestDetection}
                lastSpokenPhrase={lastSpokenText}
                latencyMs={lastLatencyMs}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Church Software Integrations (EasyWorship, OBS, vMix) */}
        {activeTab === 'integrations' && (
          <SoftwareIntegrationsHub currentPassage={passageForProjection} />
        )}

        {/* Tab 4: JSON & API Specifications */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <JsonOutputConsole
              detection={latestDetection}
              lastSpokenPhrase={lastSpokenText}
              latencyMs={lastLatencyMs}
            />

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                API Output Rules & Schema Specifications
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span><strong>Output format:</strong> Returns strictly valid raw JSON without markdown formatting, code blocks, or commentary.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span><strong>Detected verse schema:</strong> Includes <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">detected: true</code>, <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">book</code>, <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">chapter</code>, <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">verse_start</code>, <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">verse_end</code>, <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">confidence</code>, and <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">raw_spoken_phrase</code>.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span><strong>No verse detected schema:</strong> Returns strictly <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">{"{ \"detected\": false }"}</code>.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 transition-colors mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 dark:text-slate-400">
          ScripturePulse Church Projection System & Speech Parser · Powered by Gemini AI
        </div>
      </footer>

    </div>
  );
}
