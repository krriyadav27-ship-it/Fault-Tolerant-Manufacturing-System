import React, { useState } from 'react';
import { useProduction } from '../../context/ProductionContext';
import {
  Settings,
  User,
  Shield,
  Cpu,
  FileCheck2,
  CheckCircle2,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Radio,
  Lock,
  Layers,
  History,
  Save,
  KeyRound
} from 'lucide-react';

export const SettingsView = () => {
  const {
    currentUser,
    updateUserProfile,
    limits,
    updateLimits,
    redundancyMode,
    setRedundancyMode,
    auditTrail,
    resetAllData
  } = useProduction();

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    title: currentUser?.title || '',
    cleanroomGrade: currentUser?.cleanroomGrade || 'Grade A / ISO 5 Qualified',
    pin: currentUser?.pin || '9901'
  });

  const [profileSaved, setProfileSaved] = useState(false);
  const [driftTolerance, setDriftTolerance] = useState(limits.temperature.driftTolerance || 0.8);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleDriftToleranceSave = () => {
    const updated = {
      ...limits,
      temperature: {
        ...limits.temperature,
        driftTolerance: parseFloat(driftTolerance)
      }
    };
    updateLimits(updated, `Adjusted TMR sensor drift tolerance to ±${driftTolerance}°C`);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-teal-400 uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" />
          <span>Module 9: System Configuration & Audit Trail</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          User Profile, Process Limits & Account Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage operator cleanroom credentials, configure fault-tolerant sensor voting parameters, and inspect the 21 CFR Part 11 audit log.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: User Profile & Fault-Tolerance Architecture */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* User Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Personnel Profile</h3>
                  <p className="text-xs text-slate-400">Cleanroom identity & digital signature PIN</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-500/30">
                {currentUser?.role || 'Operator'}
              </span>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Official Email Address</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title & Operational Assignment</label>
                <input
                  type="text"
                  required
                  value={profileForm.title}
                  onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cleanroom Qualification</label>
                  <select
                    value={profileForm.cleanroomGrade}
                    onChange={(e) => setProfileForm({ ...profileForm, cleanroomGrade: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-100"
                  >
                    <option value="Grade A / ISO 5 Qualified">Grade A / ISO 5 Qualified</option>
                    <option value="Grade B / ISO 6 Qualified">Grade B / ISO 6 Qualified</option>
                    <option value="Grade C / ISO 7 Qualified">Grade C / ISO 7 Qualified</option>
                    <option value="Grade D / ISO 8 Qualified">Grade D / ISO 8 Qualified</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Security PIN (Electronic Sign)</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    value={profileForm.pin}
                    onChange={(e) => setProfileForm({ ...profileForm, pin: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono tracking-widest"
                  />
                </div>
              </div>

              {profileSaved && (
                <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile updated and recorded into the validation ledger.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-500/20 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>

          {/* Fault-Tolerance Architecture Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Redundancy & Voting Algorithm</h3>
                <p className="text-xs text-slate-400">Fault isolation and failover parameters</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Consensus Redundancy Engine
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'TMR', label: 'TMR (2-out-of-3)', desc: 'Majority voting with outlier rejection' },
                    { id: 'DUAL_FAILOVER', label: 'Dual Hot-Standby', desc: 'Primary with automatic failover' },
                    { id: 'KALMAN', label: 'Weighted Kalman', desc: 'Noise-covariance fusion' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setRedundancyMode(mode.id)}
                      className={`p-3 rounded-xl border text-left transition ${
                        redundancyMode === mode.id
                          ? 'bg-teal-950/80 border-teal-500 text-teal-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs">{mode.label}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-semibold">
                    Sensor Drift Rejection Sensitivity (±°C)
                  </label>
                  <span className="font-mono text-teal-400 font-bold">±{driftTolerance} °C</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.1"
                  value={driftTolerance}
                  onChange={(e) => setDriftTolerance(e.target.value)}
                  className="w-full accent-teal-400 bg-slate-950"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>Tight (±0.2°C)</span>
                  <span>Standard (±0.8°C)</span>
                  <span>Loose (±2.0°C)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDriftToleranceSave}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                Apply Drift Tolerance
              </button>
            </div>
          </div>

          {/* Reset System State */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-slate-200 text-sm mb-2">Factory Demo State Restoration</h3>
            <p className="text-xs text-slate-400 mb-4">
              Restores factory default mock data, limits, personnel, and nominal sensor telemetry.
            </p>
            <button
              onClick={() => setResetModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/50 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Application to Default State</span>
            </button>
          </div>

        </div>

        {/* Right Column: 21 CFR Part 11 Audit Trail */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">21 CFR Part 11 Audit Trail</h3>
                <p className="text-xs text-slate-400">Immutable chronological event records</p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              {auditTrail.length} Events
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Under Good Manufacturing Practices (GMP) and FDA guidelines, every user action, limit alteration, and sensor voting isolation is indelibly logged.
          </p>

          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {auditTrail.map((ev) => (
              <div
                key={ev.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition text-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-teal-400 text-[11px]">{ev.id}</span>
                  <span className="text-[10px] font-mono text-slate-500">{ev.timestamp}</span>
                </div>

                <div className="font-semibold text-slate-200 flex items-center gap-2">
                  <span className="font-mono text-[11px] text-cyan-300">[{ev.action}]</span>
                  <span className="text-slate-400 font-normal">by</span>
                  <span className="text-slate-200 font-medium">{ev.user}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({ev.role})</span>
                </div>

                <p className="text-slate-400 mt-1 leading-relaxed text-[11px]">
                  {ev.details}
                </p>

                <div className="mt-2 pt-1.5 border-t border-slate-900 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>Traceability: Verified</span>
                  <span className="text-emerald-400 font-medium">{ev.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Reset Confirmation Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Confirm Factory Reset</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to restore the default demo state? All newly logged production readings, custom stock items, and adjusted limits will revert to baseline demo values.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setResetModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
