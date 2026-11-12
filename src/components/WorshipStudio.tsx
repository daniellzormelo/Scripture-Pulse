import React, { useState } from 'react';
import { WorshipSong, WorshipSongSlide, LiveOutputContent } from '../types/scripture';
import { Music, Plus, Send, Search, Edit3, Trash2, Check, Sparkles } from 'lucide-react';

interface WorshipStudioProps {
  onPushSlide: (content: LiveOutputContent) => void;
  activeSlideId: string | null;
}

const DEFAULT_SONGS: WorshipSong[] = [
  {
    id: 'song-1',
    title: 'Way Maker',
    author: 'Sinach',
    key: 'E',
    slides: [
      {
        id: 's1-v1',
        section: 'Verse 1',
        lines: [
          'You are here, moving in our midst',
          'I worship You, I worship You',
          'You are here, working in this place',
          'I worship You, I worship You'
        ]
      },
      {
        id: 's1-c',
        section: 'Chorus',
        lines: [
          'Way Maker, Miracle Worker',
          'Promise Keeper, Light in the darkness',
          'My God, that is who You are'
        ]
      },
      {
        id: 's1-b',
        section: 'Bridge',
        lines: [
          'Even when I don\'t see it, You\'re working',
          'Even when I don\'t feel it, You\'re working',
          'You never stop, You never stop working'
        ]
      }
    ]
  },
  {
    id: 'song-2',
    title: '10,000 Reasons (Bless The Lord)',
    author: 'Matt Redman',
    key: 'G',
    slides: [
      {
        id: 's2-c',
        section: 'Chorus',
        lines: [
          'Bless the Lord, O my soul, O my soul',
          'Worship His holy name',
          'Sing like never before, O my soul',
          'I\'ll worship Your holy name'
        ]
      },
      {
        id: 's2-v1',
        section: 'Verse 1',
        lines: [
          'The sun comes up, it\'s a new day dawning',
          'It\'s time to sing Your song again',
          'Whatever may pass and whatever lies before me',
          'Let me be singing when the evening comes'
        ]
      }
    ]
  },
  {
    id: 'song-3',
    title: 'Goodness of God',
    author: 'Bethel Music',
    key: 'Ab',
    slides: [
      {
        id: 's3-v1',
        section: 'Verse 1',
        lines: [
          'I love You, Lord, for Your mercy never fails me',
          'All my days, I\'ve been held in Your hands',
          'From the moment that I wake up until I lay my head',
          'Oh, I will sing of the goodness of God'
        ]
      },
      {
        id: 's3-c',
        section: 'Chorus',
        lines: [
          'All my life You have been faithful',
          'All my life You have been so, so good',
          'With every breath that I am able',
          'Oh, I will sing of the goodness of God'
        ]
      }
    ]
  }
];

