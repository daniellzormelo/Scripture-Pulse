import React from 'react';
import { DetectionQueueItem, BiblePassageText } from '../types/scripture';
import { Send, Star, X, CheckCircle2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

interface DetectionQueueColumnProps {
  queueItems: DetectionQueueItem[];
  onPushLive: (passage: BiblePassageText) => void;
  onDismissItem: (id: string) => void;
  onTogglePin: (id: string) => void;
  activePassageReference?: string;
}

export const DetectionQueueColumn: React.FC<DetectionQueueColumnProps> = ({
  queueItems,
  onPushLive,
  onDismissItem,
  onTogglePin,
  activePassageReference
}) => {
  const highConfidenceItems = queueItems.filter(i => i.tier === 'high-confidence');
  const suggestionItems = queueItems.filter(i => i.tier === 'suggestion');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full shadow-lg overflow-hidden">
      
      {/* Column Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Two-Tier AI Detection Queue
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {queueItems.length} Staged
        </span>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-4">
        
        {/* Tier 1: High-Confidence Detected Cards */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>High-Confidence ({highConfidenceItems.length})</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">&gt; 90% Match</span>
          </div>

          {highConfidenceItems.length === 0 && (
            <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-slate-500 text-xs">
              No high-confidence citations detected yet.
            </div>
          )}

          {highConfidenceItems.map((item) => {
            const isLive = activePassageReference === item.passage.reference;
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all relative overflow-hidden ${
                  isLive
                    ? 'bg-amber-950/60 border-amber-500 shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm font-cinzel text-amber-400">
                      {item.passage.reference}
                    </span>
                    <span className="px-1.5 py-0.2 text-[10px] font-mono text-slate-300 bg-slate-800 rounded">
                      {item.passage.translation}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onTogglePin(item.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        item.isPinned ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title="Pin to Quick Set-List"
                    >
                      <Star className={`w-3.5 h-3.5 ${item.isPinned ? 'fill-amber-400' : ''}`} />
                    </button>

                    <button
                      onClick={() => onDismissItem(item.id)}
                      className="p-1 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                      title="Dismiss from Queue"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed italic mb-3">
                  "{item.passage.fullText}"
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                  <span className="truncate max-w-[140px] italic">
                    "{item.raw_spoken_phrase}"
                  </span>

                  <button
                    onClick={() => onPushLive(item.passage)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      isLive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    <Send className="w-3 h-3" />
                    <span>{isLive ? 'ON AIR' : 'GO LIVE'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tier 2: Verse Suggestions (Paraphrase & Semantic Matches Staged for Operator Review) */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Verse Suggestions ({suggestionItems.length})</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Paraphrase / Semantic</span>
          </div>

          {suggestionItems.length === 0 && (
            <div className="p-3 rounded-xl border border-dashed border-slate-800 text-center text-slate-500 text-xs">
              Semantic suggestions stage here safely without going live.
            </div>
          )}

          {suggestionItems.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-sky-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs font-cinzel text-sky-400">
                  {item.passage.reference} ({item.passage.translation})
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {Math.round(item.confidence * 100)}% match
                </span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed italic mb-2">
                "{item.passage.fullText}"
              </p>

              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500 truncate max-w-[120px]">
                  Engine: {item.engine}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDismissItem(item.id)}
                    className="px-2 py-0.5 text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => onPushLive(item.passage)}
                    className="px-2.5 py-0.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded flex items-center gap-1"
                  >
                    <Send className="w-2.5 h-2.5" />
                    <span>Stage Live</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
