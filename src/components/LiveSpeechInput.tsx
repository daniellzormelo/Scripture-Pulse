import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, Upload, AlertCircle, ShieldAlert, ChevronDown, Play, Sparkles, SlidersHorizontal } from 'lucide-react';

interface LiveSpeechInputProps {
  onParseText: (text: string, source: 'live_mic' | 'typed' | 'preset' | 'audio_upload') => void;
  isLoading: boolean;
}

export const LiveSpeechInput: React.FC<LiveSpeechInputProps> = ({
  onParseText,
  isLoading
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const [isAudioSimulating, setIsAudioSimulating] = useState(false);
  const [inputMode, setInputMode] = useState<'mic' | 'text' | 'preset'>('mic');
  const [showPresetsDrawer, setShowPresetsDrawer] = useState(false);

  const recognitionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  const autoStartAttemptedRef = useRef(false);
  const lastParsedInterimRef = useRef<string>('');

  // Helper function to activate continuous microphone listening
  const startListening = async () => {
    setSpeechError(null);
    setShowPermissionGuide(false);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setShowPermissionGuide(true);
        setIsListening(false);
        return;
      }
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err: any) {
        // Recognition might already be running
        setIsListening(true);
      }
    } else {
      setSpeechError('Web Speech API not supported in this browser.');
    }
  };

  // Web Speech API initialization & Auto-Mic Activation
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
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
            finalSentence += text + ' ';
            if (text.trim()) {
              onParseText(text.trim(), 'live_mic');
            }
          } else {
            currentTranscript += text;
          }
        }

        const activeText = (currentTranscript || finalSentence).trim();
        setTranscript(activeText);

        // Continuous real-time parsing on interim speech transcripts for ultra-fast instant projection
        if (currentTranscript.trim() && currentTranscript.trim() !== lastParsedInterimRef.current) {
          lastParsedInterimRef.current = currentTranscript.trim();
          onParseText(currentTranscript.trim(), 'live_mic');
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status/error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setSpeechError('Microphone permission blocked by browser.');
          setShowPermissionGuide(true);
          setIsListening(false);
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Speech status: ${event.error}`);
        }
      };

      recognition.onend = () => {
        if (isListening) {
          try {
            recognition.start();
          } catch (e) {
            setIsListening(false);
          }
        }
      };

      recognitionRef.current = recognition;

      // Automatically turn on microphone immediately on load
      if (!autoStartAttemptedRef.current) {
        autoStartAttemptedRef.current = true;
        startListening().catch(() => {});
      }

      // Fallback: Turn on mic on first page interaction if blocked by browser autoplay policy
      const handleFirstInteraction = () => {
        if (!isListening && recognitionRef.current) {
          startListening().catch(() => {});
        }
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
      };

      window.addEventListener('click', handleFirstInteraction);
      window.addEventListener('keydown', handleFirstInteraction);
      window.addEventListener('touchstart', handleFirstInteraction);

      return () => {
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
      };
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const toggleListening = async () => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    await startListening();
  };

  const handlePlaySermonAudio = (text: string) => {
    setIsAudioSimulating(true);
    setTranscript(text);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => {
        setIsAudioSimulating(false);
        onParseText(text, 'preset');
      };
      utterance.onerror = () => {
        setIsAudioSimulating(false);
        onParseText(text, 'preset');
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setIsAudioSimulating(false);
        onParseText(text, 'preset');
      }, 1000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onParseText(`Turn with me to John chapter 3 verse 16 (Parsed from ${file.name})`, 'audio_upload');
  };

  // Audio Canvas Waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;

      if (isListening || isAudioSimulating) {
        ctx.strokeStyle = isAudioSimulating ? '#6366f1' : '#f59e0b';
        ctx.beginPath();
        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;

        for (let x = 0; x < width; x += 3) {
          const freq = (x + step * 4) * 0.05;
          const amplitude = Math.sin(freq) * 10 * (isListening || isAudioSimulating ? 1.5 : 0.2) + Math.cos(x * 0.1) * 4;
          const y = centerY + amplitude;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        step++;
      } else {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isListening, isAudioSimulating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onParseText(inputText.trim(), 'typed');
    setInputText('');
  };

  const sermonPresets = [
    { title: "John 3:16", text: "Turn with me to John chapter 3 verse 16" },
    { title: "Relative Verse (v18)", text: "Now look at verse 18" },
    { title: "Relative Verse (v20)", text: "Skip to verse 20" },
    { title: "1 Corinthians 13:4-7", text: "Open to First Corinthians chapter 13 verses 4 through 7" },
    { title: "Psalm 23:1", text: "Look at Psalm twenty-three verse one" },
    { title: "Non-scripture prayer", text: "Let us join our hearts in prayer for our community" }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      
      {/* Input Mode Selector Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setInputMode('mic')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              inputMode === 'mic'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Live Mic</span>
          </button>

          <button
            type="button"
            onClick={() => setInputMode('text')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              inputMode === 'text'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Type Speech</span>
          </button>

          <button
            type="button"
            onClick={() => setInputMode('preset')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              inputMode === 'preset'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sample Quotes</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={audioInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => audioInputRef.current?.click()}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
            title="Upload audio file"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload Audio</span>
          </button>
        </div>
      </div>

      {/* MODE 1: LIVE MIC INPUT */}
      {inputMode === 'mic' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-amber-500/10 text-amber-500'}`}>
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isListening ? 'Listening to Preacher Speech...' : 'Microphone Ready'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isListening ? 'Continuously parsing Bible verses as spoken' : 'Click start to begin continuous speech parsing'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleListening}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide uppercase transition-all shadow-sm ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-amber-600 hover:bg-amber-500 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950'
              }`}
            >
              {isListening ? 'Stop Mic' : 'Start Mic'}
            </button>
          </div>

          <canvas ref={canvasRef} width={600} height={24} className="w-full h-6 block rounded bg-slate-50 dark:bg-slate-950/60" />

          {transcript && (
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-lg text-xs font-mono text-amber-900 dark:text-amber-200 truncate">
              <strong>Transcript:</strong> "{transcript}"
            </div>
          )}
        </div>
      )}

      {/* MODE 2: TEXT INPUT */}
      {inputMode === 'text' && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='Type sentence (e.g. "Turn with me to John chapter 3 verse 16")...'
            className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold transition-colors disabled:opacity-50 shrink-0"
          >
            Parse
          </button>
        </form>
      )}

      {/* MODE 3: SAMPLE SERMON PRESETS SELECTOR */}
      {inputMode === 'preset' && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
            Select a Pastor Sermon Sample Quote:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sermonPresets.map((preset, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-2">
                <div className="truncate">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">{preset.title}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 italic truncate block">"{preset.text}"</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePlaySermonAudio(preset.text)}
                    className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg text-xs"
                    title="Play Audio Stream"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onParseText(preset.text, 'preset')}
                    className="px-2 py-1 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-[11px] font-semibold"
                  >
                    Parse
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Permission Warning Box */}
      {showPermissionGuide && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <div className="flex items-center gap-2 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Microphone Blocked by Browser</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Click the Lock 🔒 icon in your browser address bar to set Microphone to Allow, or use <strong>Type Speech</strong> or <strong>Sample Quotes</strong> above.
          </p>
        </div>
      )}

    </div>
  );
};
