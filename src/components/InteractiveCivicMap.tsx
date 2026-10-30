import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  AlertTriangle, 
  Compass, 
  Flame, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  X,
  FileText,
  GitMerge,
  Maximize2
} from 'lucide-react';
import { CivicReport, HotspotCluster, ReportCategory } from '../types/civic';

interface InteractiveCivicMapProps {
  reports: CivicReport[];
  clusters: HotspotCluster[];
  selectedCoords?: { lat: number; lng: number; xPercent: number; yPercent: number } | null;
  onOpenActionBriefModal: (report: CivicReport) => void;
  onOpenDuplicateModal: (report: CivicReport) => void;
  onUpdateStatus: (id: string, status: any) => void;
}

export const InteractiveCivicMap: React.FC<InteractiveCivicMapProps> = ({
  reports,
  clusters,
  selectedCoords,
  onOpenActionBriefModal,
  onOpenDuplicateModal,
  onUpdateStatus
}) => {
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<HotspotCluster | null>(clusters[0] || null);
  const [showDuplicates, setShowDuplicates] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeClusterHighlight, setActiveClusterHighlight] = useState<string | null>('cluster-5th-pine');

  // Filter reports
  const visibleReports = reports.filter((r) => {
    if (!showDuplicates && r.duplicateInfo.isDuplicate) return false;
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    return true;
  });

  const getPriorityColor = (level: string) => {
    switch (level) {
      case 'critical':
        return '#ef4444'; // Red
      case 'high':
        return '#f59e0b'; // Amber
      case 'medium':
        return '#3b82f6'; // Blue
      default:
        return '#10b981'; // Green
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Title & Stage Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-cyan-100 text-cyan-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Metropolitan Area Map
            </span>
            <span className="text-xs text-slate-500 font-medium">Spatial Hotspots & Area Clusters</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Incident Hotspots & Cascade Map
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Real-time visual map revealing recurring problems, multi-issue infrastructure cascades, and high-priority locations.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 bg-white p-2.5 rounded-xl border border-slate-200 text-xs shadow-xs">
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span className="text-slate-700 font-semibold">Critical (85+)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-slate-700 font-semibold">High (70-84)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-slate-700 font-semibold">Medium</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-200 animate-pulse"></span>
            <span className="text-indigo-900 font-bold">Cascade Cluster</span>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Vector Interactive SVG City Map */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[520px]">
          {/* Map Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 z-10 bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Filter:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-xs"
              >
                <option value="all">All Categories</option>
                <option value="roads">Roads</option>
                <option value="water_drainage">Water & Drainage</option>
                <option value="electricity_lighting">Power & Lighting</option>
                <option value="waste_sanitation">Sanitation</option>
                <option value="public_safety">Public Safety</option>
              </select>

              <label className="flex items-center space-x-1.5 text-slate-300 cursor-pointer ml-2">
                <input
                  type="checkbox"
                  checked={showDuplicates}
                  onChange={(e) => setShowDuplicates(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <span className="text-[11px]">Show Merged Duplicates</span>
              </label>
            </div>

            <div className="text-[11px] text-cyan-400 font-mono">
              Displaying {visibleReports.length} incidents across 6 municipal zones
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full aspect-16/10 my-4 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
            <svg
              viewBox="0 0 1000 625"
              className="w-full h-full select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background City Grid Lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
                {/* Cluster pulse radial gradient */}
                <radialGradient id="clusterPulse" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4338ca" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="1000" height="625" fill="#090d16" />
              <rect width="1000" height="625" fill="url(#grid)" />

              {/* Metropolitan River curving through city */}
              <path
                d="M 120 0 C 180 150, 320 220, 480 270 C 640 320, 800 450, 950 625"
                fill="none"
                stroke="#0f2b48"
                strokeWidth="50"
                strokeLinecap="round"
              />
              <path
                d="M 120 0 C 180 150, 320 220, 480 270 C 640 320, 800 450, 950 625"
                fill="none"
                stroke="#0284c7"
                strokeWidth="12"
                strokeDasharray="4 8"
                strokeOpacity="0.4"
              />

              {/* Major Transit Avenues */}
              {/* 5th Avenue Corridor */}
              <line x1="540" y1="50" x2="540" y2="580" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
              <line x1="540" y1="50" x2="540" y2="580" stroke="#f59e0b" strokeWidth="2" strokeDasharray="8 6" strokeOpacity="0.6" />

              {/* Pine Street Crossing */}
              <line x1="100" y1="300" x2="900" y2="300" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
              <line x1="100" y1="300" x2="900" y2="300" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 6" strokeOpacity="0.5" />

              {/* Grand Avenue */}
              <line x1="200" y1="120" x2="880" y2="480" stroke="#1e293b" strokeWidth="8" />

              {/* Zone Area Labels */}
              <text x="280" y="160" fill="#475569" fontSize="16" fontWeight="bold" letterSpacing="2">NORTH WARD</text>
              <text x="560" y="260" fill="#64748b" fontSize="18" fontWeight="black" letterSpacing="3">DOWNTOWN CBD</text>
              <text x="750" y="140" fill="#475569" fontSize="15" fontWeight="bold" letterSpacing="2">EAST HARBOR</text>
              <text x="120" y="450" fill="#475569" fontSize="15" fontWeight="bold" letterSpacing="2">SUNSET DISTRICT</text>
              <text x="320" y="550" fill="#475569" fontSize="15" fontWeight="bold" letterSpacing="2">SOUTH GREENBELT</text>

              {/* Hotspot Cluster Pulsing Aura (5th Ave & Pine) */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedCluster(clusters[0])}
              >
                <circle cx="542" cy="301" r="75" fill="url(#clusterPulse)" className="animate-pulse" />
                <circle cx="542" cy="301" r="55" fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="6 4" />
                <text x="542" y="385" fill="#a5b4fc" fontSize="11" fontWeight="bold" textAnchor="middle">
                  HOTSPOT: 5TH AVE CASCADE (4 ISSUES)
                </text>
              </g>

              {/* Elm St School Cluster Aura */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedCluster(clusters[1])}
              >
                <circle cx="282" cy="201" r="45" fill="#f59e0b" fillOpacity="0.15" />
                <circle cx="282" cy="201" r="45" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="282" y="258" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">
                  ELM ST SCHOOL ZONE
                </text>
              </g>

              {/* Render Incident Pins */}
              {visibleReports.map((rep) => {
                const cx = rep.coords.xPercent * 10;
                const cy = rep.coords.yPercent * 6.25;
                const color = getPriorityColor(rep.priority.level);
                const isSelected = selectedReport?.id === rep.id;
                const isDuplicate = rep.duplicateInfo.isDuplicate;

                return (
                  <g
                    key={rep.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedReport(rep)}
                  >
                    {/* Ripple on high priority */}
                    {rep.priority.level === 'critical' && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="18"
                        fill="none"
                        stroke={color}
                        strokeWidth="1.5"
                        strokeOpacity="0.7"
                        className="animate-ping"
                      />
                    )}

                    {/* Pin Outer Ring */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 11 : isDuplicate ? 6 : 8}
                      fill={color}
                      stroke="#0f172a"
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-all duration-200 group-hover:scale-125"
                    />

                    {/* Inner core */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isDuplicate ? 2 : 3}
                      fill="#ffffff"
                    />

                    {/* Hover text label */}
                    <title>{`${rep.trackingCode}: ${rep.title} (Priority: ${rep.priority.totalScore}/100)`}</title>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Map Status Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Spatial Geo-Index Active</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Click any colored pin to inspect report or click purple cluster to analyze multi-infrastructure cascade.
            </span>
          </div>
        </div>

        {/* Right 1 Col: Selected Report / Hotspot Detail Panel */}
        <div className="space-y-6">
          {/* Hotspot & Cluster Deep-Dive Card */}
          {selectedCluster && (
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 border border-indigo-500/40 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-700">
                      AI Detected Hotspot Cluster
                    </span>
                    <h3 className="text-base font-extrabold text-white mt-1">
                      {selectedCluster.name}
                    </h3>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 text-xs font-bold uppercase">
                  {selectedCluster.severityLevel}
                </span>
              </div>

              <div className="bg-slate-950/60 rounded-xl p-3 border border-indigo-800/40 text-xs space-y-2">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    Root Cause Assessment:
                  </span>
                  <p className="text-slate-200 mt-0.5">
                    {selectedCluster.rootCauseAnalysis}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-amber-400 font-bold uppercase text-[10px] block">
                    Infrastructure Cascade Risk:
                  </span>
                  <p className="text-amber-200/90 mt-0.5">
                    {selectedCluster.infrastructureCascadeRisk}
                  </p>
                </div>
              </div>

              <div className="text-xs text-indigo-200">
                <span className="font-semibold text-slate-400">Recommended Action: </span>
                {selectedCluster.recommendedDepartment}
              </div>

              <div className="pt-1 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800/80">
                <span>Correlated Reports: {selectedCluster.reportCount}</span>
                <span className="text-cyan-400 font-bold">Zone: Sector 4 CBD</span>
              </div>
            </div>
          )}

          {/* Selected Pin Details Card */}
          {selectedReport ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {selectedReport.trackingCode}
                    </span>
                    <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded ${
                      selectedReport.priority.level === 'critical' ? 'bg-rose-100 text-rose-800' :
                      selectedReport.priority.level === 'high' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedReport.priority.totalScore}/100 Priority
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    {selectedReport.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedReport.address}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedReport.imageUrl && (
                <div className="rounded-xl overflow-hidden h-36 bg-slate-100 border border-slate-200">
                  <img
                    src={selectedReport.imageUrl}
                    alt={selectedReport.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <p className="text-xs text-slate-600">
                {selectedReport.rawDescription}
              </p>

              {/* Duplicate check */}
              {selectedReport.duplicateInfo.isDuplicate && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
                  <span className="font-bold">Duplicate Match ({selectedReport.duplicateInfo.confidenceScore}%): </span>
                  {selectedReport.duplicateInfo.reasoning}
                  <button
                    onClick={() => onOpenDuplicateModal(selectedReport)}
                    className="block mt-1 font-bold text-amber-800 underline cursor-pointer"
                  >
                    Compare Side-by-Side
                  </button>
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onOpenActionBriefModal(selectedReport)}
                  className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate 60s Action Brief</span>
                </button>

                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => onUpdateStatus(selectedReport.id, 'in_progress')}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg text-center cursor-pointer"
                  >
                    Dispatch Crew
                  </button>
                  <button
                    onClick={() => onUpdateStatus(selectedReport.id, 'resolved')}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-center cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 text-center text-xs text-slate-500">
              <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-slate-700">Select any pin on the map</p>
              <p className="mt-1">
                Click any colored node to review citizen photos, AI duplicate reasoning, and trigger instant crew dispatch.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
