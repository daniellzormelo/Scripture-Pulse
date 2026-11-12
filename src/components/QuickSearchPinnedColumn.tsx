import React, { useState } from 'react';
import { BiblePassageText, CustomSlide } from '../types/scripture';
import { parseScriptureLocally } from '../services/localRegexParser';
import { getBiblePassageText, searchOfflineBiblePhrases } from '../data/bibleDatabase';
import { Search, Star, Layers, Plus, Send, BookOpen, Trash2 } from 'lucide-react';

interface QuickSearchPinnedColumnProps {
  onPushLive: (passage: BiblePassageText) => void;
  onPushCustomSlide: (slide: CustomSlide) => void;
  pinnedPassages: BiblePassageText[];
  onRemovePinned: (ref: string) => void;
  currentTranslation: string;
}

export const QuickSearchPinnedColumn: React.FC<QuickSearchPinnedColumnProps> = ({
  onPushLive,
  onPushCustomSlide,
  pinnedPassages,
  onRemovePinned,
  currentTranslation
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'pinned' | 'custom'>('search');

  // Custom slide form state
  const [customTitle, setCustomTitle] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [savedSlides, setSavedSlides] = useState<CustomSlide[]>([
    { id: 'cs-1', title: 'Welcome to Service', content: 'We are honored to worship with you today.' },
    { id: 'cs-2', title: 'Tithe & Offering', content: 'Bring the full tithe into the storehouse — Malachi 3:10' }
  ]);

  const handleSearch = (query: string) => {
    setSearchInput(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // 1. Direct Regex reference parsing (e.g. "John 3:16", "Romans 8:28")
    const regexMatch = parseScriptureLocally(query);
    if (regexMatch.detected) {
      const p = getBiblePassageText(regexMatch.book, regexMatch.chapter, regexMatch.verse_start, regexMatch.verse_end, currentTranslation);
      setSearchResults([{
        reference: p.reference,
        text: p.fullText,
        passage: p,
        type: 'exact'
      }]);
      return;
    }

    // 2. Offline fuzzy phrase search (<10ms)
    const phraseMatches = searchOfflineBiblePhrases(query, currentTranslation);
    if (phraseMatches.length > 0) {
      setSearchResults(phraseMatches.map(m => ({
        reference: m.reference,
        text: m.text,
        passage: getBiblePassageText(m.book, m.chapter, m.verse_start, m.verse_end, currentTranslation),
        type: 'phrase'
      })));
    } else {
      setSearchResults([]);
    }
  };

  const handleCreateCustomSlide = () => {
    if (!customTitle.trim()) return;
    const newSlide: CustomSlide = {
      id: `cs-${Date.now()}`,
      title: customTitle.trim(),
      content: customBody.trim()
    };
    setSavedSlides(prev => [newSlide, ...prev]);
    setCustomTitle('');
    setCustomBody('');
    onPushCustomSlide(newSlide);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full shadow-lg overflow-hidden">
      
      {/* Tab Switcher */}
      <div className="p-2 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1 w-full">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'search'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quick Search
          </button>
          <button
            onClick={() => setActiveTab('pinned')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'pinned'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-3 h-3" />
            <span>Pinned ({pinnedPassages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'custom'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Custom Slides
          </button>
        </div>
      </div>

      {/* TAB 1: QUICK SEARCH (Exact reference or loose phrase) */}
      {activeTab === 'search' && (
        <div className="flex-1 p-3 flex flex-col overflow-hidden space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="e.g. John 3:16 or 'the Lord is my shepherd'..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {searchResults.length === 0 && searchInput.trim().length > 0 && (
              <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-slate-500 text-xs">
                No matching verses found for "{searchInput}".
              </div>
            )}

            {searchResults.length === 0 && searchInput.trim().length === 0 && (
              <div className="p-4 text-center text-slate-500 text-xs space-y-2">
                <BookOpen className="w-6 h-6 mx-auto text-slate-600" />
                <p>Type any citation (e.g. <code>Ps 23</code>) or keyword phrase to lookup verses in &lt;10ms.</p>
              </div>
            )}

            {searchResults.map((result, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 transition-all flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs font-cinzel text-amber-400">
                      {result.reference}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {result.type === 'exact' ? 'Exact Citation' : 'Keyword Match'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic line-clamp-3 mt-1">
                    "{result.text}"
                  </p>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onPushLive(result.passage)}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Send className="w-3 h-3" />
                    <span>Push Live</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PINNED SET-LIST RAIL */}
      {activeTab === 'pinned' && (
        <div className="flex-1 p-3 overflow-y-auto space-y-2">
          {pinnedPassages.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs space-y-2">
              <Star className="w-6 h-6 mx-auto text-slate-600" />
              <p>No pinned scriptures yet.</p>
              <p className="text-[11px] text-slate-600">Star any detected verse card to build your pastor's set-list.</p>
            </div>
          ) : (
            pinnedPassages.map((p, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs font-cinzel text-amber-400">
                    {p.reference} ({p.translation})
                  </span>
                  <button
                    onClick={() => onRemovePinned(p.reference)}
                    className="text-slate-500 hover:text-red-400 p-1"
                    title="Remove from Pinned"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 italic line-clamp-2">
                  "{p.fullText}"
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={() => onPushLive(p)}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm"
                  >
                    <Send className="w-3 h-3" />
                    <span>Go Live</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: CUSTOM SLIDES (Announcements, Sermon Points) */}
      {activeTab === 'custom' && (
        <div className="flex-1 p-3 overflow-y-auto space-y-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-200 block">Create Slide</span>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Title (e.g. Point 1: Faith in Action)"
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <textarea
              value={customBody}
              onChange={(e) => setCustomBody(e.target.value)}
              placeholder="Content text..."
              rows={2}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              onClick={handleCreateCustomSlide}
              disabled={!customTitle.trim()}
              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save & Push Slide</span>
            </button>
          </div>

          <div className="space-y-2">
            {savedSlides.map((slide) => (
              <div
                key={slide.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-white">{slide.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{slide.content}</p>
                </div>
                <button
                  onClick={() => onPushCustomSlide(slide)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1"
                >
                  <Send className="w-3 h-3 text-amber-400" />
                  <span>Push</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