export const WorshipStudio: React.FC<WorshipStudioProps> = ({ onPushSlide, activeSlideId }) => {
  const [songs, setSongs] = useState<WorshipSong[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('scripturepulse_worship_songs');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_SONGS;
  });

  const [selectedSongId, setSelectedSongId] = useState<string>(songs[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLyricsRaw, setNewLyricsRaw] = useState('');

  const currentSong = songs.find(s => s.id === selectedSongId) || songs[0];

  const filteredSongs = songs.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.slides.some(slide => slide.lines.some(l => l.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handlePushSlide = (slide: WorshipSongSlide) => {
    if (!currentSong) return;
    onPushSlide({
      type: 'worship',
      songTitle: currentSong.title,
      section: slide.section,
      lines: slide.lines
    });
  };

  const handleCreateSong = () => {
    if (!newTitle.trim()) return;

    // Parse sections by headers [Verse 1], [Chorus], etc.
    const rawLines = newLyricsRaw.split('\n').map(l => l.trim()).filter(Boolean);
    const parsedSlides: WorshipSongSlide[] = [];
    let currentSec: any = 'Verse 1';
    let currentLines: string[] = [];

    rawLines.forEach((line) => {
      if (line.startsWith('[') && line.endsWith(']')) {
        if (currentLines.length > 0) {
          parsedSlides.push({
            id: `slide-${Date.now()}-${parsedSlides.length}`,
            section: currentSec,
            lines: [...currentLines]
          });
          currentLines = [];
        }
        currentSec = line.replace(/[\[\]]/g, '') || 'Chorus';
      } else {
        currentLines.push(line);
      }
    });

    if (currentLines.length > 0) {
      parsedSlides.push({
        id: `slide-${Date.now()}-${parsedSlides.length}`,
        section: currentSec,
        lines: [...currentLines]
      });
    }

    const created: WorshipSong = {
      id: `song-${Date.now()}`,
      title: newTitle.trim(),
      slides: parsedSlides.length > 0 ? parsedSlides : [
        {
          id: `slide-${Date.now()}-0`,
          section: 'Chorus',
          lines: ['Praise the Lord, sing hallelujah!']
        }
      ]
    };

    const updated = [created, ...songs];
    setSongs(updated);
    setSelectedSongId(created.id);
    setShowAddModal(false);
    setNewTitle('');
    setNewLyricsRaw('');

    try {
      localStorage.setItem('scripturepulse_worship_songs', JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5 text-slate-100">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Worship Lyrics Mini-Studio</span>
              <span className="px-2 py-0.5 text-[10px] font-mono text-indigo-300 bg-indigo-950/80 rounded border border-indigo-800">
                Live Song Projection
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Instant sub-10ms lyrics search and multi-screen projection for sanctuary and live stream.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Song</span>
        </button>
      </div>

      {/* Main Split-Pane for Songs & Slide Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Song List with instant search */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs or lyrics in <10ms..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1 max-h-[440px] overflow-y-auto pr-1">
            {filteredSongs.map((song) => (
              <button
                key={song.id}
                onClick={() => setSelectedSongId(song.id)}
                className={`w-full text-left p-3 rounded-xl transition-all border ${
                  selectedSongId === song.id
                    ? 'bg-indigo-950/60 border-indigo-600/80 text-white shadow-md'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs truncate">{song.title}</span>
                  {song.key && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded">
                      Key {song.key}
                    </span>
                  )}
                </div>
                {song.author && (
                  <span className="text-[11px] text-slate-500 block truncate">{song.author}</span>
                )}
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {song.slides.length} slides
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active Song Slides Grid */}
        <div className="lg:col-span-8 space-y-4">
          {currentSong ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{currentSong.title}</span>
                    {currentSong.key && (
                      <span className="text-xs font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                        Key: {currentSong.key}
                      </span>
                    )}
                  </h4>
                  {currentSong.author && (
                    <span className="text-xs text-slate-400">{currentSong.author}</span>
                  )}
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Click any card to project live
                </span>
              </div>

              {/* Grid of Slide Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1">
                {currentSong.slides.map((slide) => {
                  const isActive = activeSlideId === slide.id;
                  return (
                    <div
                      key={slide.id}
                      onClick={() => handlePushSlide(slide)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden group ${
                        isActive
                          ? 'bg-amber-950/60 border-amber-500 shadow-xl'
                          : 'bg-slate-950/70 border-slate-800 hover:border-indigo-500/60 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                        <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                          {slide.section}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {isActive && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-slate-950 rounded flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
                              ON AIR
                            </span>
                          )}
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-indigo-300 font-semibold flex items-center gap-1">
                            <Send className="w-3 h-3" /> Push Live
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {slide.lines.map((line, lIdx) => (
                          <p key={lIdx} className="text-xs text-slate-200 leading-snug font-sans">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              Select or add a worship song to view and project lyrics.
            </div>
          )}
        </div>

      </div>

      {/* Add Song Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Add Worship Song</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Song Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Great Are You Lord"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Lyrics (Use [Verse 1], [Chorus], [Bridge] headers)
                </label>
                <textarea
                  value={newLyricsRaw}
                  onChange={(e) => setNewLyricsRaw(e.target.value)}
                  rows={8}
                  placeholder="[Verse 1]&#10;You give life, You are love&#10;You bring light to the darkness&#10;&#10;[Chorus]&#10;Great are You, Lord&#10;It's Your breath in our lungs"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSong}
                disabled={!newTitle.trim()}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors disabled:opacity-50"
              >
                Save Song
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
