import React, { useRef } from 'react';
import { Printer, X, Download, CheckCircle2, AlertTriangle, Calendar, Phone, Mail, MapPin, Building, ShieldCheck } from 'lucide-react';
import { FarmVisitRecord, OfficerProfile } from '../types/poultry';
import { formatQuantity } from '../utils/calculations';

interface PrintFarmerReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: FarmVisitRecord;
  officerProfile: OfficerProfile;
}

export const PrintFarmerReportModal: React.FC<PrintFarmerReportModalProps> = ({
  isOpen,
  onClose,
  visit,
  officerProfile,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const visitDateFormatted = new Date(visit.recordedAt).toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
      {/* Container: Modal with Print Dialog Controls */}
      <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Bar (hidden on print) */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3.5 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-blue-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Farmer Consultation &amp; Prescription Report (Print Preview)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content (Styled specifically for pristine white A4 printing) */}
        <div className="max-h-[82vh] overflow-y-auto p-4 sm:p-8 bg-slate-100 print:max-h-none print:overflow-visible print:p-0 print:bg-white">
          <div
            ref={printAreaRef}
            className="mx-auto max-w-3xl rounded-xl bg-white p-6 sm:p-8 text-slate-900 shadow-xs print:shadow-none print:p-6 print:max-w-none print:rounded-none border border-slate-200 print:border-none"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {/* Header: Virbac Logo & Report Title */}
            <div className="border-b-2 border-blue-700 pb-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://in.virbac.com/assets/virbac/build/images/virbac-logo.03fd5e40.svg"
                    alt="Virbac Animal Health"
                    className="h-10 sm:h-12 w-auto object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="border-l-2 border-slate-300 pl-3">
                    <h1 className="text-xl font-black tracking-tight text-slate-900">
                      Poultry Connect
                    </h1>
                    <p className="text-xs font-semibold text-blue-800 tracking-wide">
                      Virbac Field Health Advisory &amp; Commercial Prescription
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">Visit Reference: #{visit.id.slice(0, 10).toUpperCase()}</p>
                  <p className="tabular-nums">{visitDateFormatted}</p>
                </div>
              </div>

              {/* Business Officer (BO) Information Banner */}
              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-700 border border-slate-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="font-bold text-slate-900 block">Business Officer (BO):</span>
                    <span>{visit.boName || officerProfile.officerName}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">HQ &amp; Region:</span>
                    <span>{visit.hq || officerProfile.hq || 'HQ'} · {visit.region || officerProfile.region || 'Region'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Business Unit:</span>
                    <span>{visit.buUnit || officerProfile.buUnit || 'Poultry BU'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Contact:</span>
                    <span>{visit.boPhone || officerProfile.officerPhone}</span>
                    <span className="block text-[11px] text-slate-500 truncate">{visit.boEmail || officerProfile.officerEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Farm & Customer Information */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200 text-xs">
              <div>
                <h3 className="font-bold uppercase tracking-wider text-blue-900 text-[11px] mb-1.5">
                  Farm &amp; Customer Details
                </h3>
                <p className="text-sm font-bold text-slate-900">{visit.farmName}</p>
                <p className="font-semibold text-slate-700">Farmer: {visit.farmerName}</p>
                <p className="text-slate-600">Phone: {visit.farmerPhone}</p>
                {visit.villageLocation && <p className="text-slate-600">Location: {visit.villageLocation}</p>}
              </div>

              <div>
                <h3 className="font-bold uppercase tracking-wider text-blue-900 text-[11px] mb-1.5">
                  Flock &amp; Shed Audit
                </h3>
                <p>
                  <strong className="text-slate-800">Flock Category: </strong>
                  {visit.birdType} ({visit.birdType === 'Broiler' ? `Day ${visit.ageValue}` : `Week ${visit.ageValue}`})
                </p>
                <p>
                  <strong className="text-slate-800">Flock Size: </strong>
                  {visit.flockSize.toLocaleString()} birds
                </p>
                <p>
                  <strong className="text-slate-800">Season Observed: </strong>
                  {visit.seasonObserved}
                </p>
              </div>
            </div>

            {/* Production / Growth Assessment Banner (Broiler vs Layer) */}
            <div className="mt-4">
              {visit.birdType === 'Layer' && (visit.targetEggPct || 0) > 0 ? (
                <div
                  className={`rounded-lg p-3.5 border text-xs ${
                    (visit.observedEggPct || 0) >= (visit.targetEggPct || 0)
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {(visit.observedEggPct || 0) >= (visit.targetEggPct || 0) ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                      )}
                      <div>
                        <h4 className="font-bold text-sm">
                          {(visit.observedEggPct || 0) >= (visit.targetEggPct || 0)
                            ? '🌟 Optimal Layer Performance: Target Hen-Day Lay Achieved!'
                            : '⚠️ Layer Production Alert: Hen-Day Lay Deficit & Revenue Loss'}
                        </h4>
                        <p className="mt-0.5">
                          Observed Lay: <strong>{visit.observedEggPct}%</strong> vs Target Benchmark:{' '}
                          <strong>{visit.targetEggPct}%</strong> (Variance:{' '}
                          {((visit.observedEggPct || 0) - (visit.targetEggPct || 0)).toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Deficit details for layers */}
                  {(visit.observedEggPct || 0) < (visit.targetEggPct || 0) && (
                    <div className="mt-2.5 pt-2 border-t border-amber-200">
                      <p className="font-semibold text-amber-900">
                        Daily Deficit: -{visit.dailyEggDeficit || Math.round((visit.flockSize * ((visit.targetEggPct || 0) - (visit.observedEggPct || 0))) / 100)} eggs/day | Estimated Financial Loss: ₹{(visit.dailyFinancialLoss || Math.round(((visit.dailyEggDeficit || 100) * 5.5))).toLocaleString()}/day (~₹{(visit.monthlyFinancialLoss || Math.round(((visit.dailyFinancialLoss || 550) * 30))).toLocaleString()}/month)
                      </p>
                      <p className="mt-1 text-[11px] text-amber-800">
                        <strong>Prescribed Action: </strong>
                        Administer Calgophos (acidic liquid minerals) + Chelated OstoVet Forte / Vitablend WMF to eliminate shell hairline cracks, restore medullary calcium, and recover peak production.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`rounded-lg p-3.5 border text-xs ${
                    visit.weightStatus === 'optimal'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {visit.weightStatus === 'optimal' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                      )}
                      <div>
                        <h4 className="font-bold text-sm">
                          {visit.weightStatus === 'optimal'
                            ? '🌟 Excellent Growth Performance: Standard Body Weight Achieved!'
                            : '⚠️ Growth Performance Alert: Flock Underweight Deficit Identified'}
                        </h4>
                        <p className="mt-0.5">
                          Observed Body Weight: <strong>{visit.observedBW} g</strong> vs Virbac Target Benchmark:{' '}
                          <strong>{visit.targetBW} g</strong> ({((visit.observedBW / visit.targetBW) * 100).toFixed(1)}% Achievement)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reasons if underweight */}
                  {visit.weightStatus === 'underweight' && (
                    <div className="mt-2.5 pt-2 border-t border-amber-200">
                      <p className="font-semibold text-amber-900">
                        Deficit: -{visit.weightDeficitGrams} g/bird | Estimated Catch-Up Feed Required: ~{visit.extraFeedFlockKg.toFixed(0)} kg for entire flock
                      </p>
                      {visit.selectedReasonIds && visit.selectedReasonIds.length > 0 && (
                        <p className="mt-1 text-[11px] text-amber-800">
                          <strong>Probable Seasonal Factors Identified: </strong>
                          High heat stress / thermal alkalosis / ventilation drafts affecting nutrient conversion.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Prescribed Virbac Healthcare Products Table */}
            <div className="mt-5">
              <h3 className="font-bold uppercase tracking-wider text-emerald-800 text-xs mb-2">
                Prescribed Virbac Products &amp; Administration Schedule
              </h3>

              <div className="overflow-x-auto rounded-lg border border-slate-300">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300">
                    <tr>
                      <th className="p-2">Product &amp; SKU</th>
                      <th className="p-2">Dosage Rate</th>
                      <th className="p-2">Days</th>
                      <th className="p-2">Total Qty</th>
                      <th className="p-2">Packs</th>
                      <th className="p-2 text-right">Cost/Bird</th>
                      <th className="p-2 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {visit.selectedProducts.map((p, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="p-2 font-medium">
                          <div className="font-bold text-slate-900">{p.productName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {p.packName} (Code: {p.skuCode})
                          </div>
                        </td>
                        <td className="p-2">
                          {p.doseRate} {p.doseUnit}
                          <span className="block text-[10px] text-slate-500">
                            {p.dosageBasis === 'per_100_birds'
                              ? 'per 100 birds'
                              : p.dosageBasis === 'per_1000_birds'
                              ? 'per 1000 birds'
                              : 'per L water'}
                          </span>
                        </td>
                        <td className="p-2 font-bold">{p.days}d</td>
                        <td className="p-2 tabular-nums">{formatQuantity(p.totalQuantity, p.doseUnit)}</td>
                        <td className="p-2 font-bold text-emerald-800 tabular-nums">
                          {p.packsRounded} pack{p.packsRounded > 1 ? 's' : ''}
                        </td>
                        <td className="p-2 text-right tabular-nums font-semibold">₹{p.costPerBird.toFixed(2)}</td>
                        <td className="p-2 text-right tabular-nums font-bold text-slate-900">
                          ₹{p.totalPackCostMrp.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900">
                    <tr>
                      <td colSpan={5} className="p-2 text-right uppercase text-[11px]">
                        Total Flock Health Investment:
                      </td>
                      <td className="p-2 text-right text-emerald-800 font-extrabold">
                        ₹{visit.totalCostPerBird.toFixed(2)}/bird
                      </td>
                      <td className="p-2 text-right text-emerald-800 font-extrabold text-sm">
                        ₹{visit.totalPrescriptionCost.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Field Notes & Special Instructions */}
            {visit.fieldNotes && (
              <div className="mt-4 rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block mb-0.5">Field Instructions &amp; Farm Advisory:</span>
                <p className="text-slate-700 italic">"{visit.fieldNotes}"</p>
              </div>
            )}

            {/* Poultry Consultant Referral (if applicable) */}
            {visit.consultantReferred && (
              <div className="mt-3 rounded-lg bg-sky-50 p-3 border border-sky-200 text-xs">
                <span className="font-bold text-sky-900 block">
                  Technical Poultry Vet Referral: {officerProfile.consultantName}
                </span>
                <p className="text-slate-600 mt-0.5">
                  Direct Line: {officerProfile.consultantPhone} | Email: {officerProfile.consultantEmail}
                </p>
              </div>
            )}

            {/* Scheduled 7-Day Follow-Up Notice */}
            <div className="mt-4 p-2.5 rounded-lg border border-slate-300 bg-emerald-50/50 text-[11px] text-slate-700 flex items-center justify-between">
              <span>
                <strong>Automated 7-Day Follow-Up: </strong>
                Sales officer will contact on{' '}
                <strong>{new Date(visit.followUpDueAt).toLocaleDateString()}</strong> to review body weight &amp; health response.
              </span>
              <span className="font-semibold text-emerald-800">Virbac Customer Assurance</span>
            </div>

            {/* Signatures */}
            <div className="mt-8 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-center">
              <div>
                <div className="h-10 border-b border-dashed border-slate-400"></div>
                <p className="mt-1.5 font-bold text-slate-800">
                  {visit.boName || officerProfile.officerName}
                </p>
                <p className="text-[11px] text-slate-500">Business Officer (BO) — Virbac India</p>
              </div>

              <div>
                <div className="h-10 border-b border-dashed border-slate-400"></div>
                <p className="mt-1.5 font-bold text-slate-800">{visit.farmerName}</p>
                <p className="text-[11px] text-slate-500">Farm Supervisor / Poultry Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
