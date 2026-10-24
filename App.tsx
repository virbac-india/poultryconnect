import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Award,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Package,
  Phone,
  Settings,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { FarmVisitWorkbench } from './components/FarmVisitWorkbench';
import { OfflineCompendium } from './components/OfflineCompendium';
import { FollowUpManager } from './components/FollowUpManager';
import { OfficerSettingsModal } from './components/OfficerSettingsModal';
import { OfficerAuthModal } from './components/OfficerAuthModal';
import { VIRBAC_POULTRY_PORTFOLIO } from './data/productsCatalog';
import { COMMON_AVIAN_DISEASES } from './data/diseases';
import { FarmVisitRecord, OfficerProfile } from './types/poultry';
import { getInitialSampleVisits } from './utils/calculations';

const DEFAULT_PROFILE: OfficerProfile = {
  officerName: 'Preetam Sangam',
  officerEmail: 'preetamsangam07@gmail.com',
  officerPhone: '+91 98480 12345',
  buUnit: 'Poultry Business Unit',
  region: 'South Region',
  hq: 'Namakkal HQ',
  territory: 'Namakkal & Deccan Poultry Belt',
  currencySymbol: '₹',
  autoTriggerMailtoOnDue: true,
  web3FormsKey: '',
  consultantName: 'Dr. Srinivas Rao, MVSc (Poultry Specialist)',
  consultantPhone: '+91 94401 22334',
  consultantEmail: 'consultant@avianhealth.in',
  isAuthorized: true,
};

