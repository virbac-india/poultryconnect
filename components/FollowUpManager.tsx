import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  Search,
  CheckCircle2,
  AlertCircle,
  FileDown,
  FileUp,
  Download,
  Filter,
  Trash2,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Send,
  Building,
  Printer,
  Egg,
  Scale,
} from 'lucide-react';
import { BirdType, FarmVisitRecord, OfficerProfile } from '../types/poultry';
import { PrintFarmerReportModal } from './PrintFarmerReportModal';
import {
  downloadFollowUpCalendarICS,
  exportVisitsAsJSON,
  importVisitsFromJSON,
  triggerFollowUpEmail,
} from '../utils/calculations';

interface FollowUpManagerProps {
  visits: FarmVisitRecord[];
  officerProfile: OfficerProfile;
  onUpdateVisit: (updated: FarmVisitRecord) => void;
  onDeleteVisit: (visitId: string) => void;
  onImportVisits: (imported: FarmVisitRecord[]) => void;
  onNavigateToWorkbenchWithVisit?: (visit: FarmVisitRecord) => void;
}

export const FollowUpManager: React.FC<FollowUpManagerProps> = ({
  visits,
  officerProfile,
  onUpdateVisit,
  onDeleteVisit,
  onImportVisits,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'due' | 'pending' | 'completed'>('all');
  const [activeCallModalVisit, setActiveCallModalVisit] = useState<FarmVisitRecord | null>(null);
  const [callNotesInput, setCallNotesInput] = useState('');
  const [printVisit, setPrintVisit] = useState<FarmVisitRecord | null>(null);

  const now = new Date();

  // Categorize and filter visits
  const filteredVisits = useMemo(() => {
    return visits.filter((v) => {
      const dueDate = new Date(v.followUpDueAt);
      const isDue = v.followUpStatus === 'pending' && dueDate <= now;

      // Status match
      if (statusFilter === 'due' && !isDue) return false;
      if (statusFilter === 'pending' && (v.followUpStatus !== 'pending' || isDue)) return false;
      if (statusFilter === 'completed' && v.followUpStatus !== 'completed') return false;

      // Search match
      if (searchQuery.trim() === '') return true;
      const q = searchQuery.toLowerCase();
      return (
        v.farmerName.toLowerCase().includes(q) ||
        v.farmName.toLowerCase().includes(q) ||
        v.farmerPhone.toLowerCase().includes(q) ||
        v.villageLocation.toLowerCase().includes(q) ||
        v.selectedProducts.some((p) => p.productName.toLowerCase().includes(q))
      );
    });
  }, [visits, searchQuery, statusFilter, now]);

  // Statistics
  const stats = useMemo(() => {
    let dueCount = 0;
    let pendingCount = 0;
    let completedCount = 0;

    visits.forEach((v) => {
      if (v.followUpStatus === 'completed') {
        completedCount++;
      } else {
        const due = new Date(v.followUpDueAt);
        if (due <= now) {
          dueCount++;
        } else {
          pendingCount++;
        }
      }
    });

    return { total: visits.length, dueCount, pendingCount, completedCount };
  }, [visits, now]);

  // Handle Mark Call Completed
  const handleSaveCallNotes = () => {
    if (!activeCallModalVisit) return;
    const updated: FarmVisitRecord = {
      ...activeCallModalVisit,
      followUpStatus: 'completed',
      followUpCompletedAt: new Date().toISOString(),
      followUpCallNotes: callNotesInput.trim() || 'Call completed with farmer; verified health recovery.',
    };
    onUpdateVisit(updated);
    setActiveCallModalVisit(null);
    setCallNotesInput('');
  };

  // Handle Import JSON
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const imported = importVisitsFromJSON(content);
      if (imported && imported.length > 0) {
        onImportVisits(imported);
        alert(`Successfully imported ${imported.length} farm visit records!`);
      } else {
        alert('Invalid file format. Please upload a valid JSON backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner — Pure White Card with Refined Texture and Accents */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                100% Client-Authoritative · Works Offline
              </span>
              <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                7-Day Call &amp; Email Trigger
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              7-Day Farm Visit Follow-Up CRM
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
              Maintain comprehensive records of every farm visit with exact timestamps. After 7 days, trigger automated follow-up emails and phone calls to evaluate flock response, reinforce farmer confidence, and secure re-orders.
            </p>
          </div>

          {/* Export / Import Backup */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => exportVisitsAsJSON(visits)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="h-4 w-4 text-emerald-600" />
              Backup Data (JSON)
            </button>
            <label className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs">
              <FileUp className="h-4 w-4 text-blue-600" />
              Restore Backup
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
          </div>
        </div>

        {/* Quick Metric Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Recorded Visits</p>
            <p className="mt-1 text-2xl font-black text-slate-900 tabular-nums">{stats.total}</p>
          </div>
          <div
            onClick={() => setStatusFilter('due')}
            className="rounded-xl border border-amber-300 bg-amber-50/70 p-3.5 cursor-pointer hover:bg-amber-100/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">Due for Follow-Up Now</p>
              <Clock className="h-4 w-4 text-amber-600 animate-pulse" />
            </div>
            <p className="mt-1 text-2xl font-black text-amber-800 tabular-nums">{stats.dueCount}</p>
          </div>
          <div
            onClick={() => setStatusFilter('pending')}
            className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 cursor-pointer hover:bg-blue-100/50 transition-colors"
          >
            <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Scheduled Ahead (&lt;7d)</p>
            <p className="mt-1 text-2xl font-black text-blue-800 tabular-nums">{stats.pendingCount}</p>
          </div>
          <div
            onClick={() => setStatusFilter('completed')}
            className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 cursor-pointer hover:bg-emerald-100/50 transition-colors"
          >
            <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Follow-Ups Completed</p>
            <p className="mt-1 text-2xl font-black text-emerald-800 tabular-nums">{stats.completedCount}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by farmer name, farm, phone, location, product..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(['all', 'due', 'pending', 'completed'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-2 text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {st === 'all' ? 'All Visits' : st === 'due' ? '⚡ Due Now' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Visits List */}
      {filteredVisits.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <Calendar className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-3 text-lg font-bold text-slate-800">No Farm Visits Match Criteria</h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchQuery
              ? 'Try modifying your search or clear filters.'
              : 'Save visits in the Farm Visit Workbench to track 7-day follow-ups automatically.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVisits.map((visit) => {
            const recorded = new Date(visit.recordedAt);
            const due = new Date(visit.followUpDueAt);
            const isDueNow = visit.followUpStatus === 'pending' && due <= now;
            const isCompleted = visit.followUpStatus === 'completed';
            const isLayer = visit.birdType === BirdType.Layer;

            return (
              <div
                key={visit.id}
                className={`rounded-2xl border p-5 transition-all shadow-xs ${
                  isDueNow
                    ? 'border-amber-300 bg-amber-50/20'
                    : isCompleted
                    ? 'border-emerald-200 bg-white'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  {/* Left Column: Farm Details */}
                  <div className="flex-1 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-lg text-slate-900">{visit.farmName}</span>
                      <span className="text-slate-300 font-bold">·</span>
                      <span className="text-sm font-bold text-blue-700">{visit.farmerName}</span>
                      {visit.villageLocation && (
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                          {visit.villageLocation}
                        </span>
                      )}
                      {isDueNow && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-black text-amber-900 border border-amber-300 animate-pulse">
                          ⚡ 7-Day Follow-Up Due
                        </span>
                      )}
                      {isCompleted && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-900 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-700" /> Follow-Up Completed
                        </span>
                      )}
                    </div>

                    {/* Criteria: Differentiates Layer (Egg Production %, Deficit, Loss) vs Broiler (Weight Deficit) */}
                    {isLayer ? (
                      <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 space-y-1.5 text-xs text-slate-800">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="inline-flex items-center gap-1 font-bold text-blue-950">
                            <Egg className="h-3.5 w-3.5 text-blue-700" />
                            Flock: {visit.flockSize.toLocaleString()} Layers (Week {visit.ageValue})
                          </span>
                          <span>
                            <strong className="text-slate-600">Hen-Day Lay: </strong>
                            <span className="font-bold text-blue-900">
                              {visit.observedEggPct ?? Math.round(((visit.observedEggCount || 0) / visit.flockSize) * 100)}%
                            </span>{' '}
                            (Benchmark Target: {visit.targetEggPct ?? 92}%)
                          </span>
                          <span>
                            <strong className="text-slate-600">Daily Deficit: </strong>
                            <span className="font-bold text-red-700">
                              {visit.dailyEggDeficit && visit.dailyEggDeficit > 0
                                ? `-${visit.dailyEggDeficit.toLocaleString()} eggs/day`
                                : 'On Target'}
                            </span>
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 border-t border-blue-200/60 text-[11px]">
                          <span>
                            <strong className="text-slate-600">Financial Impact: </strong>
                            <strong className="text-red-700 font-mono">
                              ₹{(visit.dailyFinancialLoss ?? 0).toLocaleString()}/day
                            </strong>{' '}
                            (₹{(visit.monthlyFinancialLoss ?? 0).toLocaleString()}/month)
                          </span>
                          {visit.selectedLayerIssueIds && visit.selectedLayerIssueIds.length > 0 && (
                            <span>
                              <strong className="text-slate-600">Problems Noted: </strong>
                              <span className="text-amber-900 font-semibold">
                                {visit.selectedLayerIssueIds.join(', ')}
                              </span>
                            </span>
                          )}
                          <span>
                            <strong className="text-slate-600">Season: </strong>
                            {visit.seasonObserved}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-700">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-900">
                          <Scale className="h-3.5 w-3.5 text-emerald-700" />
                          Flock: {visit.flockSize.toLocaleString()} Broilers (Day {visit.ageValue})
                        </span>
                        <span>
                          <strong className="text-slate-600">Weight: </strong>
                          {visit.observedBW}g (Target: {visit.targetBW}g)
                        </span>
                        <span
                          className={`font-bold ${
                            visit.weightStatus === 'optimal' ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {visit.weightStatus === 'optimal'
                            ? 'Optimal Growth'
                            : `Underweight (-${visit.weightDeficitGrams}g)`}
                        </span>
                        <span>
                          <strong className="text-slate-600">Season: </strong>
                          {visit.seasonObserved}
                        </span>
                      </div>
                    )}

                    {/* Prescribed Products */}
                    <div className="pt-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Prescribed Virbac Products:
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {visit.selectedProducts.map((p, idx) => (
                          <span
                            key={idx}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-800 font-medium"
                          >
                            <strong>{p.productName}</strong> ({p.packName} · {p.days}d)
                          </span>
                        ))}
                        <span className="rounded-lg bg-emerald-50 border border-emerald-300 px-2 py-0.5 text-xs font-black text-emerald-800">
                          Est. Cost: ₹{visit.totalPrescriptionCost.toLocaleString()} (₹{visit.totalCostPerBird.toFixed(2)}/bird)
                        </span>
                      </div>
                    </div>

                    {/* Field & Follow-up Notes */}
                    {visit.fieldNotes && (
                      <p className="text-xs text-slate-700 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        "{visit.fieldNotes}"
                      </p>
                    )}
                    {visit.followUpCallNotes && (
                      <div className="text-xs text-emerald-950 bg-emerald-50 p-2.5 rounded-xl border border-emerald-300">
                        <strong className="text-emerald-900">Follow-up call notes: </strong> {visit.followUpCallNotes}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Timestamps & Action Buttons */}
                  <div className="flex flex-col gap-2.5 lg:w-72 lg:border-l lg:border-slate-200 lg:pl-5">
                    <div className="text-xs text-slate-700 space-y-0.5">
                      <p className="text-slate-500">
                        Recorded:{' '}
                        <strong className="text-slate-900">
                          {recorded.toLocaleDateString()} {recorded.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </strong>
                      </p>
                      <p className={isDueNow ? 'text-amber-800 font-bold' : 'text-slate-500'}>
                        7d Due Date:{' '}
                        <strong className={isDueNow ? 'text-amber-900' : 'text-slate-900'}>
                          {due.toLocaleDateString()} {due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </strong>
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {visit.farmerPhone && (
                        <a
                          href={`tel:${visit.farmerPhone}`}
                          className="inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>Call Farmer</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => triggerFollowUpEmail(visit, officerProfile)}
                        className="inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors cursor-pointer shadow-2xs"
                        title="Triggers pre-formatted follow-up mailto client"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Trigger Mail</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadFollowUpCalendarICS(visit, officerProfile)}
                        className="inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                        title="Downloads .ics event to sync with phone calendar"
                      >
                        <Calendar className="h-3.5 w-3.5 text-emerald-700" />
                        <span>Calendar (.ics)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveCallModalVisit(visit);
                          setCallNotesInput(visit.followUpCallNotes || '');
                        }}
                        className={`inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer shadow-2xs ${
                          isCompleted
                            ? 'border border-emerald-300 bg-emerald-50 text-emerald-800'
                            : 'border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                        }`}
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>{isCompleted ? 'Edit Call Notes' : 'Log Call Done'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPrintVisit(visit)}
                        className="col-span-2 inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs"
                        title="Prints or exports PDF farmer advisory with BO details"
                      >
                        <Printer className="h-3.5 w-3.5 text-emerald-700" />
                        <span>Print Farmer Report (BO &amp; Farm Record)</span>
                      </button>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete visit record for ${visit.farmName}?`)) {
                            onDeleteVisit(visit.id);
                          }
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Remove record</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Log Follow-Up Call Notes (Clean White Card Theme) */}
      {activeCallModalVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Phone className="h-5 w-5 text-emerald-700" />
              Complete 7-Day Follow-Up Call
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Farm: <strong className="text-slate-900">{activeCallModalVisit.farmName}</strong> ({activeCallModalVisit.farmerName})
            </p>

            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Call Outcome &amp; Farmer Response:
              </label>
              <textarea
                rows={4}
                value={callNotesInput}
                onChange={(e) => setCallNotesInput(e.target.value)}
                placeholder="e.g. Spoke with farmer. Production stabilized and egg shell quality restored with Calgophos and Chelated OstoVet Forte. Farmer satisfied, scheduled follow-up order."
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveCallModalVisit(null)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCallNotes}
                className="rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 transition-colors cursor-pointer shadow-xs"
              >
                Save &amp; Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Farmer Advisory & Prescription Modal */}
      {printVisit && (
        <PrintFarmerReportModal
          isOpen={Boolean(printVisit)}
          onClose={() => setPrintVisit(null)}
          visit={printVisit}
          officerProfile={officerProfile}
        />
      )}
    </div>
  );
};
