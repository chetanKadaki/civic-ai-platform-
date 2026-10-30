import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowLeft,
  Truck,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { CivicReport, ReportStatus } from '../types/civic';

interface CitizenTrackerProps {
  report: CivicReport | null;
  trackingCodeQuery: string;
  onBackToCapture: () => void;
  onNavigateToDashboard: () => void;
  onSelectCode?: (code: string) => void;
}

export const CitizenTracker: React.FC<CitizenTrackerProps> = ({
  report,
  trackingCodeQuery,
  onBackToCapture,
  onNavigateToDashboard,
  onSelectCode
}) => {
  if (!report) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Tracking Code Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          Could not find an active report with tracking code <span className="font-mono font-bold text-slate-800">"{trackingCodeQuery}"</span>.
        </p>
        <button
          onClick={onBackToCapture}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
        >
          Return to Portal & Try Again
        </button>
      </div>
    );
  }

  const steps: { key: ReportStatus; label: string; desc: string }[] = [
    { key: 'pending', label: '1. Submitted', desc: 'Received & queued for AI triage' },
    { key: 'triaged', label: '2. Triaged', desc: 'Priority scored & duplicate verified' },
    { key: 'in_progress', label: '3. Dispatched', desc: 'Crew mobilized on site' },
    { key: 'resolved', label: '4. Resolved', desc: 'Safety restored & verified' }
  ];

  const getStepStatus = (stepKey: ReportStatus) => {
    const order: Record<ReportStatus, number> = {
      pending: 0,
      triaged: 1,
      in_progress: 2,
      resolved: 3,
      archived: 4
    };
    const currentOrder = order[report.status] ?? 0;
    const targetOrder = order[stepKey];

    if (currentOrder > targetOrder) return 'completed';
    if (currentOrder === targetOrder) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      {/* Top Bar with Quick Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <button
          onClick={onBackToCapture}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Report New Issue</span>
        </button>

        {onSelectCode && (
          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
            <span className="text-slate-400 font-medium text-[11px]">Quick Track:</span>
            {['CP-1042', 'CP-1070', 'CP-1050', 'CP-1090'].map((code) => (
              <button
                key={code}
                onClick={() => onSelectCode(code)}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs transition cursor-pointer ${
                  report.trackingCode === code
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                  {report.trackingCode}
                </span>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  report.status === 'resolved' ? 'bg-emerald-500/30 text-emerald-300' :
                  report.status === 'in_progress' ? 'bg-amber-500/30 text-amber-300' :
                  'bg-blue-500/30 text-blue-300'
                }`}>
                  Status: {report.status.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold mt-2 text-white">
                {report.title}
              </h1>
              <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{report.address} ({report.zone})</span>
              </p>
            </div>

            <div className="sm:text-right shrink-0">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">AI Urgency Priority</div>
              <div className="text-2xl font-black text-amber-400">
                {report.priority.totalScore}
                <span className="text-sm font-normal text-slate-400">/100</span>
              </div>
              <div className="text-xs uppercase font-bold tracking-wider text-slate-300">
                {report.priority.level} Severity
              </div>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {steps.map((st, idx) => {
                const state = getStepStatus(st.key);
                return (
                  <div key={idx} className="relative">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        state === 'completed' ? 'bg-emerald-500 text-white' :
                        state === 'current' ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/20' :
                        'bg-slate-800 text-slate-500'
                      }`}>
                        {state === 'completed' ? '✓' : idx + 1}
                      </div>
                      <span className={`text-xs font-bold ${
                        state === 'current' ? 'text-amber-400' :
                        state === 'completed' ? 'text-emerald-400' :
                        'text-slate-500'
                      }`}>
                        {st.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {st.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Duplicate Consolidated Alert */}
          {report.duplicateInfo.isDuplicate && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <span className="font-bold">Consolidated Duplicate Ticket: </span>
                {report.duplicateInfo.reasoning}
                <div className="mt-1 text-slate-700">
                  Multiple residents flagged this same hazard. Our AI unified these calls to prevent multiple crews from rolling out, guaranteeing unified coordination.
                </div>
              </div>
            </div>
          )}

          {/* Current Dispatch & Crew Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center space-x-2 text-slate-500 mb-1">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] uppercase font-bold tracking-wider">Assigned Agency</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {report.assignedDepartment || 'Department of Public Works'}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center space-x-2 text-slate-500 mb-1">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] uppercase font-bold tracking-wider">Field Response Crew</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {report.assignedTo || 'Rapid Response Unit 1'}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center space-x-2 text-slate-500 mb-1">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-[11px] uppercase font-bold tracking-wider">Resolution Target</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                Within {report.estimatedResolutionHours || 12} hours of triage
              </div>
            </div>
          </div>

          {/* AI Explainable Prioritization Narrative */}
          <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Why This Priority Was Assigned
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {report.priority.explanation}
            </p>
          </div>

          {/* Visual Evidence Photo */}
          {report.imageUrl && (
            <div>
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Attached Field Evidence
              </span>
              <div className="rounded-xl overflow-hidden border border-slate-200 h-48 sm:h-64 bg-slate-100">
                <img
                  src={report.imageUrl}
                  alt={report.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Activity Timeline Audit Trail */}
          <div>
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Action Timeline & Verification Trail
            </span>
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
              {report.timeline.map((evt, idx) => (
                <div key={idx} className="relative flex items-start space-x-3 pl-8">
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{evt.title}</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {evt.description}
                    </p>
                    <div className="mt-1 text-[10px] text-slate-400 font-semibold uppercase">
                      Action by: {evt.actor} ({evt.actorRole})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Submitter: <span className="font-semibold text-slate-700">{report.citizenName}</span> ({report.citizenContact || 'No SMS alert provided'})
          </div>
          <button
            onClick={onNavigateToDashboard}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Switch to Municipal Dispatch View
          </button>
        </div>
      </div>
    </div>
  );
};
