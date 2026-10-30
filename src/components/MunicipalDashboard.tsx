import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  AlertTriangle, 
  Sparkles, 
  FileText, 
  Layers, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Truck, 
  ExternalLink,
  ChevronDown,
  ArrowUpDown,
  Compass,
  MapPin,
  Flame,
  GitMerge
} from 'lucide-react';
import { CivicReport, ReportCategory, ReportStatus, PriorityLevel } from '../types/civic';

interface MunicipalDashboardProps {
  reports: CivicReport[];
  onUpdateReportStatus: (id: string, newStatus: ReportStatus) => void;
  onUpdateReportDepartment: (id: string, department: string) => void;
  onOpenDuplicateModal: (report: CivicReport) => void;
  onOpenActionBriefModal: (report: CivicReport) => void;
  onViewOnMap: (coords: { lat: number; lng: number; xPercent: number; yPercent: number }) => void;
  onInspectAi: (report: CivicReport) => void;
}

export const MunicipalDashboard: React.FC<MunicipalDashboardProps> = ({
  reports,
  onUpdateReportStatus,
  onUpdateReportDepartment,
  onOpenDuplicateModal,
  onOpenActionBriefModal,
  onViewOnMap,
  onInspectAi
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'newest' | 'oldest'>('priority');

  // Municipal department list
  const departments = [
    'Department of Public Works (Roads)',
    'Water Supply & Sewerage Board',
    'Municipal Sanitation & Waste Management',
    'Power & Grid Emergency Services',
    'Department of Transportation (Traffic Signals)',
    'Urban Forestry & Parks Maintenance',
    'City Public Safety & Traffic Dispatch'
  ];

  // Filtering
  const filteredReports = reports.filter((rep) => {
    if (statusFilter !== 'all' && rep.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && rep.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && rep.priority.level !== priorityFilter) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        rep.title.toLowerCase().includes(q) ||
        rep.trackingCode.toLowerCase().includes(q) ||
        rep.address.toLowerCase().includes(q) ||
        rep.zone.toLowerCase().includes(q) ||
        rep.rawDescription.toLowerCase().includes(q) ||
        rep.assignedDepartment?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Sorting
  filteredReports.sort((a, b) => {
    if (sortBy === 'priority') {
      return b.priority.totalScore - a.priority.totalScore;
    }
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // Statistics
  const totalCount = reports.length;
  const criticalCount = reports.filter((r) => r.priority.level === 'critical').length;
  const duplicatesCount = reports.filter((r) => r.duplicateInfo.isDuplicate).length;
  const inProgressCount = reports.filter((r) => r.status === 'in_progress').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Title & Stats Summary Bar */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Operations Command
              </span>
              <span className="text-xs text-slate-500 font-medium">Incident Triage & Action</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Municipal Triage & Operations
            </h1>
            <p className="text-slate-600 text-sm mt-0.5">
              Prioritize urgent hazards, resolve duplicates, assign municipal departments, and generate 60-second action briefs.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Queue</div>
              <div className="text-xl font-black text-slate-900">{totalCount}</div>
            </div>

            <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 shadow-xs">
              <div className="text-[10px] text-rose-600 font-bold uppercase tracking-wider flex items-center space-x-1">
                <Flame className="w-3 h-3" />
                <span>Critical Hazards</span>
              </div>
              <div className="text-xl font-black text-rose-700">{criticalCount}</div>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 shadow-xs">
              <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider flex items-center space-x-1">
                <GitMerge className="w-3 h-3" />
                <span>Duplicates Linked</span>
              </div>
              <div className="text-xl font-black text-amber-800">{duplicatesCount}</div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 shadow-xs">
              <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Resolved</div>
              <div className="text-xl font-black text-emerald-800">{resolvedCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search reports by title, code (e.g. CP-1042), street address, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Quick Status pills */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {['all', 'pending', 'triaged', 'in_progress', 'resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? 'All Status' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary filters & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Filter by:</span>
            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium"
            >
              <option value="all">All Categories</option>
              <option value="roads">Roads & Pavements</option>
              <option value="water_drainage">Water & Drainage</option>
              <option value="waste_sanitation">Waste & Sanitation</option>
              <option value="electricity_lighting">Power & Lighting</option>
              <option value="public_safety">Public Safety</option>
              <option value="parks_trees">Parks & Trees</option>
            </select>

            {/* Priority */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical (85-100)</option>
              <option value="high">High (70-84)</option>
              <option value="medium">Medium (50-69)</option>
              <option value="low">Low (0-49)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Sort by:</span>
            <button
              onClick={() => setSortBy('priority')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                sortBy === 'priority' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              AI Priority Score ↓
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                sortBy === 'newest' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Newest First
            </button>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No reports match your current filters</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the search keywords or filters.</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const isCritical = report.priority.level === 'critical';
            const isHigh = report.priority.level === 'high';

            return (
              <div
                key={report.id}
                className={`bg-white rounded-2xl border transition shadow-sm hover:shadow-md p-5 sm:p-6 ${
                  isCritical
                    ? 'border-rose-300 ring-1 ring-rose-500/10'
                    : isHigh
                    ? 'border-amber-200'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Core report information */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {report.trackingCode}
                      </span>

                      {/* Priority Score badge */}
                      <span
                        onClick={() => onInspectAi(report)}
                        title="Click to inspect AI reasoning breakdown"
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer transition hover:scale-105 ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : isHigh
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        <Flame className="w-3 h-3 fill-current" />
                        <span>Priority {report.priority.totalScore}/100</span>
                      </span>

                      {/* Duplicate badge */}
                      {report.duplicateInfo.isDuplicate && (
                        <button
                          onClick={() => onOpenDuplicateModal(report)}
                          className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition cursor-pointer"
                        >
                          <GitMerge className="w-3 h-3 text-amber-700" />
                          <span>{report.duplicateInfo.confidenceScore}% Duplicate Match</span>
                        </button>
                      )}

                      {/* Cluster badge */}
                      {report.clusterId && (
                        <button
                          onClick={() => onViewOnMap(report.coords)}
                          className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300 hover:bg-indigo-200 transition cursor-pointer"
                        >
                          <Compass className="w-3 h-3 text-indigo-700" />
                          <span>5th Ave Cluster</span>
                        </button>
                      )}

                      {/* Category */}
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                        {report.category.replace('_', ' ')}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      {report.title}
                    </h2>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {report.rawDescription}
                    </p>

                    {/* AI Executive Summary banner */}
                    <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-xs text-slate-700 flex items-start space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-indigo-950">AI Summary: </span>
                        {report.aiSummary}
                      </div>
                    </div>

                    {/* Location & Citizen contact */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{report.address}</span>
                      </span>
                      <span>•</span>
                      <span>{report.zone}</span>
                      <span>•</span>
                      <span>Reported by {report.citizenName}</span>
                      <span>•</span>
                      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Right Column: Dispatch controls & RAG Action Brief */}
                  <div className="lg:w-72 shrink-0 bg-slate-50/80 rounded-xl p-4 border border-slate-200 space-y-3">
                    {/* Status switcher */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 mb-1">
                        <span>Workflow Status</span>
                        <span className="text-slate-600 capitalize">{report.status.replace('_', ' ')}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-[11px]">
                        <button
                          onClick={() => onUpdateReportStatus(report.id, 'triaged')}
                          className={`py-1 rounded font-semibold transition cursor-pointer ${
                            report.status === 'triaged'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          Triage
                        </button>
                        <button
                          onClick={() => onUpdateReportStatus(report.id, 'in_progress')}
                          className={`py-1 rounded font-semibold transition cursor-pointer ${
                            report.status === 'in_progress'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          Dispatch
                        </button>
                        <button
                          onClick={() => onUpdateReportStatus(report.id, 'resolved')}
                          className={`py-1 rounded font-semibold transition cursor-pointer ${
                            report.status === 'resolved'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          Resolve
                        </button>
                      </div>
                    </div>

                    {/* Department dropdown */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                        Assigned Municipal Agency
                      </label>
                      <select
                        value={report.assignedDepartment || departments[0]}
                        onChange={(e) => onUpdateReportDepartment(report.id, e.target.value)}
                        className="w-full text-xs p-1.5 border border-slate-300 rounded-lg bg-white text-slate-800"
                      >
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Action Brief Trigger */}
                    <button
                      onClick={() => onOpenActionBriefModal(report)}
                      className="w-full py-2 px-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Generate 60s Action Brief</span>
                    </button>

                    {/* Quick map button */}
                    <button
                      onClick={() => onViewOnMap(report.coords)}
                      className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs border border-slate-200 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>Locate on Civic Map</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
