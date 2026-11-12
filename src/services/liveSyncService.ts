import { LiveOutputContent, ProjectorSettings } from '../types/scripture';

const BROADCAST_CHANNEL_NAME = 'scripturepulse_live_feed';

export class LiveSyncManager {
  private channel: BroadcastChannel | null = null;
  private listeners: ((content: LiveOutputContent) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      this.channel.onmessage = (event) => {
        if (event.data) {
          this.notifyListeners(event.data);
        }
      };
    }

    // Fallback: window storage event
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'scripturepulse_active_live' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.notifyListeners(parsed);
          } catch (err) {}
        }
      });
    }
  }

  public publish(content: LiveOutputContent): void {
    // 1. Post to BroadcastChannel (<5ms cross-window sync)
    if (this.channel) {
      try {
        this.channel.postMessage(content);
      } catch (e) {}
    }

    // 2. Sync to localStorage for persistent state across reloads & foreign browser sources
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('scripturepulse_active_live', JSON.stringify(content));
        
        // Backward-compatible sync with OBS / EasyWorship in-memory feeds
        if (content.type === 'scripture') {
          const feed = {
            detected: true,
            book: content.passage.book,
            chapter: content.passage.chapter,
            verse_start: content.passage.verse_start,
            verse_end: content.passage.verse_end,
            reference: content.passage.reference,
            translation: content.passage.translation,
            text: content.passage.fullText,
            fullText: content.passage.fullText,
            timestamp: new Date().toISOString()
          };
          localStorage.setItem('active_verse_feed', JSON.stringify(feed));

          fetch('/api/easyworship-feed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feed)
          }).catch(() => {});
        } else if (content.type === 'worship') {
          const feed = {
            detected: true,
            book: 'Lyrics',
            chapter: 1,
            verse_start: 1,
            verse_end: 1,
            reference: `${content.songTitle} [${content.section}]`,
            translation: 'WORSHIP',
            text: content.lines.join('\n'),
            fullText: content.lines.join('\n'),
            timestamp: new Date().toISOString()
          };
          localStorage.setItem('active_verse_feed', JSON.stringify(feed));
          fetch('/api/easyworship-feed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feed)
          }).catch(() => {});
        } else if (content.type === 'hold') {
          const feed = {
            detected: false,
            reference: '',
            text: '',
            fullText: '',
            timestamp: new Date().toISOString()
          };
          localStorage.setItem('active_verse_feed', JSON.stringify(feed));
        }
      } catch (e) {}
    }

    // 3. Local listeners in current tab
    this.notifyListeners(content);
  }

  public subscribe(callback: (content: LiveOutputContent) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(content: LiveOutputContent): void {
    for (const listener of this.listeners) {
      listener(content);
    }
  }

  public getInitialContent(): LiveOutputContent {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('scripturepulse_active_live');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return { type: 'hold' };
  }
}

export const liveSync = new LiveSyncManager();
