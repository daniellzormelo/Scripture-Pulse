import express from 'express';
import { createServer as createHttpServer } from 'http';
import path from 'path';
import dotenv from 'dotenv';
import { parseSpeechWithGemini, parseAudioWithGemini } from './src/server/geminiParser';
import { getBiblePassageText } from './src/data/bibleDatabase';
import { parseScriptureLocally } from './src/services/localRegexParser';

dotenv.config();

const app = express();
const httpServer = createHttpServer(app);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// Global CORS Middleware for OBS Studio, EasyWorship & vMix Web Engine Integration
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Active Live Feed State (In-Memory for EasyWorship Stream)
let activeVerseFeed = {
  detected: true,
  book: "John",
  chapter: 3,
  verse_start: 16,
  verse_end: 16,
  reference: "John 3:16",
  translation: "NIV",
  text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
  raw_spoken_phrase: "John chapter 3 verse 16",
  timestamp: new Date().toISOString()
};

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'ScripturePulse Real-time Church Speech Parser',
    gemini_configured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString()
  });
});

// Real-Time Speech Parser Endpoint
app.post('/api/parse-speech', async (req, res) => {
  const startTime = Date.now();
  const { text, current_context } = req.body || {};

  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      error: 'Missing text parameter in request body.',
      detected: false
    });
  }

  try {
    const response = await parseSpeechWithGemini(text, current_context);
    
    // Update live EasyWorship feed state if a verse is detected
    if (response.detected) {
      const passageInfo = getBiblePassageText(response.book, response.chapter, response.verse_start, response.verse_end);
      activeVerseFeed = {
        detected: true,
        book: response.book,
        chapter: response.chapter,
        verse_start: response.verse_start,
        verse_end: response.verse_end,
        reference: passageInfo.reference,
        translation: passageInfo.translation,
        text: passageInfo.fullText,
        raw_spoken_phrase: response.raw_spoken_phrase,
        timestamp: new Date().toISOString()
      };
    }

    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  } catch (err: any) {
    console.error('API Error in /api/parse-speech:', err);
    const fallback = parseScriptureLocally(text, current_context);
    res.json(fallback);
  }
});

// Audio Speech Parser Endpoint
app.post('/api/parse-audio', async (req, res) => {
  const { audio_base64, mime_type, current_context } = req.body || {};

  if (!audio_base64) {
    return res.status(400).json({ error: 'Missing audio_base64 in request body.' });
  }

  try {
    const result = await parseAudioWithGemini(audio_base64, mime_type || 'audio/mp3', current_context);
    res.json(result);
  } catch (err: any) {
    console.error('Audio parse error:', err);
    res.status(500).json({ error: err.message || 'Failed to parse audio input.' });
  }
});

// Bible Text Lookup Endpoint
app.get('/api/bible-text', (req, res) => {
  const book = (req.query.book as string) || 'John';
  const chapter = parseInt(req.query.chapter as string, 10) || 3;
  const verseStart = parseInt(req.query.verse_start as string, 10) || 16;
  const verseEnd = parseInt(req.query.verse_end as string, 10) || verseStart;
  const translation = (req.query.translation as string) || 'NIV';

  const passage = getBiblePassageText(book, chapter, verseStart, verseEnd, translation);
  res.json(passage);
});

// =========================================
// DEDICATED EASYWORSHIP LIVE FEED ENDPOINTS
// =========================================

// Update EasyWorship feed state manually or from client local parser
app.post('/api/easyworship-feed', (req, res) => {
  const feed = req.body;
  if (feed && feed.reference) {
    activeVerseFeed = {
      detected: true,
      book: feed.book || "John",
      chapter: feed.chapter || 3,
      verse_start: feed.verse_start || 16,
      verse_end: feed.verse_end || feed.verse_start || 16,
      reference: feed.reference,
      translation: feed.translation || "NIV",
      text: feed.text || "",
      raw_spoken_phrase: feed.raw_spoken_phrase || "",
      timestamp: new Date().toISOString()
    };
    res.setHeader('Content-Type', 'application/json');
    return res.json({ success: true, feed: activeVerseFeed });
  }
  res.status(400).json({ error: 'Invalid verse feed payload' });
});

// EasyWorship JSON Feed Endpoint
app.get('/api/easyworship-feed', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(activeVerseFeed);
});

// EasyWorship Standard Feed (feed.json)
app.get('/feed.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({
    title: "ScripturePulse Live Feed",
    items: [
      {
        id: activeVerseFeed.reference,
        title: `${activeVerseFeed.reference} (${activeVerseFeed.translation})`,
        content_text: activeVerseFeed.text,
        spoken_phrase: activeVerseFeed.raw_spoken_phrase,
        date_published: activeVerseFeed.timestamp
      }
    ]
  });
});

// EasyWorship RSS/XML Feed (feed.xml)
app.get('/feed.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Access-Control-Allow-Origin', '*');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>ScripturePulse EasyWorship Live Feed</title>
    <link>${process.env.APP_URL || 'http://localhost:3000'}</link>
    <description>Real-time scripture verse feed for EasyWorship</description>
    <item>
      <title>${activeVerseFeed.reference}</title>
      <description><![CDATA[${activeVerseFeed.text}]]></description>
      <pubDate>${new Date(activeVerseFeed.timestamp).toUTCString()}</pubDate>
    </item>
  </channel>
</rss>`;
  res.send(xml);
});

// EasyWorship Plain Text Feed (feed.txt)
app.get('/feed.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(`${activeVerseFeed.reference} (${activeVerseFeed.translation})\n"${activeVerseFeed.text}"`);
});

// Development vs Production Middleware Mounting
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(` Church Speech Parser Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
