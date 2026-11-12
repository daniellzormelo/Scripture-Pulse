import React, { useState } from 'react';
import { DetectionResponse } from '../types/scripture';
import { Code, Copy, Check, Terminal, Play, Server, Layers } from 'lucide-react';

interface JsonOutputConsoleProps {
  detection: DetectionResponse | null;
  lastSpokenPhrase?: string;
  latencyMs?: number;
}

export const JsonOutputConsole: React.FC<JsonOutputConsoleProps> = ({
  detection,
  lastSpokenPhrase,
  latencyMs
}) => {
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'javascript' | 'python'>('curl');

  const currentJsonString = detection
    ? JSON.stringify(detection, null, 2)
    : JSON.stringify({ detected: false }, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(currentJsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const samplePhrase = lastSpokenPhrase || "John chapter 3 verse 16";
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  const curlCode = `curl -X POST ${originUrl}/api/parse-speech \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "${samplePhrase}",
    "current_context": {
      "book": "John",
      "chapter": 3
    }
  }'`;

  const jsCode = `const response = await fetch('${originUrl}/api/parse-speech', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "${samplePhrase}",
    current_context: { book: "John", chapter: 3 }
  })
});

const data = await response.json();
console.log(data);`;

  const pythonCode = `import requests

url = "${originUrl}/api/parse-speech"
payload = {
    "text": "${samplePhrase}",
    "current_context": { "book": "John", "chapter": 3 }
}

response = requests.post(url, json=payload)
data = response.json()
print(data)`;

  const handleCopyCode = () => {
    let textToCopy = curlCode;
    if (activeCodeTab === 'javascript') textToCopy = jsCode;
    if (activeCodeTab === 'python') textToCopy = pythonCode;

    navigator.clipboard.writeText(textToCopy);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl">
      
      {/* Console Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Structured JSON Output</span>
            <span className="px-2 py-0.5 text-[11px] font-mono text-amber-400 bg-amber-950/60 rounded border border-amber-800/60">
              application/json
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {latencyMs !== undefined && (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/50">
              {latencyMs}ms latency
            </span>
          )}
          <button
            onClick={handleCopyJson}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
          </button>
        </div>
      </div>

      {/* RAW JSON PREVIEW DISPLAY */}
      <div className="my-4 relative bg-slate-950 border border-slate-800 rounded-xl p-4 font-jetbrains text-sm overflow-x-auto text-amber-300">
        <pre className="leading-relaxed">{currentJsonString}</pre>
      </div>

      {/* Rules Compliance Check */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
        <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Raw JSON output (No markdown fences)</span>
        </div>
        <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Relative reference state context active</span>
        </div>
      </div>

      {/* API INTEGRATION CODE SNIPPETS */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-amber-500" />
            <span>Endpoint: POST /api/parse-speech</span>
          </span>

          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveCodeTab('curl')}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                activeCodeTab === 'curl' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              cURL
            </button>
            <button
              onClick={() => setActiveCodeTab('javascript')}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                activeCodeTab === 'javascript' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Node / Fetch
            </button>
            <button
              onClick={() => setActiveCodeTab('python')}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                activeCodeTab === 'python' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Python
            </button>
          </div>
        </div>

        <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 font-jetbrains text-xs text-slate-300 overflow-x-auto">
          <button
            onClick={handleCopyCode}
            className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
            title="Copy Code"
          >
            {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <pre>
            {activeCodeTab === 'curl' && curlCode}
            {activeCodeTab === 'javascript' && jsCode}
            {activeCodeTab === 'python' && pythonCode}
          </pre>
        </div>
      </div>

    </div>
  );
};
