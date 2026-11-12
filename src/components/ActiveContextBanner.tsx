import React from 'react';
import { ActiveContext } from '../types/scripture';
import { Layers, RotateCcw } from 'lucide-react';

interface ActiveContextBannerProps {
  context: ActiveContext;
  onClearContext: () => void;
  onSetContext: (book: string, chapter: number) => void;
}

export const ActiveContextBanner: React.FC<ActiveContextBannerProps> = ({
  context,
  onClearContext,
  onSetContext
}) => {
  const hasContext = Boolean(context.book && context.chapter);

  return (
    <div className="bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 rounded-lg p-2.5 transition-all">
      <div className="flex items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="font-semibold text-slate-900 dark:text-white">
            Context:
          </span>
          {hasContext ? (
            <span className="px-2 py-0.5 font-mono text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 rounded border border-amber-300 dark:border-amber-700/50">
              {context.book} {context.chapter}
            </span>
          ) : (
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              None (implied verses like "v18" resolve to active context)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {hasContext ? (
            <button
              onClick={onClearContext}
              className="px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-400">Preset:</span>
              <button
                onClick={() => onSetContext('John', 3)}
                className="px-2 py-0.5 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/60 rounded font-medium"
              >
                John 3
              </button>
              <button
                onClick={() => onSetContext('Romans', 8)}
                className="px-2 py-0.5 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/60 rounded font-medium"
              >
                Rom 8
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
