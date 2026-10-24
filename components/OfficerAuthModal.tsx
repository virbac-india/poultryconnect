import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Building,
  MapPin,
  Phone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { OfficerProfile } from '../types/poultry';

interface OfficerAuthModalProps {
  isOpen: boolean;
  onAuthorize: (profile: OfficerProfile) => void;
  currentProfile: OfficerProfile;
}

export const OfficerAuthModal: React.FC<OfficerAuthModalProps> = ({
  isOpen,
  onAuthorize,
  currentProfile,
}) => {
  const [formData, setFormData] = useState<OfficerProfile>({
    ...currentProfile,
    officerEmail: currentProfile.officerEmail || '',
    officerName: currentProfile.officerName || '',
    buUnit: currentProfile.buUnit || 'Poultry Business Unit',
    region: currentProfile.region || 'South Region',
    hq: currentProfile.hq || 'Namakkal HQ',
    officerPhone: currentProfile.officerPhone || '+91 98480 12345',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.officerEmail.trim() || !formData.officerName.trim()) {
      alert('Please enter your Officer Name and Official Follow-Up Email.');
      return;
    }
    onAuthorize({
      ...formData,
      isAuthorized: true,
    });
  };

  const handleQuickDemo = () => {
    const demoProfile: OfficerProfile = {
      officerName: 'Preetam Sangam',
      officerEmail: 'preetamsangam07@gmail.com',
      officerPhone: '+91 98480 12345',
      buUnit: 'Poultry Business Unit',
      region: 'South Region',
      hq: 'Namakkal HQ',
      territory: 'Namakkal & Deccan Belt',
      currencySymbol: '₹',
      autoTriggerMailtoOnDue: true,
      web3FormsKey: '',
      consultantName: 'Dr. Srinivas Rao, MVSc',
      consultantPhone: '+91 94401 22334',
      consultantEmail: 'consultant@avianhealth.in',
      isAuthorized: true,
    };
    setFormData(demoProfile);
    onAuthorize(demoProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-slate-800 shadow-2xl relative overflow-hidden">
        {/* Top Header: Virbac Logo & Title */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-auto items-center justify-center mb-3">
            <img
              src="https://in.virbac.com/assets/virbac/build/images/virbac-logo.03fd5e40.svg"
              alt="Virbac"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-900 border border-blue-200">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-700" />
            <span>Field Officer Portal · GitHub Pages Ready</span>
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Poultry <span className="text-blue-700">Connect</span>
          </h2>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            Authorize your device with your Official Field details to track farm visits and receive 7-day customer follow-up email alerts.
          </p>
        </div>

        {/* Authorization Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official Follow-Up Email ID <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={formData.officerEmail}
                onChange={(e) => setFormData({ ...formData, officerEmail: e.target.value })}
                placeholder="e.g. preetamsangam07@gmail.com"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-2xs"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500 font-medium">
              7-day follow-up reminder emails will be sent directly to this address.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Business Officer (BO) Full Name <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={formData.officerName}
                onChange={(e) => setFormData({ ...formData, officerName: e.target.value })}
                placeholder="e.g. Preetam Sangam"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">BU Unit</label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={formData.buUnit}
                  onChange={(e) => setFormData({ ...formData, buUnit: e.target.value })}
                  placeholder="Poultry BU"
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-8 pr-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Region</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="South Region"
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-8 pr-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none shadow-2xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">HQ (Headquarters)</label>
              <input
                type="text"
                value={formData.hq}
                onChange={(e) => setFormData({ ...formData, hq: e.target.value })}
                placeholder="Namakkal HQ"
                className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={formData.officerPhone}
                  onChange={(e) => setFormData({ ...formData, officerPhone: e.target.value })}
                  placeholder="+91 98480 12345"
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-8 pr-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none shadow-2xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-800 transition-all cursor-pointer"
            >
              <span>Access Field Sales Workbench</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-center text-xs font-semibold text-slate-500 hover:text-blue-700 py-1 transition-colors cursor-pointer"
            >
              Use Pre-filled Business Officer Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
