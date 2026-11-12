import React, { useState, useEffect, useRef } from 'react';
import {
  BiblePassageText,
  BibleTranslation,
  DetectionQueueItem,
  LiveOutputContent,
  TranscriptSnippet,
  CustomSlide
} from './types/scripture';
import { liveSync } from './services/liveSyncService';
import { parsePreacherVoiceCommand, stepPassageVerse } from './services/voiceCommandService';
import { runThreeEnginePipeline } from './services/threeEnginePipeline';
import { getBiblePassageText, ALL_TRANSLATIONS } from './data/bibleDatabase';
import { getPublicAppUrl } from './utils/urlUtils';

import { StudioTopBar } from './components/StudioTopBar';
import { SermonTranscriptColumn } from './components/SermonTranscriptColumn';
import { DetectionQueueColumn } from './components/DetectionQueueColumn';
import { QuickSearchPinnedColumn } from './components/QuickSearchPinnedColumn';
import { LivePreviewColumn } from './components/LivePreviewColumn';
import { ProjectorOutput } from './components/ProjectorOutput';
import { LowerThirdOverlay } from './components/LowerThirdOverlay';
import { WorshipStudio } from './components/WorshipStudio';
import { SoftwareIntegrationsHub } from './components/SoftwareIntegrationsHub';

import { Radio, Music, Tv, BookOpen } from 'lucide-react';

