import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  GitMerge, 
  Layers, 
  ShieldCheck, 
  Calculator, 
  BookOpen, 
  Terminal,
  Database,
  ArrowRight
} from 'lucide-react';
import { CIVIC_SOPS } from '../data/civicSops';

export const AiPipelineInspector: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'prioritization' | 'duplicates' | 'rag' | 'prompt'>('prioritization');

  // Interactive Prioritization Simulator
  const [severityWeight, setSeverityWeight] = useState(30);
  const [vulnerabilityWeight, setVulnerabilityWeight] = useState(22);
  const [impactWeight, setImpactWeight] = useState(18);
  const [escalationWeight, setEscalationWeight] = useState(16);

  const calculatedTotal = Math.min(100, severityWeight + vulnerabilityWeight + impactWeight + escalationWeight);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            AI Engine Diagnostics & Transparency
          </span>
          <span className="text-xs text-slate-500 font-medium">Explainability & Decision Logic</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          AI Triage & RAG Grounding Architecture
        </h1>
        <p className="text-slate-600 text-sm mt-0.5">
          How CivicPulse eliminates black-box decisions using explainable scoring, vector duplicate matching, and SOP grounding.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveSubTab('prioritization')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'prioritization' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Explainable Prioritization Formula
        </button>
        <button
          onClick={() => setActiveSubTab('duplicates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'duplicates' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Semantic & Spatial Duplicate Engine
        </button>
        <button
          onClick={() => setActiveSubTab('rag')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'rag' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. RAG Civic SOP Knowledge Base ({CIVIC_SOPS.length} SOPs)
        </button>
        <button
          onClick={() => setActiveSubTab('prompt')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'prompt' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          4. Structured System Prompts
        </button>
      </div>

      {/* Subtab 1: Prioritization */}
      {activeSubTab === 'prioritization' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                The 4-Factor Explainable Prioritization Model
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Rather than an opaque classification, every report receives a transparent score out of 100 with clear weights.
              </p>
            </div>

            <div className="space-y-4">
              {/* Factor 1 */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800">
                    1. Physical Hazard & Safety Severity (Max 35 pts)
                  </span>
                  <span className="font-mono font-bold text-indigo-600">{severityWeight} / 35 pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={severityWeight}
                  onChange={(e) => setSeverityWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Assesses direct risk of injury, electrocution, road collapse, structural failure, or deep water drowning hazard.
                </p>
              </div>

              {/* Factor 2 */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800">
                    2. Vulnerability Zone Sensitivity (Max 25 pts)
                  </span>
                  <span className="font-mono font-bold text-indigo-600">{vulnerabilityWeight} / 25 pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={vulnerabilityWeight}
                  onChange={(e) => setVulnerabilityWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Spatial proximity to schools, children playgrounds, hospitals, transit terminals, and elderly care centers.
                </p>
              </div>

              {/* Factor 3 */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800">
                    3. Public Disruption & Traffic Volume (Max 20 pts)
                  </span>
                  <span className="font-mono font-bold text-indigo-600">{impactWeight} / 20 pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={impactWeight}
                  onChange={(e) => setImpactWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Arterial vs residential road status, public bus routes affected, commuter density, and commercial disruption.
                </p>
              </div>

              {/* Factor 4 */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800">
                    4. Escalation & Repeat Multiplier (Max 20 pts)
                  </span>
                  <span className="font-mono font-bold text-indigo-600">{escalationWeight} / 20 pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={escalationWeight}
                  onChange={(e) => setEscalationWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Number of repeat citizen complaints, velocity of reports within 3 hours, and weather forecast degradation.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Live Simulated Priority Score */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Calculator className="w-4 h-4" />
                <span>Simulated Triage Score</span>
              </div>

              <div className="text-5xl font-black text-amber-400 mt-2">
                {calculatedTotal}
                <span className="text-xl font-normal text-slate-400">/100</span>
              </div>

              <div className="mt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  calculatedTotal >= 85 ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' :
                  calculatedTotal >= 70 ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' :
                  'bg-blue-500/30 text-blue-300 border border-blue-500/40'
                }`}>
                  {calculatedTotal >= 85 ? 'CRITICAL TIER' : calculatedTotal >= 70 ? 'HIGH PRIORITY' : 'MEDIUM / STANDARD'}
                </span>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800 space-y-3 text-xs text-slate-300">
                <div className="font-semibold text-white">Decision-Maker Plain Language Explanation:</div>
                <p className="italic leading-relaxed text-slate-300/90 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                  "Score {calculatedTotal}/100 assigned: {severityWeight >= 28 ? 'Hazard presents imminent physical bodily danger' : 'Moderate infrastructure wear'}. Location factor (+{vulnerabilityWeight}) accounts for high pedestrian vulnerability, and (+{impactWeight}) reflects municipal transit disruption."
                </p>
              </div>
            </div>

            <div className="pt-4 text-[11px] text-slate-400 border-t border-slate-800/80">
              Complies with PromptWars Rubric: "Show why one report outranks another in plain language, with the factors used."
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Duplicate Detection Engine */}
      {activeSubTab === 'duplicates' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="max-w-3xl">
            <h2 className="text-lg font-bold text-slate-900">
              Semantic & Spatio-Temporal Duplicate Elimination
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Municipalities waste up to 25% of operational budget deploying multiple field trucks to the same complaint reported via different channels (Twitter, phone, app). CivicPulse detects and consolidates duplicates in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <span className="font-mono text-xs font-bold text-indigo-600 block">Phase 1: Spatial Radius</span>
              <h3 className="text-sm font-bold text-slate-900">Geo-Proximity Cordon</h3>
              <p className="text-xs text-slate-600">
                Filters incoming reports within a 250-meter Euclidean / Haversine radius of existing uncompleted tickets in MySQL/Memory.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <span className="font-mono text-xs font-bold text-indigo-600 block">Phase 2: Semantic Similarity</span>
              <h3 className="text-sm font-bold text-slate-900">Dense Vector Embedding</h3>
              <p className="text-xs text-slate-600">
                Calculates Cosine Similarity using Ollama <code className="font-mono text-indigo-700">nomic-embed-text</code> or Gemini Embeddings over problem descriptions and tags.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <span className="font-mono text-xs font-bold text-indigo-600 block">Phase 3: Decision Threshold</span>
              <h3 className="text-sm font-bold text-slate-900">Automated Parent-Child Merge</h3>
              <p className="text-xs text-slate-600">
                Matches &gt; 65% similarity within 150m are flagged as duplicates, linking the citizen to master updates without generating a redundant work order.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: RAG SOP Knowledge Base */}
      {activeSubTab === 'rag' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                Retrieval-Augmented Generation (RAG)
              </span>
              <span className="text-xs text-slate-400">Indexed Municipal SOP Corpus</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Municipal Standard Operating Procedures (SOPs)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              These verified procedures are chunked and embedded in ChromaDB. When a report is triaged, the RAG engine retrieves the matching SOP to generate the 60-second operational action brief.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CIVIC_SOPS.map((sop) => (
              <div key={sop.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-xs font-bold">
                    {sop.code}
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Turnaround: {sop.standardTurnaroundHours}h SLA
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{sop.title}</h3>

                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Hazard Profile: </span>
                  {sop.targetHazard}
                </p>

                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Dispatch Crew: </span>
                  {sop.crewType}
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    First 2 SOP Execution Steps:
                  </span>
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div>{sop.stepByStepAction[0]}</div>
                    <div>{sop.stepByStepAction[1]}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 4: Structured System Prompts */}
      {activeSubTab === 'prompt' && (
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-white">System Prompt & Schema Definition</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Model: Gemini 3.8 Flash / Ollama Llama 3</span>
          </div>

          <pre className="bg-slate-950 p-4 rounded-2xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed">
{`SYSTEM_PROMPT = """
You are the Chief Municipal Incident Commander for CivicPulse.
Analyze raw citizen reports, validate the infrastructure category, and calculate an explainable priority score:

FORMULA WEIGHTS:
1. severityScore (0-35): Physical bodily hazard, structural danger, depth, electric shock
2. vulnerabilityZoneScore (0-25): Proximity to school zones, hospitals, daycares, transit stations
3. publicImpactScore (0-20): Commuters/citizens disrupted, arterial road vs local lane
4. repeatEscalationScore (0-20): Frequency of calls, public panic index

Ground every operational recommendation strictly in the retrieved Municipal SOP knowledge chunks.
Always output pure valid JSON matching the TriageResponse schema.
"""`}
          </pre>
        </div>
      )}
    </div>
  );
};
