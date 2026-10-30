import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  Clock, 
  Search,
  Upload,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CivicReport, ReportCategory, LocationCoords } from '../types/civic';

interface CitizenCaptureProps {
  onReportCreated: (newReport: CivicReport) => void;
  onNavigateToTracker: (trackingCode: string) => void;
  onNavigateToDashboard: () => void;
}

const CATEGORY_OPTIONS: { id: ReportCategory; label: string; icon: string; desc: string }[] = [
  { id: 'roads', label: 'Roads & Pavements', icon: '🛣️', desc: 'Potholes, cracks, missing curbs, sinkholes' },
  { id: 'water_drainage', label: 'Water & Drainage', icon: '💧', desc: 'Blocked storm drains, burst mains, waterlogging' },
  { id: 'waste_sanitation', label: 'Waste & Sanitation', icon: '🗑️', desc: 'Overflowing dumpsters, illegal dumping, odor' },
  { id: 'electricity_lighting', label: 'Power & Lighting', icon: '⚡', desc: 'Downed wires, blackouts, broken streetlights' },
  { id: 'public_safety', label: 'Public Safety', icon: '🚨', desc: 'Missing signs, open manholes, hazards' },
  { id: 'parks_trees', label: 'Parks & Trees', icon: '🌳', desc: 'Fallen branches, damaged play sets, overgrown brush' }
];

const PRESET_SCENARIOS = [
  {
    name: 'School Zone Pothole (Tests Duplicate)',
    category: 'roads' as ReportCategory,
    title: 'Huge crater pothole in front of St. Jude School on Elm St',
    description: 'School buses are swerving into oncoming traffic. Car tires popped. It is right in the school crosswalk on Elm St.',
    address: '424 Elm Street, North Ward',
    zone: 'North Ward - Sector 2',
    coords: { lat: 37.7750, lng: -122.4193, xPercent: 28.3, yPercent: 32.3 },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Downed Power Cable (Tests Critical 99/100)',
    category: 'electricity_lighting' as ReportCategory,
    title: 'High-voltage wire sparking on wet pavement near subway',
    description: 'A heavy overhead wire snapped and is smoking on the wet sidewalk 10m from the Metro North entrance. People are panicking.',
    address: 'Metro North Entrance Approach Rd',
    zone: 'North Metro Hub - Sector 3',
    coords: { lat: 37.7952, lng: -122.4099, xPercent: 42.1, yPercent: 18.1 },
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: '5th Ave Drain Silt (Joins Active Cluster)',
    category: 'water_drainage' as ReportCategory,
    title: 'Drainage grate blocked with construction silt at 5th and Pine',
    description: 'Curb inlet is completely plugged with road gravel. Rainwater is backing up into store entrances on 5th Ave.',
    address: '5th Ave & Pine St',
    zone: 'Central Business District - Sector 4',
    coords: { lat: 37.7834, lng: -122.4167, xPercent: 54.1, yPercent: 48.2 },
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=600&auto=format&fit=crop&q=80'
  }
];

