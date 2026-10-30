import React from 'react';
import { 
  Building2, 
  MapPin, 
  ClipboardList, 
  Search,
  RefreshCw, 
  Download,
  Flame,
  CheckCircle2
} from 'lucide-react';

export type ActiveTab = 'capture' | 'dashboard' | 'map' | 'track';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  reportCount: number;
  criticalCount: number;
  onResetData: () => void;
  isResetting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  reportCount,
  criticalCount,
  onResetData,
  isResetting
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/download-cgk');
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.style.display = 'none';
      tempLink.href = blobUrl;
      tempLink.setAttribute('download', 'cgk.zip');
      document.body.appendChild(tempLink);
      tempLink.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(tempLink);
      }, 500);
    } catch (err) {
      console.error('Blob download failed, trying direct navigation:', err);
      window.location.href = '/api/download-cgk';
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md group-hover:bg-blue-500 transition">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  CivicAction
                </span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-medium border border-blue-400/20">
                  Municipal Ops
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">
                Incident Triage & Rapid Response Platform
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Directly matching PDF: Capture, Triage/Act, Reveal Map, Track) */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('capture')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition cursor-pointer ${
                activeTab === 'capture'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Report Issue</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Triage & Dispatch</span>
              {criticalCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                  {criticalCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>City Map & Hotspots</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition cursor-pointer ${
                activeTab === 'track'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Track Status</span>
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-60 rounded-lg shadow-sm transition cursor-pointer"
              title="Download standalone project ZIP (cgk.zip) for VS Code"
            >
              <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
              <span>{isDownloading ? 'Downloading...' : 'Download cgk.zip'}</span>
            </button>

            <button
              onClick={onResetData}
              disabled={isResetting}
              title="Reset sample reports database"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-blue-400' : ''}`} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sub-bar */}
        <div className="md:hidden flex items-center space-x-1 py-2 overflow-x-auto scrollbar-none border-t border-slate-800">
          <button
            onClick={() => setActiveTab('capture')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'capture' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Report Issue
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Triage ({reportCount})
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'map' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            City Map
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'track' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Track Status
          </button>
        </div>
      </div>
    </header>
  );
};
