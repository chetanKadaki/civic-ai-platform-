import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  Server, 
  Database, 
  Cpu, 
  Layers, 
  Download,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { ARCHITECTURE_SNIPPETS } from '../data/architectureDocs';

export const ArchitectureExplorer: React.FC = () => {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(ARCHITECTURE_SNIPPETS[0].id);
  const [copied, setCopied] = useState(false);

  const activeSnippet = ARCHITECTURE_SNIPPETS.find((s) => s.id === selectedSnippetId) || ARCHITECTURE_SNIPPETS[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Production Blueprint & Export
            </span>
            <span className="text-xs text-slate-500 font-medium">FastAPI • MySQL • Ollama • RAG</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Full-Stack Python + Local AI Architecture
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Complete, production-ready codebase to deploy CivicPulse using React 19, FastAPI, MySQL 8.0, and local Ollama models.
          </p>
        </div>

        <a
          href="/civicpulse_project.zip"
          download="civicpulse_project.zip"
          className="flex items-center space-x-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/20 text-sm transition cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Complete Project (.ZIP)</span>
        </a>
      </div>

      {/* Local Air-Gapped Municipal Advantage Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/70 px-2.5 py-0.5 rounded border border-emerald-800">
              Why Ollama + Local RAG for Civic Emergencies?
            </span>
            <h3 className="text-base font-bold text-white mt-1">
              Air-Gapped Municipal Resilience & Zero Data Privacy Leakage
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              When severe storms take down fiber lines or cellular towers, cloud-only AI fails. By pairing a local Ollama instance (running <span className="text-cyan-300 font-mono">llama3:8b</span> and <span className="text-cyan-300 font-mono">nomic-embed-text</span>) inside city dispatch halls, municipal crews can triage citizen reports and execute SOPs completely offline.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0 text-xs">
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between gap-4">
              <span className="text-slate-400">Offline Resilience:</span>
              <span className="text-emerald-400 font-bold">100% Air-Gapped</span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between gap-4">
              <span className="text-slate-400">Citizen PII Exposure:</span>
              <span className="text-emerald-400 font-bold">Zero Cloud Leak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Code Browser Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top File Selector Tabs */}
        <div className="bg-slate-900 p-2 sm:p-3 border-b border-slate-800 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center space-x-1.5">
            {ARCHITECTURE_SNIPPETS.map((snippet) => (
              <button
                key={snippet.id}
                onClick={() => setSelectedSnippetId(snippet.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer flex items-center space-x-2 whitespace-nowrap ${
                  selectedSnippetId === snippet.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {snippet.category === 'fastapi' && <Server className="w-3.5 h-3.5 text-emerald-400" />}
                {snippet.category === 'mysql' && <Database className="w-3.5 h-3.5 text-blue-400" />}
                {snippet.category === 'ollama_rag' && <Cpu className="w-3.5 h-3.5 text-amber-400" />}
                {snippet.category === 'docker' && <Layers className="w-3.5 h-3.5 text-cyan-400" />}
                {snippet.category === 'overview' && <Terminal className="w-3.5 h-3.5 text-purple-400" />}
                <span>{snippet.fileName}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 pl-4">
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer border border-slate-700"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Snippet Description bar */}
        <div className="bg-slate-800 px-6 py-2.5 text-xs text-slate-300 border-b border-slate-700 flex items-center justify-between">
          <div className="font-medium">
            <span className="font-bold text-white">{activeSnippet.title}: </span>
            {activeSnippet.description}
          </div>
          <span className="text-[11px] font-mono uppercase text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
            {activeSnippet.language}
          </span>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 bg-slate-950 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed max-h-[600px] select-text">
          <pre>{activeSnippet.code}</pre>
        </div>
      </div>

      {/* Quick Launch Terminal Instructions */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">How to Run Locally with Docker & Ollama</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">1. Spin Up Containers</span>
            <div className="text-emerald-400">$ docker compose up -d</div>
            <div className="text-slate-500 text-[10px]">Launches React, FastAPI, MySQL, & Ollama</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">2. Pull Ollama Weights</span>
            <div className="text-cyan-400">$ docker exec -it ollama ollama pull llama3:8b</div>
            <div className="text-cyan-400">$ docker exec -it ollama ollama pull nomic-embed-text</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">3. Access Endpoints</span>
            <div className="text-amber-400">Frontend: http://localhost:3000</div>
            <div className="text-amber-400">FastAPI Docs: http://localhost:8000/docs</div>
          </div>
        </div>
      </div>
    </div>
  );
};