export default function App() {
  // 1. Dual-Window URL Query Routing (?view=projector or ?view=lower-third or ?displayMode=obs-transparent)
  const isProjectorView = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('view') === 'projector';
  const isLowerThirdView = typeof window !== 'undefined' && (
    new URLSearchParams(window.location.search).get('view') === 'lower-third' ||
    new URLSearchParams(window.location.search).get('displayMode') === 'obs-transparent' ||
    new URLSearchParams(window.location.search).get('displayMode') === 'overlay'
  );

  if (isProjectorView) {
    return <ProjectorOutput />;
  }

  if (isLowerThirdView) {
    return <LowerThirdOverlay />;
  }

  // 2. Main Operator Studio State
  const [activeTab, setActiveTab] = useState<'scripture' | 'worship' | 'software'>('scripture');
  const [isMicActive, setIsMicActive] = useState<boolean>(true);
  const [sttStatus, setSttStatus] = useState<'connected' | 'listening' | 'idle' | 'error'>('listening');
  const [audioLevel, setAudioLevel] = useState<number>(35);
  const [autoPushEnabled, setAutoPushEnabled] = useState<boolean>(false);
  const [activeTranslation, setActiveTranslation] = useState<BibleTranslation>('NIV');

  // Active Context & Live Broadcast
  const [currentContext, setCurrentContext] = useState<{ book: string | null; chapter: number | null }>({ book: 'John', chapter: 3 });
  const [liveOutput, setLiveOutput] = useState<LiveOutputContent>(liveSync.getInitialContent());

  // Queues & Transcripts
  const [transcriptSnippets, setTranscriptSnippets] = useState<TranscriptSnippet[]>([
    { id: 'ts-1', text: 'Welcome church, turn with me to John chapter 3 verse 16.', timestamp: '10:02 AM', isFinal: true, detectedRef: 'John 3:16' }
  ]);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [queueItems, setQueueItems] = useState<DetectionQueueItem[]>([
    {
      id: 'q-1',
      timestamp: '10:02 AM',
      reference: 'John 3:16',
      book: 'John',
      chapter: 3,
      verse_start: 16,
      verse_end: 16,
      confidence: 0.98,
      raw_spoken_phrase: 'John chapter 3 verse 16',
      engine: 'regex',
      passage: getBiblePassageText('John', 3, 16, 16, 'NIV'),
      tier: 'high-confidence',
      isPinned: true
    }
  ]);
  const [pinnedPassages, setPinnedPassages] = useState<BiblePassageText[]>([
    getBiblePassageText('John', 3, 16, 16, 'NIV')
  ]);

  const [copiedObsUrl, setCopiedObsUrl] = useState(false);

  // Web Speech API refs
  const recognitionRef = useRef<any>(null);
  const lastParsedTextRef = useRef<string>('');

  // Synchronize Live Output with BroadcastChannel & Server
  const handlePushLiveContent = (content: LiveOutputContent) => {
    setLiveOutput(content);
    liveSync.publish(content);

    if (content.type === 'scripture') {
      setCurrentContext({
        book: content.passage.book,
        chapter: content.passage.chapter
      });
    }
  };

  const handlePushLivePassage = (passage: BiblePassageText) => {
    handlePushLiveContent({ type: 'scripture', passage });
  };

  // Keyboard Navigation Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (liveOutput.type === 'scripture') {
          const next = stepPassageVerse(liveOutput.passage, 'next', activeTranslation);
          handlePushLivePassage(next);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (liveOutput.type === 'scripture') {
          const prev = stepPassageVerse(liveOutput.passage, 'prev', activeTranslation);
          handlePushLivePassage(prev);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handlePushLiveContent({ type: 'hold' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [liveOutput, activeTranslation]);

  // Three-Engine Detection and Voice Command Evaluation
  const processSpokenSpeech = async (spokenText: string) => {
    if (!spokenText.trim() || spokenText.trim() === lastParsedTextRef.current) return;
    lastParsedTextRef.current = spokenText.trim();

    // 1. Hands-Free Preacher Voice Commands (Active ONLY when a verse is currently live)
    const isVerseLive = liveOutput.type === 'scripture';
    const voiceCmd = parsePreacherVoiceCommand(spokenText, isVerseLive);

    if (voiceCmd.type === 'CLEAR_SCREEN') {
      handlePushLiveContent({ type: 'hold' });
      return;
    } else if (voiceCmd.type === 'NEXT_VERSE' && liveOutput.type === 'scripture') {
      const nextPassage = stepPassageVerse(liveOutput.passage, 'next', activeTranslation);
      handlePushLivePassage(nextPassage);
      return;
    } else if (voiceCmd.type === 'PREV_VERSE' && liveOutput.type === 'scripture') {
      const prevPassage = stepPassageVerse(liveOutput.passage, 'prev', activeTranslation);
      handlePushLivePassage(prevPassage);
      return;
    } else if (voiceCmd.type === 'CHANGE_TRANSLATION' && liveOutput.type === 'scripture') {
      setActiveTranslation(voiceCmd.translation);
      const switched = getBiblePassageText(
        liveOutput.passage.book,
        liveOutput.passage.chapter,
        liveOutput.passage.verse_start,
        liveOutput.passage.verse_end,
        voiceCmd.translation
      );
      handlePushLivePassage(switched);
      return;
    }

    // 2. Run Three-Engine Cascading Scripture Detection Pipeline
    const detection = await runThreeEnginePipeline(
      spokenText,
      currentContext,
      activeTranslation,
      navigator.onLine
    );

    if (detection && detection.detected && detection.passage) {
      const newItem: DetectionQueueItem = {
        id: `queue-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reference: detection.passage.reference,
        book: detection.passage.book,
        chapter: detection.passage.chapter,
        verse_start: detection.passage.verse_start,
        verse_end: detection.passage.verse_end,
        confidence: detection.confidence,
        raw_spoken_phrase: detection.raw_spoken_phrase || spokenText,
        engine: detection.engine,
        passage: detection.passage,
        tier: detection.tier
      };

      // Auto-Push Rule: If Auto-Push is ON and high-confidence, automatically broadcast live
      if (autoPushEnabled && detection.tier === 'high-confidence') {
        handlePushLivePassage(detection.passage);
      }

      setQueueItems(prev => [newItem, ...prev.slice(0, 15)]);

      // Tag detected reference into sermon transcript log
      setTranscriptSnippets(prev => {
        if (prev.length > 0) {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, detectedRef: detection.passage!.reference }];
        }
        return prev;
      });
    }
  };

  // Web Speech API Continuous Audio Listener
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSttStatus('error');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      let finalSentence = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalSentence += text;
          // Add to permanent sermon notes
          setTranscriptSnippets(prev => [
            ...prev,
            {
              id: `ts-${Date.now()}-${Math.random()}`,
              text: text.trim(),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isFinal: true
            }
          ]);
          processSpokenSpeech(text);
        } else {
          currentTranscript += text;
        }
      }

      setInterimTranscript(currentTranscript);
      if (currentTranscript.trim()) {
        // Fast interim parsing for instant sub-500ms voice detection
        processSpokenSpeech(currentTranscript);
        setAudioLevel(Math.min(95, 30 + currentTranscript.length * 2));
      } else {
        setAudioLevel(20);
      }
    };

    recognition.onerror = () => {
      setSttStatus('idle');
    };

    recognition.onend = () => {
      if (isMicActive) {
        try {
          recognition.start();
          setSttStatus('listening');
        } catch (e) {}
      } else {
        setSttStatus('idle');
      }
    };

    recognitionRef.current = recognition;

    if (isMicActive) {
      try {
        recognition.start();
        setSttStatus('listening');
      } catch (e) {}
    }

    // Auto-pulse simulated VU meter
    const vuInterval = setInterval(() => {
      if (isMicActive) {
        setAudioLevel(prev => (prev > 40 ? prev - 8 : 25 + Math.random() * 20));
      }
    }, 180);

    return () => {
      try { recognition.stop(); } catch (e) {}
      clearInterval(vuInterval);
    };
  }, [isMicActive, currentContext, activeTranslation, autoPushEnabled, liveOutput]);

  const handleToggleMic = () => {
    if (isMicActive) {
      try { recognitionRef.current?.stop(); } catch (e) {}
      setIsMicActive(false);
      setSttStatus('idle');
      setAudioLevel(0);
    } else {
      setIsMicActive(true);
      try {
        recognitionRef.current?.start();
        setSttStatus('listening');
      } catch (e) {}
    }
  };

  const handleLaunchProjector = () => {
    window.open(`${window.location.origin}?view=projector`, 'ScripturePulse_Projector', 'width=1280,height=720,menubar=no,toolbar=no');
  };

  const handleCopyObsUrl = () => {
    const publicUrl = getPublicAppUrl();
    const obsUrl = `${publicUrl}?view=lower-third&theme=gold-sacred&bg=transparent`;
    navigator.clipboard.writeText(obsUrl);
    setCopiedObsUrl(true);
    setTimeout(() => setCopiedObsUrl(false), 2500);
  };

  const handleExportStudyNotes = () => {
    let content = `# SERMON STUDY NOTES & SCRIPTURE TRANSCRIPT\nDate: ${new Date().toLocaleDateString()}\n\n`;
    content += `## DETECTED SCRIPTURE REFERENCES\n`;
    queueItems.forEach(q => {
      content += `- **${q.reference} (${q.passage.translation})**: "${q.passage.fullText}"\n`;
    });
    content += `\n## FULL SERMON TRANSCRIPT\n`;
    transcriptSnippets.forEach(t => {
      content += `[${t.timestamp}] ${t.text} ${t.detectedRef ? `[${t.detectedRef}]` : ''}\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sermon_Notes_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      
      {/* 1. Scripture Live Studio Top Status Bar */}
      <StudioTopBar
        isMicActive={isMicActive}
        onToggleMic={handleToggleMic}
        sttStatus={sttStatus}
        autoPushEnabled={autoPushEnabled}
        onToggleAutoPush={() => setAutoPushEnabled(prev => !prev)}
        activeTranslation={activeTranslation}
        onSelectTranslation={(trans) => {
          setActiveTranslation(trans);
          if (liveOutput.type === 'scripture') {
            const switched = getBiblePassageText(
              liveOutput.passage.book,
              liveOutput.passage.chapter,
              liveOutput.passage.verse_start,
              liveOutput.passage.verse_end,
              trans
            );
            handlePushLivePassage(switched);
          }
        }}
        onLaunchProjector={handleLaunchProjector}
        onCopyObsUrl={handleCopyObsUrl}
        copiedObsUrl={copiedObsUrl}
        audioLevel={audioLevel}
        currentContextBook={currentContext.book}
        currentContextChapter={currentContext.chapter}
      />

      {/* Mode Navigation Tabs (Scripture Studio | Worship Lyrics | Software Hub) */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('scripture')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'scripture'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Scripture Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('worship')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'worship'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Worship Lyrics</span>
          </button>

          <button
            onClick={() => setActiveTab('software')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'software'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>OBS / vMix / EW Hub</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-500 hidden md:block">
          Keyboard: <span className="text-slate-300">Arrows (Next/Prev)</span> · <span className="text-slate-300">Esc (Clear)</span>
        </div>
      </div>

      {/* 2. Resizable Multi-Column Operator Studio UI */}
      <main className="flex-1 p-3 overflow-hidden">
        
        {activeTab === 'scripture' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 h-[calc(100vh-105px)]">
            
            {/* Column 1: Live Sermon Transcript with Study Notes Export */}
            <div className="h-full overflow-hidden">
              <SermonTranscriptColumn
                transcriptSnippets={transcriptSnippets}
                interimTranscript={interimTranscript}
                onExportStudyNotes={handleExportStudyNotes}
                onClearTranscript={() => setTranscriptSnippets([])}
              />
            </div>

            {/* Column 2: Two-Tier AI Detection Queue */}
            <div className="h-full overflow-hidden">
              <DetectionQueueColumn
                queueItems={queueItems}
                onPushLive={handlePushLivePassage}
                onDismissItem={(id) => setQueueItems(prev => prev.filter(i => i.id !== id))}
                onTogglePin={(id) => setQueueItems(prev => prev.map(i => i.id === id ? { ...i, isPinned: !i.isPinned } : i))}
                activePassageReference={liveOutput.type === 'scripture' ? liveOutput.passage.reference : undefined}
              />
            </div>

            {/* Column 3: Quick Search, Pinned Rail & Custom Slides */}
            <div className="h-full overflow-hidden">
              <QuickSearchPinnedColumn
                onPushLive={handlePushLivePassage}
                onPushCustomSlide={(slide) => handlePushLiveContent({ type: 'custom', title: slide.title, content: slide.content })}
                pinnedPassages={pinnedPassages}
                onRemovePinned={(ref) => setPinnedPassages(prev => prev.filter(p => p.reference !== ref))}
                currentTranslation={activeTranslation}
              />
            </div>

            {/* Column 4: Live Preview Monitor & Chapter Navigator */}
            <div className="h-full overflow-hidden">
              <LivePreviewColumn
                currentContent={liveOutput}
                onClearScreen={() => handlePushLiveContent({ type: 'hold' })}
                onNavigateVerse={(direction) => {
                  if (liveOutput.type === 'scripture') {
                    const step = stepPassageVerse(liveOutput.passage, direction, activeTranslation);
                    handlePushLivePassage(step);
                  }
                }}
                onJumpToVerse={(vNum) => {
                  if (liveOutput.type === 'scripture') {
                    const jump = getBiblePassageText(liveOutput.passage.book, liveOutput.passage.chapter, vNum, vNum, activeTranslation);
                    handlePushLivePassage(jump);
                  } else {
                    const jump = getBiblePassageText(currentContext.book || 'John', currentContext.chapter || 3, vNum, vNum, activeTranslation);
                    handlePushLivePassage(jump);
                  }
                }}
                onLaunchProjector={handleLaunchProjector}
              />
            </div>

          </div>
        )}

        {/* Worship Lyrics Mini-Studio */}
        {activeTab === 'worship' && (
          <div className="h-[calc(100vh-105px)] overflow-y-auto">
            <WorshipStudio
              onPushSlide={handlePushLiveContent}
              activeSlideId={null}
            />
          </div>
        )}

        {/* Software Integrations Hub (OBS / EasyWorship / vMix) */}
        {activeTab === 'software' && (
          <div className="h-[calc(100vh-105px)] overflow-y-auto">
            <SoftwareIntegrationsHub
              currentPassage={liveOutput.type === 'scripture' ? liveOutput.passage : null}
            />
          </div>
        )}

      </main>

    </div>
  );
}
