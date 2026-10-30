import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { CitizenCapture } from './components/CitizenCapture';
import { CitizenTracker } from './components/CitizenTracker';
import { MunicipalDashboard } from './components/MunicipalDashboard';
import { InteractiveCivicMap } from './components/InteractiveCivicMap';
import { DuplicateDetectorModal } from './components/DuplicateDetectorModal';
import { ActionBriefModal } from './components/ActionBriefModal';
import { CivicReport, HotspotCluster, ReportStatus } from './types/civic';
import { INITIAL_SYNTHETIC_REPORTS, INITIAL_CLUSTERS } from './data/syntheticReports';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [reports, setReports] = useState<CivicReport[]>(INITIAL_SYNTHETIC_REPORTS);
  const [clusters, setClusters] = useState<HotspotCluster[]>(INITIAL_CLUSTERS);
  const [isResetting, setIsResetting] = useState(false);

  // Modals state
  const [selectedDuplicateReport, setSelectedDuplicateReport] = useState<CivicReport | null>(null);
  const [selectedActionBriefReport, setSelectedActionBriefReport] = useState<CivicReport | null>(null);

  // Citizen Tracker state
  const [trackingCodeQuery, setTrackingCodeQuery] = useState<string>('CP-1042');
  const [trackingReport, setTrackingReport] = useState<CivicReport | null>(null);

  // Map coordinate selection
  const [mapTargetCoords, setMapTargetCoords] = useState<{ lat: number; lng: number; xPercent: number; yPercent: number } | null>(null);

  // Fetch reports on mount
  useEffect(() => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReports(data);
          // Set default tracking report
          const defaultRep = data.find((r: CivicReport) => r.trackingCode === 'CP-1042') || data[0];
          setTrackingReport(defaultRep);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch reports from server, using local data:', err);
      });
  }, []);

  // Update Report Status
  const handleUpdateReportStatus = async (id: string, newStatus: ReportStatus) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updatedTimeline = [
            ...r.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toISOString(),
              title: `Status Changed to ${newStatus.toUpperCase()}`,
              description: `Status transitioned by municipal dispatcher to ${newStatus.replace('_', ' ')}.`,
              actor: 'Operations Dispatcher',
              actorRole: 'dispatcher' as const,
              statusChange: newStatus
            }
          ];
          return {
            ...r,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            timeline: updatedTimeline
          };
        }
        return r;
      })
    );

    try {
      await fetch(`/api/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error('Failed to sync status update:', err);
    }
  };

  // Update Report Department
  const handleUpdateReportDepartment = async (id: string, department: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, assignedDepartment: department } : r))
    );

    try {
      await fetch(`/api/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedDepartment: department })
      });
    } catch (err) {
      console.error('Failed to sync department update:', err);
    }
  };

  // Confirm Duplicate Merge
  const handleConfirmMerge = async (childId: string, parentId: string) => {
    const parent = reports.find((r) => r.id === parentId);
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === childId) {
          return {
            ...r,
            status: 'triaged',
            duplicateInfo: {
              ...r.duplicateInfo,
              isDuplicate: true,
              parentReportId: parentId,
              confidenceScore: r.duplicateInfo.confidenceScore || 92,
              reasoning: `Merged into Master Work Order #${parent?.trackingCode || 'CP-1042'}. Citizen subscribed to master notifications.`
            }
          };
        }
        return r;
      })
    );

    try {
      await fetch(`/api/reports/${childId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'triaged',
          duplicateInfo: {
            isDuplicate: true,
            parentReportId: parentId
          }
        })
      });
    } catch (err) {
      console.error('Failed to merge duplicate:', err);
    }
  };

  // Reset Data
  const handleResetData = async () => {
    setIsResetting(true);
    try {
      await fetch('/api/reset-data', { method: 'POST' });
      setReports(JSON.parse(JSON.stringify(INITIAL_SYNTHETIC_REPORTS)));
    } catch (err) {
      setReports(JSON.parse(JSON.stringify(INITIAL_SYNTHETIC_REPORTS)));
    } finally {
      setTimeout(() => setIsResetting(false), 400);
    }
  };

  // Navigate to Citizen Tracker
  const handleNavigateToTracker = (code: string) => {
    const found = reports.find(
      (r) => r.trackingCode.toLowerCase() === code.toLowerCase()
    );
    setTrackingCodeQuery(code);
    setTrackingReport(found || null);
    setActiveTab('track');
  };

  // View report on map
  const handleViewOnMap = (coords: { lat: number; lng: number; xPercent: number; yPercent: number }) => {
    setMapTargetCoords(coords);
    setActiveTab('map');
  };

  const criticalCount = reports.filter((r) => r.priority.level === 'critical').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reportCount={reports.length}
        criticalCount={criticalCount}
        onResetData={handleResetData}
        isResetting={isResetting}
      />

      {/* Main View Controller */}
      <main className="flex-1 pb-16">
        {activeTab === 'capture' && (
          <CitizenCapture
            onReportCreated={(newRep) => {
              setReports((prev) => [newRep, ...prev]);
            }}
            onNavigateToTracker={handleNavigateToTracker}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'dashboard' && (
          <MunicipalDashboard
            reports={reports}
            onUpdateReportStatus={handleUpdateReportStatus}
            onUpdateReportDepartment={handleUpdateReportDepartment}
            onOpenDuplicateModal={(rep) => setSelectedDuplicateReport(rep)}
            onOpenActionBriefModal={(rep) => setSelectedActionBriefReport(rep)}
            onViewOnMap={handleViewOnMap}
            onInspectAi={(rep) => setSelectedActionBriefReport(rep)}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveCivicMap
            reports={reports}
            clusters={clusters}
            selectedCoords={mapTargetCoords}
            onOpenActionBriefModal={(rep) => setSelectedActionBriefReport(rep)}
            onOpenDuplicateModal={(rep) => setSelectedDuplicateReport(rep)}
            onUpdateStatus={handleUpdateReportStatus}
          />
        )}

        {activeTab === 'track' && (
          <CitizenTracker
            report={trackingReport || reports[0]}
            trackingCodeQuery={trackingCodeQuery}
            onBackToCapture={() => setActiveTab('capture')}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
            onSelectCode={handleNavigateToTracker}
          />
        )}
      </main>

      {/* Duplicate Modal */}
      {selectedDuplicateReport && (
        <DuplicateDetectorModal
          report={selectedDuplicateReport}
          parentReport={
            reports.find((r) => r.id === selectedDuplicateReport.duplicateInfo.parentReportId) ||
            reports[0]
          }
          onClose={() => setSelectedDuplicateReport(null)}
          onConfirmMerge={handleConfirmMerge}
        />
      )}

      {/* Action Brief Modal */}
      {selectedActionBriefReport && (
        <ActionBriefModal
          report={selectedActionBriefReport}
          onClose={() => setSelectedActionBriefReport(null)}
        />
      )}
    </div>
  );
}
