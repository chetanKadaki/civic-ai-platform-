import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  Wrench, 
  DollarSign, 
  Clock, 
  Copy, 
  Share2, 
  Printer,
  ShieldAlert
} from 'lucide-react';
import { CivicReport, ActionBrief } from '../types/civic';

interface ActionBriefModalProps {
  report: CivicReport | null;
  onClose: () => void;
}

export const ActionBriefModal: React.FC<ActionBriefModalProps> = ({
  report,
  onClose
}) => {
  const [brief, setBrief] = useState<ActionBrief | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!report) return;

    let isMounted = true;
    setIsLoading(true);

    fetch('/api/ai/action-brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ report })
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setBrief(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Action brief fetch error:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [report]);

  if (!report) return null;

  const handleCopy = () => {
    if (!brief) return;
    const text = `
CIVICPULSE 60-SECOND EXECUTIVE ACTION BRIEF
Target Report: #${report.trackingCode} - ${report.title}
Location: ${report.address} (${report.zone})
Priority: ${report.priority.level.toUpperCase()} (${report.priority.totalScore}/100)

EXECUTIVE SUMMARY:
${brief.executiveSummary}

ROOT CAUSE HYPOTHESIS:
${brief.rootCauseHypothesis}

RETRIEVED MUNICIPAL SOPS:
${brief.retrievedSopCodes.join(', ')}

REQUIRED DISPATCH UNIT:
${brief.requiredDispatchUnit} (Crew Size: ${brief.estimatedCrewSize})

EQUIPMENT CHECKLIST:
${brief.equipmentChecklist.map((item) => `- ${item}`).join('\n')}

STEP-BY-STEP ACTION PLAN:
${brief.stepByStepActionPlan.join('\n')}

ESTIMATED BUDGET: $${brief.estimatedBudgetUsd} USD
CITIZEN NOTIFICATION: "${brief.citizenCommunicationTemplate}"
Generated via: ${brief.modelUsed}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500 text-white px-2 py-0.5 rounded">
                  Operational Action Brief
                </span>
                <span className="text-xs font-mono text-cyan-400">
                  Under 1-Minute Decision Time
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                Executive Municipal Action Brief
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
        <div className="p-6 overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-sm font-bold text-slate-800">
                Retrieving Municipal SOPs & Synthesizing Action Plan...
              </div>
              <p className="text-xs text-slate-400">
                Grounding complaint #{report.trackingCode} against municipal standard operating procedures.
              </p>
            </div>
          ) : brief ? (
            <>
              {/* Target Incident Meta */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Target Incident</div>
                  <div className="text-sm font-bold text-slate-900">{report.title}</div>
                  <div className="text-xs text-slate-500">{report.address} • Priority {report.priority.totalScore}/100</div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {brief.retrievedSopCodes.map((code) => (
                    <span
                      key={code}
                      className="px-2.5 py-1 bg-indigo-100 text-indigo-900 rounded-lg text-xs font-mono font-bold border border-indigo-200"
                    >
                      Protocol Code: {code}
                    </span>
                  ))}
                </div>
              </div>

              {/* 1-Minute Executive Summary */}
              <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 space-y-2">
                <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-blue-700" />
                  <span>Executive Operational Summary</span>
                </div>
                <p className="text-xs text-blue-950 font-medium leading-relaxed">
                  {brief.executiveSummary}
                </p>
              </div>

              {/* Root Cause & Consequences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Root Cause Assessment
                  </span>
                  <p className="text-xs text-slate-800">
                    {brief.rootCauseHypothesis}
                  </p>
                </div>

                <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200 space-y-1">
                  <div className="flex items-center space-x-1 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Consequence if untreated (24h)</span>
                  </div>
                  <p className="text-xs text-rose-950">
                    {brief.immediateRiskToLifeOrProperty}
                  </p>
                </div>
              </div>

              {/* Logistics & Crew Requirements */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Tactical Crew & Equipment Deployment
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center space-x-1">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Assigned Unit</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-1">
                      {brief.requiredDispatchUnit}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Crew Size / SLA</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-1">
                      {brief.estimatedCrewSize} Specialist Workers
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center space-x-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Estimated Material Cost</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-700 mt-1">
                      ${brief.estimatedBudgetUsd} USD
                    </div>
                  </div>
                </div>

                {/* Equipment checklist */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    Required Equipment Checklist:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                    {brief.equipmentChecklist.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-[11px]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step-by-Step SOP Tactical Plan */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Official Standard Operating Procedure Execution Plan
                </span>
                <div className="space-y-1.5">
                  {brief.stepByStepActionPlan.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 flex items-start space-x-2"
                    >
                      <span className="font-mono font-bold text-blue-600 shrink-0">#{idx + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Citizen SMS Update Template */}
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
                  Automated Citizen Progress SMS Template
                </span>
                <p className="font-medium italic">
                  "{brief.citizenCommunicationTemplate}"
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Unable to generate brief at this time.
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 p-4 sm:p-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 font-medium">
            Standard: Certified Municipal Operating Protocol
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 flex items-center space-x-1.5 cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Executive Brief'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm"
            >
              Approve & Dispatch Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
