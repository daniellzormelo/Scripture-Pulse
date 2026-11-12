import React, { useRef, useEffect } from 'react';
import { TranscriptSnippet } from '../types/scripture';
import { FileText, Download, Sparkles, MessageSquare } from 'lucide-react';

interface SermonTranscriptColumnProps {
  transcriptSnippets: TranscriptSnippet[];
  interimTranscript: string;
  onExportStudyNotes: () => void;
  onClearTranscript: () => void;
}

export const SermonTranscriptColumn: React.FC<SermonTranscriptColumnProps> = ({
  transcriptSnippets,
  interimTranscript,
  onExportStudyNotes,
  onClearTranscript
}) => {
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcriptSnippets, interimTranscript]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full shadow-lg overflow-hidden">
      
      {/* Column Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Live Sermon Transcript
          </h3>
          <span className="px-1.5 py-0.2 text-[10px] font-mono text-slate-400 bg-slate-800 rounded">
            {transcriptSnippets.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onExportStudyNotes}
            className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
            title="Export full sermon transcript and callout cards for Bible study notes"
          >
            <Download className="w-3 h-3" />
            <span>Study Notes</span>
          </button>
        </div>
      </div>

      {/* Scrolling Word-by-Word Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 text-xs leading-relaxed font-sans">
        {transcriptSnippets.length === 0 && !interimTranscript && (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-6 space-y-2">
            <Sparkles className="w-8 h-8 text-slate-600 animate-pulse" />
            <p className="text-xs font-medium">Awaiting live speech stream from the preacher...</p>
            <p className="text-[11px] text-slate-600">Spoken words and detected citations will scroll here live.</p>
          </div>
        )}

        {transcriptSnippets.map((item) => (
          <div key={item.id} className="p-2 rounded-xl bg-slate-950/50 border border-slate-800/80 transition-all">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
              <span>{item.timestamp}</span>
              {item.detectedRef && (
                <span className="text-amber-400 font-bold bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/60">
                  {item.detectedRef}
                </span>
              )}
            </div>
            <p className="text-slate-200 font-medium">{item.text}</p>
          </div>
        ))}

        {/* Interim Streaming Transcript (In-Flight Speech) */}
        {interimTranscript && (
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 animate-pulse">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-0.5">
              Speaking Now:
            </span>
            <p className="text-amber-100 italic font-medium">{interimTranscript}</p>
          </div>
        )}

        <div ref={scrollEndRef} />
      </div>

      {/* Clear Bottom Toolbar */}
      {transcriptSnippets.length > 0 && (
        <div className="p-2 border-t border-slate-800 bg-slate-950/60 flex justify-between items-center text-[10px] text-slate-400">
          <span>Continuous Speech Parser Active</span>
          <button
            onClick={onClearTranscript}
            className="text-slate-500 hover:text-red-400 transition-colors"
          >
            Clear Log
          </button>
        </div>
      )}

    </div>
  );
};
