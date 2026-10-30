import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Rocket, 
  X,
  FileCheck2,
  Terminal
} from 'lucide-react';

interface HonestyNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HonestyNoteModal: React.FC<HonestyNoteModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                  Hackathon Rubric Section 8
                </span>
                <span className="text-xs text-slate-400">
                  ASTRA x PromptWars Mandatory Submission Item
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                Limitations & Honesty Note
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Section 1: What is Real */}
          <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. What is Real & Fully Functional in this Prototype</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-emerald-950 pl-1">
              <li>
                <span className="font-semibold">Live Server-Side AI Triage:</span> Express server integrates with Gemini 3.8 Flash using <code className="font-mono text-emerald-800">@google/genai</code> to perform category extraction, 1-sentence summaries, and 4-factor explainable prioritization.
              </li>
              <li>
                <span className="font-semibold">Deterministic Heuristic Fallback:</span> If no API key is injected, a deterministic NLP rule-engine executes identically so the demo never crashes or hangs.
              </li>
              <li>
                <span className="font-semibold">RAG SOP Retrieval:</span> Real Municipal Standard Operating Procedure (SOP) corpus indexed for roads, drainage, hazardous trees, electrical lines, and sanitation. Action briefs ground operational steps directly in official protocols.
              </li>
              <li>
                <span className="font-semibold">Spatial & Semantic Duplicate Detection:</span> Algorithms compute both Haversine/coordinate proximity (&lt;250m) and text similarity to flag duplicate tickets.
              </li>
              <li>
                <span className="font-semibold">Full 4-Stage Lifecycle:</span> Capture, Understand, Reveal (Interactive SVG Map with 5th Ave cluster), and Act (Dispatch & Citizen Tracker).
              </li>
            </ul>
          </div>

          {/* Section 2: What is Mocked / Simulated */}
          <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200 space-y-2">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>2. What is Mocked or Simulated (Per Integrity Rules)</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-amber-950 pl-1">
              <li>
                <span className="font-semibold">Synthetic Complaint Dataset:</span> The 42 reports are synthetically authored to simulate realistic edge cases, intentional duplicates, and the 5th Ave multi-issue infrastructure cascade without exposing real citizen PII.
              </li>
              <li>
                <span className="font-semibold">SMS / Push Dispatch Notification:</span> Citizen phone alerts and field worker SMS dispatches are simulated within the UI timeline rather than calling a live Twilio/telecom gateway.
              </li>
              <li>
                <span className="font-semibold">Municipal Work Order System:</span> We do not connect to live municipal SAP or legacy Cityworks databases; data is maintained in the Express server state.
              </li>
            </ul>
          </div>

          {/* Section 3: Where the AI Can Be Wrong (Failure Modes) */}
          <div className="bg-rose-50/70 rounded-2xl p-5 border border-rose-200 space-y-2">
            <div className="flex items-center space-x-2 text-rose-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>3. Where the AI Can Make Mistakes (Failure Modes & Edge Cases)</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-rose-950 pl-1">
              <li>
                <span className="font-semibold">Pothole Depth Hallucination from 2D Photos:</span> Without LIDAR or reference markers (e.g. a coin or soda can placed beside the hole), depth estimation from mobile camera angles can fluctuate ±5cm.
              </li>
              <li>
                <span className="font-semibold">False Positive Duplicates on Intersecting Roads:</span> If two independent potholes occur on opposite corners of a wide 6-lane boulevard, semantic and spatial models might prematurely suggest merging them even though they require two separate repair asphalt cuts.
              </li>
              <li>
                <span className="font-semibold">Vague / Sarcastic Citizen Descriptions:</span> Submissions like <em>"Thanks city hall for giving us a free swimming pool on 5th Ave"</em> require strong colloquial nuance parsing to avoid misclassifying as recreational rather than waterlogging.
              </li>
            </ul>
          </div>

          {/* Section 4: What We Would Build Next */}
          <div className="bg-indigo-50/70 rounded-2xl p-5 border border-indigo-200 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-900 font-bold text-sm">
              <Rocket className="w-4 h-4 text-indigo-600" />
              <span>4. Production Roadmap & Next Engineering Steps</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-indigo-950 pl-1">
              <li>
                <span className="font-semibold">Municipal GIS Integration:</span> Direct bi-directional synchronization with municipal ArcGIS layers for underground utility pipes, power substations, and storm sewers.
              </li>
              <li>
                <span className="font-semibold">Autonomous Aerial Drone Reconnaissance:</span> Triggering automated municipal drone flyovers to verify reported structural cave-ins and tree blockages before rolling heavy excavators.
              </li>
              <li>
                <span className="font-semibold">Multi-Language Audio Submissions:</span> Voice note transcription with local dialect support for elderly or non-English speaking community members.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 sm:p-6 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
};