export const CitizenCapture: React.FC<CitizenCaptureProps> = ({
  onReportCreated,
  onNavigateToTracker,
  onNavigateToDashboard
}) => {
  const [activeMode, setActiveMode] = useState<'submit' | 'track'>('submit');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ReportCategory>('roads');
  const [address, setAddress] = useState('420 Elm Street, North Ward');
  const [zone, setZone] = useState('North Ward - Sector 2');
  const [coords, setCoords] = useState<LocationCoords>({ lat: 37.7749, lng: -122.4194, xPercent: 30, yPercent: 35 });
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80');
  const [citizenName, setCitizenName] = useState('Priya Sharma');
  const [citizenContact, setCitizenContact] = useState('priya.s@resident.org');

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdReport, setCreatedReport] = useState<CivicReport | null>(null);

  // Tracker lookup state
  const [searchTrackingCode, setSearchTrackingCode] = useState('');

  const handleApplyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setCategory(preset.category);
    setAddress(preset.address);
    setZone(preset.zone);
    setCoords(preset.coords);
    setImageUrl(preset.imageUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      // 1. Call AI analyze endpoint
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          coords,
          address,
          zone
        })
      });

      const aiData = await res.json();
      const generatedCode = `CP-${Math.floor(1000 + Math.random() * 9000)}`;

      const newReport: CivicReport = {
        id: `rep-${Date.now()}`,
        trackingCode: generatedCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        title,
        rawDescription: description,
        aiSummary: aiData.aiSummary || title,
        category,
        aiValidatedCategory: aiData.validatedCategory || category,
        address,
        zone,
        coords,
        imageUrl,
        citizenName: citizenName || 'Anonymous Citizen',
        citizenContact,
        status: aiData.duplicateInfo?.isDuplicate ? 'triaged' : 'pending',
        priority: aiData.priority || {
          totalScore: 75,
          level: 'high',
          severityScore: 25,
          vulnerabilityZoneScore: 20,
          publicImpactScore: 15,
          repeatEscalationScore: 15,
          explanation: 'AI evaluated report severity and community exposure.'
        },
        duplicateInfo: aiData.duplicateInfo || {
          isDuplicate: false,
          confidenceScore: 0,
          reasoning: 'No duplicate detected.'
        },
        assignedDepartment: aiData.assignedDepartment || 'Department of Public Works',
        estimatedResolutionHours: aiData.estimatedResolutionHours || 12,
        tags: [category, aiData.priority?.level || 'medium'],
        timeline: [
          {
            id: `tl-${Date.now()}`,
            timestamp: new Date().toISOString(),
            title: 'Report Submitted',
            description: `Citizen filed complaint for ${address}.`,
            actor: citizenName || 'Citizen',
            actorRole: 'citizen',
            statusChange: 'pending'
          },
          {
            id: `tl-${Date.now() + 1}`,
            timestamp: new Date().toISOString(),
            title: 'AI Automated Triage',
            description: `AI scored priority at ${aiData.priority?.totalScore || 75}/100 (${aiData.priority?.level?.toUpperCase() || 'HIGH'}). ${aiData.duplicateInfo?.isDuplicate ? `Flagged as duplicate of #${aiData.duplicateInfo?.parentReportId}.` : 'Identified as unique incident.'}`,
            actor: aiData.modelUsed || 'CivicPulse AI',
            actorRole: 'ai_system',
            statusChange: 'triaged'
          }
        ]
      };

      // Save to server
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport)
      });

      onReportCreated(newReport);
      setCreatedReport(newReport);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Citizen Reporting Portal
            </span>
            <span className="text-xs text-slate-500 font-medium">Fast 60-second submission</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Report an Infrastructure Problem
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Submit road hazards, waterlogging, broken streetlights, or waste overflow with instant location and photo capture.
          </p>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveMode('submit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeMode === 'submit'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Submit Report
          </button>
          <button
            onClick={() => setActiveMode('track')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeMode === 'track'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Track by Code
          </button>
        </div>
      </div>

      {activeMode === 'track' ? (
        /* Citizen Tracking Mode */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg">
          <div className="max-w-md mx-auto text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Track Your Civic Report</h2>
            <p className="text-sm text-slate-500 mt-1">
              Enter your 6-character CivicPulse tracking reference code (e.g. <span className="font-mono text-blue-600 font-bold">CP-1042</span> or <span className="font-mono text-blue-600 font-bold">CP-1070</span>).
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchTrackingCode.trim()) {
                  onNavigateToTracker(searchTrackingCode.trim().toUpperCase());
                }
              }}
              className="mt-6 flex gap-2"
            >
              <input
                type="text"
                placeholder="CP-XXXX"
                value={searchTrackingCode}
                onChange={(e) => setSearchTrackingCode(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl font-mono text-center uppercase tracking-widest font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition cursor-pointer"
              >
                Track
              </button>
            </form>

            {/* Quick test codes */}
            <div className="mt-6 pt-6 border-t border-slate-100 text-left">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                Sample Test Reports to Track:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => onNavigateToTracker('CP-1042')}
                  className="p-2 text-left bg-slate-50 hover:bg-blue-50 rounded-lg border border-slate-200 hover:border-blue-300 transition cursor-pointer"
                >
                  <span className="font-mono font-bold text-blue-700">CP-1042</span>: Deep Pothole (In Progress)
                </button>
                <button
                  onClick={() => onNavigateToTracker('CP-1070')}
                  className="p-2 text-left bg-slate-50 hover:bg-blue-50 rounded-lg border border-slate-200 hover:border-blue-300 transition cursor-pointer"
                >
                  <span className="font-mono font-bold text-rose-700">CP-1070</span>: 440V Sparking Cable (Critical)
                </button>
                <button
                  onClick={() => onNavigateToTracker('CP-1050')}
                  className="p-2 text-left bg-slate-50 hover:bg-blue-50 rounded-lg border border-slate-200 hover:border-blue-300 transition cursor-pointer"
                >
                  <span className="font-mono font-bold text-indigo-700">CP-1050</span>: 5th Ave Drain Cascade (Triaged)
                </button>
                <button
                  onClick={() => onNavigateToTracker('CP-1090')}
                  className="p-2 text-left bg-slate-50 hover:bg-blue-50 rounded-lg border border-slate-200 hover:border-blue-300 transition cursor-pointer"
                >
                  <span className="font-mono font-bold text-emerald-700">CP-1090</span>: Library Graffiti (Resolved)
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : createdReport ? (
        /* Submission Success / AI Triage Summary Card */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-xl space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                  Report Triaged & Registered
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Ticket #{createdReport.trackingCode}
                </h2>
                <p className="text-xs text-slate-500">
                  {createdReport.address} • Submitted just now
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                createdReport.priority.level === 'critical' ? 'bg-rose-100 text-rose-800' :
                createdReport.priority.level === 'high' ? 'bg-amber-100 text-amber-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {createdReport.priority.level} • {createdReport.priority.totalScore}/100
              </span>
            </div>
          </div>

          {/* AI Duplicate Detection Notification */}
          {createdReport.duplicateInfo.isDuplicate && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <span className="font-bold">Duplicate Notice: </span>
                {createdReport.duplicateInfo.reasoning}
                <div className="mt-1 font-semibold text-amber-800">
                  Your ticket has been linked to the primary work order. You will receive real-time notifications when the crew completes the repair!
                </div>
              </div>
            </div>
          )}

          {/* AI Explainable Prioritization Breakdown */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                AI Explainable Triage Analysis
              </span>
            </div>
            <p className="text-xs text-slate-700 mb-3">
              {createdReport.priority.explanation}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Hazard Severity</div>
                <div className="text-base font-black text-slate-800">{createdReport.priority.severityScore}/35</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Vulnerability Zone</div>
                <div className="text-base font-black text-slate-800">{createdReport.priority.vulnerabilityZoneScore}/25</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Public Impact</div>
                <div className="text-base font-black text-slate-800">{createdReport.priority.publicImpactScore}/20</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Escalation Factor</div>
                <div className="text-base font-black text-slate-800">{createdReport.priority.repeatEscalationScore}/20</div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-700">Assigned Routing: </span>
                {createdReport.assignedDepartment}
              </div>
              <div>
                <span className="font-semibold text-slate-700">Est. Turnaround: </span>
                {createdReport.estimatedResolutionHours} hours
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onNavigateToTracker(createdReport.trackingCode)}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition cursor-pointer shadow-md"
            >
              <span>Follow Citizen Live Tracker</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToDashboard}
              className="py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition cursor-pointer"
            >
              View in Municipal Dispatcher Queue
            </button>
            <button
              onClick={() => {
                setCreatedReport(null);
                setTitle('');
                setDescription('');
              }}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* Report Submission Form */
        <div className="space-y-6">
          {/* Quick Demo Preset Selector */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Common Municipal Problem Examples (1-Click Test)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_SCENARIOS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="p-2.5 text-left bg-white hover:bg-blue-100/60 rounded-xl border border-blue-200 text-xs transition cursor-pointer shadow-xs group"
                >
                  <div className="font-bold text-slate-800 group-hover:text-blue-700 flex items-center justify-between">
                    <span>{preset.name}</span>
                    <span className="text-[10px] text-blue-600 font-mono">Load</span>
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {preset.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            {/* Step 1: Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                1. Select Issue Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CATEGORY_OPTIONS.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 text-left rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      category === cat.id
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{cat.icon}</span>
                      <span className={`text-xs font-bold ${category === cat.id ? 'text-blue-900' : 'text-slate-800'}`}>
                        {cat.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 leading-tight">
                      {cat.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Problem Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  2. Headline / Short Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep crater pothole outside school gate"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Description & Impact Details
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the issue, estimated depth/size, hazard risk, school or hospital proximity..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Step 3: Photo attachment & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  3. Photographic Evidence
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50">
                  {imageUrl ? (
                    <div className="relative group rounded-lg overflow-hidden h-36 bg-slate-900">
                      <img
                        src={imageUrl}
                        alt="Evidence"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="px-2.5 py-1 bg-rose-600 text-white rounded text-xs font-bold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 flex flex-col items-center">
                      <Camera className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-xs text-slate-600 font-medium">Attach hazard photo</span>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setImageUrl('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80')}
                          className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                        >
                          Use Sample Pothole
                        </button>
                        <span className="text-slate-300">•</span>
                        <button
                          type="button"
                          onClick={() => setImageUrl('https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=80')}
                          className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                        >
                          Use Flood Photo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location & Mini Pin */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  4. Location (Address & Coordinates)
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-blue-600 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address or intersection"
                      className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Zone</span>
                      <select
                        value={zone}
                        onChange={(e) => setZone(e.target.value)}
                        className="w-full mt-0.5 p-2 border border-slate-300 rounded-xl bg-white text-xs font-medium"
                      >
                        <option value="North Ward - Sector 2">North Ward - Sector 2</option>
                        <option value="Central Business District - Sector 4">Central Business District - Sector 4</option>
                        <option value="East Harbor District - Sector 1">East Harbor District - Sector 1</option>
                        <option value="West Hills Residential - Sector 5">West Hills Residential - Sector 5</option>
                        <option value="Sunset District - Sector 7">Sunset District - Sector 7</option>
                        <option value="South Greenbelt - Sector 6">South Greenbelt - Sector 6</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Map Coordinate</span>
                      <div className="mt-0.5 p-2 bg-slate-100 rounded-xl font-mono text-[11px] text-slate-700 flex items-center justify-between">
                        <span>X: {coords.xPercent}%</span>
                        <span>Y: {coords.yPercent}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Citizen Contact */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Your Name</span>
                      <input
                        type="text"
                        value={citizenName}
                        onChange={(e) => setCitizenName(e.target.value)}
                        className="w-full mt-0.5 p-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">SMS / Email (Optional)</span>
                      <input
                        type="text"
                        value={citizenContact}
                        onChange={(e) => setCitizenContact(e.target.value)}
                        className="w-full mt-0.5 p-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>AI will triage, detect duplicates & score urgency in ~1.5s</span>
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl text-sm flex items-center space-x-2 transition cursor-pointer shadow-lg shadow-blue-500/20"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AI Engine Triaging...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Civic Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
