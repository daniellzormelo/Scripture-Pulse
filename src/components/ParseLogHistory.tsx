import React from 'react';
import { ParseLogEntry } from '../types/scripture';
import { History, Layers, CheckCircle2, XCircle, Trash2, Clock } from 'lucide-react';

interface ParseLogHistoryProps {
  logs: ParseLogEntry[];
  onClearLogs: () => void;
  onSelectLog: (log: ParseLogEntry) => void;
}

export const ParseLogHistory: React.FC<ParseLogHistoryProps> = ({
  logs,
  onClearLogs,
  onSelectLog
}) => {
  if (logs.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
        <History className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          No Speech Stream Log Yet
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          Parsed sentences and detected scripture citations will appear here in sequence.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Sermon Transcript Log ({logs.length})
          </h3>
        </div>

        <button
          onClick={onClearLogs}
          className="text-xs text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1 font-medium"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {logs.map((log) => {
          const isDetected = log.response.detected;
          return (
            <div
              key={log.id}
              onClick={() => onSelectLog(log)}
              className="p-3 bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-xl cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 shrink-0">
                  {isDetected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      {log.timestamp}
                    </span>

                    {isDetected && (
                      <span className="px-2 py-0.5 text-[10px] font-bold font-mono text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 rounded border border-amber-300 dark:border-amber-800">
                        {log.response.book} {log.response.chapter}:{log.response.verse_start}
                        {log.response.verse_end !== log.response.verse_start ? `-${log.response.verse_end}` : ''}
                      </span>
                    )}

                    {log.resolved_from_context && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 rounded border border-sky-200 dark:border-sky-800 flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        Resolved via Context
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-800 dark:text-slate-200 mt-1 italic font-mono">
                    "{log.input_text}"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {log.latency_ms}ms
                </span>
                <span className="capitalize px-2 py-0.5 bg-slate-200/60 dark:bg-slate-800 rounded text-[10px]">
                  {log.source.replace('_', ' ')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
