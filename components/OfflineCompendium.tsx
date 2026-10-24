import React, { useMemo, useState } from 'react';
import {
  Search,
  Stethoscope,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Info,
  CheckCircle2,
  Tag,
  Filter,
} from 'lucide-react';
import { BirdType, DiseaseEntry, ProductItem } from '../types/poultry';

interface OfflineCompendiumProps {
  products: ProductItem[];
  diseases: DiseaseEntry[];
  onSelectProductForVisit: (productId: string) => void;
  onSelectDiseaseForVisit: (diseaseId: string) => void;
  onNavigateToWorkbench: () => void;
}

export const OfflineCompendium: React.FC<OfflineCompendiumProps> = ({
  products,
  diseases,
  onSelectProductForVisit,
  onSelectDiseaseForVisit,
  onNavigateToWorkbench,
}) => {
  const [activeSection, setActiveSection] = useState<'portfolio' | 'diseases'>('portfolio');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBirdFilter, setSelectedBirdFilter] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ['All', ...cats];
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.positioning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.composition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.skus.some(
          (s) =>
            s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.packName.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesBird =
        selectedBirdFilter === 'All' ||
        (selectedBirdFilter === 'Broiler' && p.birdTypes.includes(BirdType.Broiler)) ||
        (selectedBirdFilter === 'Layer' && p.birdTypes.includes(BirdType.Layer));

      return matchesSearch && matchesCat && matchesBird;
    });
  }, [products, searchQuery, selectedCategory, selectedBirdFilter]);

  // Filtered diseases
  const filteredDiseases = useMemo(() => {
    return diseases.filter((d) => {
      const matchesSearch =
        searchQuery === '' ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.aliases.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
        d.causativeAgent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.symptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesBird =
        selectedBirdFilter === 'All' ||
        (selectedBirdFilter === 'Broiler' && d.affectedBirds.includes(BirdType.Broiler)) ||
        (selectedBirdFilter === 'Layer' && d.affectedBirds.includes(BirdType.Layer));

      return matchesSearch && matchesBird;
    });
  }, [diseases, searchQuery, selectedBirdFilter]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Portfolio Header — Clean White Card with Texture & Blue/Emerald Accents */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img
                src="https://in.virbac.com/assets/virbac/build/images/virbac-logo.03fd5e40.svg"
                alt="Virbac"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                100% Offline Accessible
              </span>
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800 border border-blue-200">
                PDF-Verified SKUs &amp; 2026 Rate List
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Poultry Connect <span className="text-slate-300 font-light">|</span> Product Portfolio &amp; Pathology Guide
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
              Equip your field discussions with official Virbac Visual Aid positioning, precise presentation SKU packs &amp; pricing (PTR &amp; MRP), pathology findings, and differential diagnosis to advise poultry farmers confidently.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveSection('portfolio')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'portfolio'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Package className="h-4 w-4" />
              Product Portfolio ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('diseases')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'diseases'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Stethoscope className="h-4 w-4" />
              Avian Diseases ({diseases.length})
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-12 pt-4 border-t border-slate-100">
          <div className="relative sm:col-span-6">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeSection === 'portfolio'
                  ? 'Search by brand (e.g. Calgophos, Brotone), SKU code, active ingredient...'
                  : 'Search by disease name, symptom, lesion, or pathogen...'
              }
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-2xs"
            />
          </div>

          <div className="sm:col-span-3">
            {activeSection === 'portfolio' ? (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter products by therapeutic category"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 focus:border-blue-600 focus:outline-none shadow-2xs"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Therapeutic Categories' : c}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex h-full items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-600 font-medium">
                <Filter className="mr-1.5 h-3.5 w-3.5 text-slate-500" /> Filter by flock type
              </div>
            )}
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedBirdFilter}
              onChange={(e) => setSelectedBirdFilter(e.target.value)}
              aria-label="Filter by bird target type"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 focus:border-blue-600 focus:outline-none shadow-2xs"
            >
              <option value="All">All Birds (Broiler &amp; Layer)</option>
              <option value="Broiler">Broiler Flocks Only</option>
              <option value="Layer">Commercial Layer Flocks Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 1: PRODUCT PORTFOLIO */}
      {activeSection === 'portfolio' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium px-1">
            <span>
              Showing <strong>{filteredProducts.length}</strong> of {products.length} Virbac portfolio products
            </span>
            <span className="text-slate-500">
              Only specific SKUs from Visual Aid PDFs shown with official PTR &amp; MRP
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filteredProducts.map((p) => {
              const isExpanded = expandedId === p.id;
              return (
                <div
                  key={p.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <div>
                    {/* Header: Name, Category, Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-800 border border-blue-100">
                            {p.category}
                          </span>
                          {p.birdTypes.map((bt) => (
                            <span
                              key={bt}
                              className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 font-semibold"
                            >
                              {bt}
                            </span>
                          ))}
                        </div>
                        <h3 className="mt-1.5 text-lg font-black text-slate-900 tracking-tight">
                          {p.name}
                        </h3>
                      </div>
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-mono font-bold text-slate-700 border border-slate-200">
                        {p.shortCode}
                      </span>
                    </div>

                    {/* PDF Visual Aid Tagline / Positioning */}
                    <div className="mt-3 rounded-xl border-l-4 border-blue-600 bg-blue-50/70 p-3 text-xs italic text-blue-950 font-medium">
                      "{p.positioning}"
                    </div>

                    {/* Composition */}
                    <div className="mt-3 text-xs leading-relaxed text-slate-700">
                      <span className="font-bold text-slate-900">Active Composition: </span>
                      {p.composition}
                    </div>

                    {/* Key Benefits */}
                    <div className="mt-3 space-y-1.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Key Value Proposition for Farmers:
                      </p>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {p.keyBenefits.slice(0, isExpanded ? p.keyBenefits.length : 2).map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-600" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      {p.keyBenefits.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : p.id)}
                          className="mt-1 text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
                        >
                          {isExpanded ? 'Show less' : `+${p.keyBenefits.length - 2} more benefits`}
                        </button>
                      )}
                    </div>

                    {/* Suggestive Usage & Standard Dose */}
                    <div className="mt-3.5 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-800 border border-slate-200">
                      <span className="font-bold text-blue-900">Standard Dosage: </span>
                      {p.suggestiveUsage}
                    </div>

                    {/* Exact SKUs Table from CSV (Filtered strictly to PDF presentation packs) */}
                    <div className="mt-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Approved Presentation SKUs &amp; Rates (Rate List 24.10.26):
                      </p>
                      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/40">
                        <table className="w-full text-left text-xs">
                          <thead className="border-b border-slate-200 bg-slate-100 text-[10px] uppercase font-bold tracking-wider text-slate-600">
                            <tr>
                              <th className="px-3 py-2">SKU Code</th>
                              <th className="px-3 py-2">Presentation Pack</th>
                              <th className="px-3 py-2 text-right">PTR (₹)</th>
                              <th className="px-3 py-2 text-right font-black text-emerald-800">MRP (₹)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 text-slate-800 bg-white">
                            {p.skus.map((sku) => (
                              <tr key={sku.code} className="hover:bg-slate-50">
                                <td className="px-3 py-2 font-mono text-[11px] font-semibold text-slate-600">
                                  {sku.code}
                                </td>
                                <td className="px-3 py-2 font-bold text-slate-900">{sku.packName}</td>
                                <td className="px-3 py-2 text-right tabular-nums text-slate-600 font-medium">
                                  ₹{sku.ptr.toFixed(2)}
                                </td>
                                <td className="px-3 py-2 text-right tabular-nums font-black text-emerald-700">
                                  ₹{sku.mrp.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      Default regimen: <strong className="text-slate-800">{p.defaultDays} days</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProductForVisit(p.id);
                        onNavigateToWorkbench();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-xs cursor-pointer"
                    >
                      <span>Prescribe in Visit</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: AVIAN DISEASES */}
      {activeSection === 'diseases' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium px-1">
            <span>
              Showing <strong>{filteredDiseases.length}</strong> common poultry pathology &amp; diagnostic guides
            </span>
            <span className="text-slate-500">Differential diagnosis, necropsy lesions, and targeted Virbac Rx</span>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filteredDiseases.map((d) => (
              <div
                key={d.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            d.severity === 'Critical'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : d.severity === 'High'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {d.severity} Risk
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 font-semibold">
                          {d.etiology}
                        </span>
                        {d.affectedBirds.map((bt) => (
                          <span
                            key={bt}
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 font-medium"
                          >
                            {bt}
                          </span>
                        ))}
                      </div>
                      <h3 className="mt-1.5 text-lg font-black text-slate-900 tracking-tight">
                        {d.name}
                      </h3>
                      {d.aliases.length > 0 && (
                        <p className="text-xs text-slate-500">
                          Also known as: {d.aliases.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pathogen */}
                  <div className="mt-2.5 text-xs text-slate-700">
                    <span className="font-bold text-slate-900">Causative Pathogen: </span>
                    <span className="italic text-slate-800">{d.causativeAgent}</span>
                  </div>

                  {/* Clinical Symptoms */}
                  <div className="mt-3 rounded-xl bg-amber-50/70 p-3 border border-amber-200/80">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-1">
                      Flock Symptoms &amp; Shed Observations:
                    </p>
                    <ul className="space-y-1 text-xs text-amber-950 font-medium">
                      {d.symptoms.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-700 font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Post-Mortem Lesions */}
                  <div className="mt-3 rounded-xl bg-rose-50/70 p-3 border border-rose-200/80">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-rose-900 mb-1">
                      Post-Mortem Autopsy Lesions:
                    </p>
                    <ul className="space-y-1 text-xs text-rose-950 font-medium">
                      {d.postMortemLesions.map((l, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-rose-700 font-bold">•</span>
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Field Management Actions */}
                  <div className="mt-3 rounded-xl bg-emerald-50/70 p-3 border border-emerald-200/80">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 mb-1">
                      Corrective Shed Management &amp; Hygiene:
                    </p>
                    <ul className="space-y-1 text-xs text-emerald-950 font-medium">
                      {d.fieldManagement.map((m, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-700" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Virbac Solutions */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Virbac Portfolio Products for this Condition:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {d.recommendedProductIds.map((pId) => {
                        const prod = products.find((p) => p.id === pId);
                        if (!prod) return null;
                        return (
                          <button
                            key={pId}
                            type="button"
                            onClick={() => {
                              onSelectProductForVisit(pId);
                              onNavigateToWorkbench();
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-900 hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            <Package className="h-3 w-3 text-blue-700" />
                            <span>{prod.name}</span>
                            <span className="text-[10px] text-blue-600">({prod.shortCode})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectDiseaseForVisit(d.id);
                      onNavigateToWorkbench();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Load into Farm Visit Prescription</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