const VISITS_STORAGE_KEY = 'avianfield_pro_visits_v2';
const PROFILE_STORAGE_KEY = 'avianfield_pro_profile_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<'workbench' | 'portfolio' | 'compendium' | 'followups'>('workbench');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Officer Profile
  const [officerProfile, setOfficerProfile] = useState<OfficerProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse officer profile from storage:', e);
    }
    return DEFAULT_PROFILE;
  });

  // Recorded Farm Visits
  const [visits, setVisits] = useState<FarmVisitRecord[]>(() => {
    try {
      const saved = localStorage.getItem(VISITS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse visits from storage:', e);
    }
    return getInitialSampleVisits(DEFAULT_PROFILE.officerEmail);
  });

  // Preselected items passed from Compendium into Workbench
  const [preselectedProductIds, setPreselectedProductIds] = useState<string[]>([]);
  const [preselectedDiseaseIds, setPreselectedDiseaseIds] = useState<string[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(officerProfile));
    } catch (e) {
      console.error('Failed to save profile to storage:', e);
    }
  }, [officerProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(visits));
    } catch (e) {
      console.error('Failed to save visits to storage:', e);
    }
  }, [visits]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Calculate follow-ups due count
  const followUpsDueCount = useMemo(() => {
    const now = new Date();
    return visits.filter((v) => v.followUpStatus === 'pending' && new Date(v.followUpDueAt) <= now).length;
  }, [visits]);

  // Check and fire browser push notification if follow-up is due
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const now = new Date();
      const dueVisits = visits.filter(
        (v) => v.followUpStatus === 'pending' && new Date(v.followUpDueAt) <= now && !v.autoMailTriggered
      );
      if (dueVisits.length > 0) {
        const topVisit = dueVisits[0];
        new Notification(`⚡ 7-Day Follow-Up Alert: ${topVisit.farmName}`, {
          body: `Call farmer ${topVisit.farmerName} (${topVisit.farmerPhone}) to check health and body weight response.`,
          icon: '/vite.svg',
        });
      }
    }
  }, [visits]);

  // Visit handlers
  const handleSaveVisit = (newVisit: FarmVisitRecord) => {
    setVisits((prev) => [newVisit, ...prev]);
  };

  const handleUpdateVisit = (updated: FarmVisitRecord) => {
    setVisits((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  };

  const handleDeleteVisit = (id: string) => {
    setVisits((prev) => prev.filter((v) => v.id !== id));
  };

  const handleImportVisits = (imported: FarmVisitRecord[]) => {
    setVisits(imported);
  };

  const handleSelectProductForVisit = (productId: string) => {
    setPreselectedProductIds((prev) => Array.from(new Set([...prev, productId])));
    setActiveTab('workbench');
  };

  const handleSelectDiseaseForVisit = (diseaseId: string) => {
    setPreselectedDiseaseIds((prev) => Array.from(new Set([...prev, diseaseId])));
    const disease = COMMON_AVIAN_DISEASES.find((d) => d.id === diseaseId);
    if (disease && disease.recommendedProductIds.length > 0) {
      setPreselectedProductIds((prev) => Array.from(new Set([...prev, ...disease.recommendedProductIds])));
    }
    setActiveTab('workbench');
  };

  const handleClearPreselected = () => {
    setPreselectedProductIds([]);
    setPreselectedDiseaseIds([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Brand & Virbac Logo */}
          <div className="flex items-center gap-3">
            <img
              src="https://in.virbac.com/assets/virbac/build/images/virbac-logo.03fd5e40.svg"
              alt="Virbac"
              className="h-8 sm:h-9 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="border-l border-slate-200 pl-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-slate-900 sm:text-lg">
                  Poultry <span className="text-blue-700">Connect</span>
                </span>
                <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800 border border-blue-200">
                  {officerProfile.buUnit || 'Poultry BU'}
                </span>
              </div>
              <p className="hidden text-[11px] font-medium text-slate-500 sm:block">
                BO: {officerProfile.officerName} · {officerProfile.hq || 'Namakkal HQ'} · {officerProfile.region || 'South Region'}
              </p>
            </div>
          </div>

          {/* Quick Info & Action Center */}
          <div className="flex items-center gap-2.5">
            {/* Online / Offline status badge */}
            <div
              className={`hidden md:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${
                isOnline
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-amber-200 bg-amber-50 text-amber-800'
              }`}
            >
              {isOnline ? <Wifi className="h-3 w-3 text-emerald-600" /> : <WifiOff className="h-3 w-3 text-amber-600" />}
              <span>{isOnline ? 'Offline Cached (PWA)' : 'Working Offline'}</span>
            </div>

            {/* Follow-up Due Pill Button */}
            {followUpsDueCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('followups')}
                className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-all cursor-pointer shadow-xs animate-pulse"
              >
                <Clock className="h-3.5 w-3.5 text-amber-700" />
                <span>{followUpsDueCount} Due Follow-Up{followUpsDueCount > 1 ? 's' : ''}</span>
              </button>
            )}

            {/* Officer Profile Settings */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
              title="Configure Sales Officer & Consultant Profile"
            >
              <Settings className="h-3.5 w-3.5 text-blue-600" />
              <span className="hidden sm:inline">{officerProfile.officerName.split(' ')[0]}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav className="flex space-x-1 overflow-x-auto border-t border-slate-100 pt-1 pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('workbench')}
              className={`flex items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'workbench'
                  ? 'border-blue-700 text-blue-700 bg-blue-50/70 rounded-t-lg shadow-xs'
                  : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Farm Visit Workbench</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'border-blue-700 text-blue-700 bg-blue-50/70 rounded-t-lg shadow-xs'
                  : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Virbac Portfolio &amp; Rates</span>
              <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-semibold text-slate-700">
                {VIRBAC_POULTRY_PORTFOLIO.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('compendium')}
              className={`flex items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'compendium'
                  ? 'border-blue-700 text-blue-700 bg-blue-50/70 rounded-t-lg shadow-xs'
                  : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Avian Diseases &amp; Autopsy</span>
              <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-semibold text-slate-700">
                {COMMON_AVIAN_DISEASES.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('followups')}
              className={`flex items-center gap-2 border-b-2 px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'followups'
                  ? 'border-blue-700 text-blue-700 bg-blue-50/70 rounded-t-lg shadow-xs'
                  : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>7-Day Follow-Up CRM</span>
              {followUpsDueCount > 0 && (
                <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-bold text-white animate-pulse">
                  {followUpsDueCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        {activeTab === 'workbench' && (
          <FarmVisitWorkbench
            products={VIRBAC_POULTRY_PORTFOLIO}
            officerProfile={officerProfile}
            preselectedProductIds={preselectedProductIds}
            preselectedDiseaseIds={preselectedDiseaseIds}
            onClearPreselected={handleClearPreselected}
            onSaveVisit={handleSaveVisit}
            onNavigateToFollowUps={() => setActiveTab('followups')}
          />
        )}

        {(activeTab === 'portfolio' || activeTab === 'compendium') && (
          <OfflineCompendium
            products={VIRBAC_POULTRY_PORTFOLIO}
            diseases={COMMON_AVIAN_DISEASES}
            onSelectProductForVisit={handleSelectProductForVisit}
            onSelectDiseaseForVisit={handleSelectDiseaseForVisit}
            onNavigateToWorkbench={() => setActiveTab('workbench')}
          />
        )}

        {activeTab === 'followups' && (
          <FollowUpManager
            visits={visits}
            officerProfile={officerProfile}
            onUpdateVisit={handleUpdateVisit}
            onDeleteVisit={handleDeleteVisit}
            onImportVisits={handleImportVisits}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500 shadow-xs">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-bold text-slate-800">Poultry Connect</span>
            <span className="hidden sm:inline">·</span>
            <span>Virbac Animal Health India · Sales Officer Field Productivity Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Verified Visual Aid Portfolio SKUs</span>
            <span>·</span>
            <span>Technical Consultant: {officerProfile.consultantName}</span>
          </div>
        </div>
      </footer>

      {/* Field Officer Authorization Screen for GitHub Pages */}
      <OfficerAuthModal
        isOpen={!officerProfile.isAuthorized}
        onAuthorize={setOfficerProfile}
        currentProfile={officerProfile}
      />

      {/* Profile & Settings Modal */}
      <OfficerSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={officerProfile}
        onSaveProfile={setOfficerProfile}
      />
    </div>
  );
}
