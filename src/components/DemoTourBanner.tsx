import React from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  X, 
  Sparkles, 
  MapPin, 
  FileText, 
  Users, 
  FileSearch,
  ArrowRight
} from 'lucide-react';
import { ActiveTab } from './Navbar';

interface DemoTourBannerProps {
  currentStep: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectStep: (stepIndex: number) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const DemoTourBanner: React.FC<DemoTourBannerProps> = ({
  currentStep,
  isOpen,
  onClose,
  onSelectStep,
  onNavigateTab
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      title: '1. Capture (Citizen View)',
      desc: 'Submit a new complaint under 1 min with text, image, category & map pin.',
      actionLabel: 'Go to Capture Portal',
      targetTab: 'capture' as ActiveTab
    },
    {
      title: '2. Understand (AI Triage & Duplicate)',
      desc: 'See AI categorize, score priority (0-100) & detect 94% duplicate match with CP-1042.',
      actionLabel: 'Inspect Triage Engine',
      targetTab: 'dashboard' as ActiveTab
    },
    {
      title: '3. Reveal (5th Ave Hotspot Cluster)',
      desc: 'View multi-issue infrastructure cascade (drainage + flooding + sinkhole).',
      actionLabel: 'View Map & Clusters',
      targetTab: 'map' as ActiveTab
    },
    {
      title: '4. Act (RAG Action Brief)',
      desc: 'Generate 60-second executive brief grounded in Municipal SOPs.',
      actionLabel: 'View Dispatch Workflow',
      targetTab: 'dashboard' as ActiveTab
    },
    {
      title: '5. Track & Code Architecture',
      desc: 'Follow citizen resolution timeline and inspect FastAPI + MySQL + Ollama backend.',
      actionLabel: 'View Architecture Code',
      targetTab: 'architecture' as ActiveTab
    }
  ];

  const current = steps[currentStep] || steps[0];

  return (
    <div className="bg-slate-900 border-b border-indigo-500/30 text-white shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-20 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Step progress indicator */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 text-sm">
              {currentStep + 1}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                  Judges 5-Min Walkthrough • Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {current.title}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                {current.desc}
              </p>
            </div>
          </div>

          {/* Center: Step indicators */}
          <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
            {steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectStep(idx);
                  onNavigateTab(s.targetTab);
                }}
                className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-1 ${
                  currentStep === idx
                    ? 'bg-amber-400 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span>{idx + 1}.</span>
                <span className="hidden md:inline">{s.title.split(' ')[1]}</span>
              </button>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => {
                onNavigateTab(current.targetTab);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <span>{current.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => {
                  const next = currentStep + 1;
                  onSelectStep(next);
                  onNavigateTab(steps[next].targetTab);
                }}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={() => {
                  onSelectStep(0);
                  onNavigateTab(steps[0].targetTab);
                }}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition cursor-pointer"
              >
                Restart Demo
              </button>
            )}

            <button
              onClick={onClose}
              title="Close tour bar"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
