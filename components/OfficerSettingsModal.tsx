import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Bell,
  Stethoscope,
  Building,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { OfficerProfile } from '../types/poultry';

interface OfficerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: OfficerProfile;
  onSaveProfile: (profile: OfficerProfile) => void;
}

export const OfficerSettingsModal: React.FC<OfficerSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<OfficerProfile>(profile);
  const [notificationStatus, setNotificationStatus] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  if (!isOpen) return null;

  const handleRequestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationStatus(permission);
        if (permission === 'granted') {
          new Notification('Poultry Connect: Notifications Enabled!', {
            body: '7-Day follow-up reminders and visit alerts will now appear on your device.',
            icon: '/vite.svg',
          });
          setTestNotificationSent(true);
        }
      } catch (err) {
        console.error('Error requesting notification permission:', err);
      }
    }
  };

  const handleSendTestPush = () => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('⚡ 7-Day Follow-Up Alert: Venkatesh Goud', {
        body: 'Swarna Layer Farm visit from 7 days ago is due for review today!',
        icon: '/vite.svg',
      });
      setTestNotificationSent(true);
      setTimeout(() => setTestNotificationSent(false), 4000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Building className="h-5 w-5 text-blue-700" />
            <h2 className="text-lg font-black text-slate-900">
              Business Officer (BO) Setup &amp; Technical In-Charge
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Sales Field Officer Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-3 flex items-center gap-1.5">
              <User className="h-4 w-4" /> Field Business Officer (BO) Information
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business Officer (BO) Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.officerName}
                  onChange={(e) => setFormData({ ...formData, officerName: e.target.value })}
                  placeholder="e.g. Preetam Sangam"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Follow-Up Email (Receives Reminders) *
                </label>
                <input
                  type="email"
                  required
                  value={formData.officerEmail}
                  onChange={(e) => setFormData({ ...formData, officerEmail: e.target.value })}
                  placeholder="e.g. preetamsangam07@gmail.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.officerPhone}
                  onChange={(e) => setFormData({ ...formData, officerPhone: e.target.value })}
                  placeholder="e.g. +91 98480 12345"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">BU Unit</label>
                <input
                  type="text"
                  value={formData.buUnit}
                  onChange={(e) => setFormData({ ...formData, buUnit: e.target.value })}
                  placeholder="e.g. Poultry Business Unit"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Region</label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="e.g. South Region"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">HQ (Headquarters)</label>
                <input
                  type="text"
                  value={formData.hq}
                  onChange={(e) => setFormData({ ...formData, hq: e.target.value })}
                  placeholder="e.g. Namakkal HQ"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Poultry Consultant & Technical Vet */}
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50/50 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1 flex items-center gap-1.5">
              <Stethoscope className="h-4 w-4 text-emerald-700" /> Technical Poultry Consultant / Vet In-Charge
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              When flocks show severe underweight or layer drops, the workbench will generate direct referral dossiers to this specialist.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Consultant Name &amp; Degree</label>
                <input
                  type="text"
                  required
                  value={formData.consultantName}
                  onChange={(e) => setFormData({ ...formData, consultantName: e.target.value })}
                  placeholder="Dr. Srinivas Rao, MVSc"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Consultant Phone</label>
                <input
                  type="text"
                  required
                  value={formData.consultantPhone}
                  onChange={(e) => setFormData({ ...formData, consultantPhone: e.target.value })}
                  placeholder="+91 94401 22334"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Consultant Email</label>
                <input
                  type="email"
                  value={formData.consultantEmail}
                  onChange={(e) => setFormData({ ...formData, consultantEmail: e.target.value })}
                  placeholder="consultant@avianhealth.in"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Push Notifications & Reminders (GitHub Pages Compatible) */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <Bell className="h-4 w-4 text-blue-700" /> Push Notifications &amp; Reminders
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Runs directly in your mobile or laptop browser without requiring special Google authorization.
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Permission Status:{' '}
                  <strong
                    className={
                      notificationStatus === 'granted'
                        ? 'text-emerald-700 uppercase'
                        : notificationStatus === 'denied'
                        ? 'text-rose-700 uppercase'
                        : 'text-amber-700 uppercase'
                    }
                  >
                    {notificationStatus}
                  </strong>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {notificationStatus !== 'granted' ? (
                  <button
                    type="button"
                    onClick={handleRequestPushPermission}
                    className="rounded-xl bg-blue-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-800 cursor-pointer shadow-2xs"
                  >
                    Enable Push Notifications
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendTestPush}
                    className="rounded-xl border border-blue-300 bg-white px-3.5 py-2 text-xs font-bold text-blue-900 hover:bg-blue-50 cursor-pointer shadow-2xs"
                  >
                    Send Test Alert
                  </button>
                )}
              </div>
            </div>
            {testNotificationSent && (
              <p className="mt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> Test notification sent! Check your notification tray.
              </p>
            )}
          </div>

          {/* Footer Save & Logout */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                if (confirm('Switch to a different Sales Officer?')) {
                  onSaveProfile({ ...formData, isAuthorized: false });
                  onClose();
                }
              }}
              className="text-xs text-rose-700 hover:text-rose-800 font-bold cursor-pointer"
            >
              Log Out / Switch Officer
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-700 px-5 py-2 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-xs cursor-pointer"
              >
                Save Officer Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
