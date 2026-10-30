import React from 'react';
import { 
  GitMerge, 
  X, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { CivicReport } from '../types/civic';

interface DuplicateDetectorModalProps {
  report: CivicReport | null;
  parentReport: CivicReport | null;
  onClose: () => void;
  onConfirmMerge: (childId: string, parentId: string) => void;
}

export const DuplicateDetectorModal: React.FC<DuplicateDetectorModalProps> = ({
  report,
  parentReport,
  onClose,
  onConfirmMerge
}) => {
  if (!report) return null;

  const confidence = report.duplicateInfo.confidenceScore || 85;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <GitMerge className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                  Duplicate Incident Detection
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {confidence}% Match Score
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                Semantic & Spatial Duplicate Verification
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
          {/* Explanation Alert */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <span className="font-bold">AI Analysis: </span>
              {report.duplicateInfo.reasoning}
            </div>
          </div>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Incoming Child Report */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500 uppercase text-[10px]">
                  Incoming Complaint
                </span>
                <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  #{report.trackingCode}
                </span>
              </div>

              {report.imageUrl && (
                <div className="rounded-xl overflow-hidden h-32 bg-slate-200">
                  <img src={report.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold text-slate-900">{report.title}</h4>
                <p className="text-xs text-slate-600 mt-1">{report.rawDescription}</p>
              </div>

              <div className="text-xs text-slate-500 pt-2 border-t border-slate-200 space-y-1">
                <div><span className="font-semibold text-slate-700">Location: </span>{report.address}</div>
                <div><span className="font-semibold text-slate-700">Submitter: </span>{report.citizenName}</div>
                <div><span className="font-semibold text-slate-700">Priority: </span>{report.priority.totalScore}/100</div>
              </div>
            </div>

            {/* Right: Existing Master / Parent Report */}
            <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-700 uppercase text-[10px]">
                  Existing Master Work Order
                </span>
                <span className="font-mono font-bold text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-200">
                  #{parentReport ? parentReport.trackingCode : 'CP-1042'}
                </span>
              </div>

              {parentReport?.imageUrl ? (
                <div className="rounded-xl overflow-hidden h-32 bg-slate-200">
                  <img src={parentReport.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden h-32 bg-blue-100 flex items-center justify-center text-xs text-blue-600">
                  Photo on Master Record
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {parentReport ? parentReport.title : 'Deep crater pothole in front of St. Jude Elementary'}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {parentReport ? parentReport.rawDescription : '15cm deep pothole causing vehicle tire damage outside school.'}
                </p>
              </div>

              <div className="text-xs text-slate-500 pt-2 border-t border-blue-200 space-y-1">
                <div><span className="font-semibold text-slate-700">Location: </span>{parentReport ? parentReport.address : '420 Elm Street'}</div>
                <div><span className="font-semibold text-slate-700">Current Crew: </span>{parentReport?.assignedTo || 'Asphalt Rapid Response'}</div>
                <div><span className="font-semibold text-slate-700">Status: </span>{parentReport?.status || 'in_progress'}</div>
              </div>
            </div>
          </div>

          {/* Metric Comparison Gauges */}
          <div className="bg-slate-100 rounded-2xl p-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Semantic Similarity</div>
              <div className="text-lg font-black text-amber-600">{confidence}%</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Geographic Distance</div>
              <div className="text-lg font-black text-blue-600">
                {report.duplicateInfo.distanceMeters ?? 14} meters
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Taxpayer Savings</div>
              <div className="text-lg font-black text-emerald-600">1 Rollout Avoided</div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 p-4 sm:p-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Merging links the submitter to the parent ticket for automatic resolution alerts.
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 cursor-pointer"
            >
              Keep as Distinct Incident
            </button>
            <button
              onClick={() => {
                if (parentReport) {
                  onConfirmMerge(report.id, parentReport.id);
                }
                onClose();
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-sm"
            >
              <GitMerge className="w-4 h-4" />
              <span>Confirm Merge & Link Ticket</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
