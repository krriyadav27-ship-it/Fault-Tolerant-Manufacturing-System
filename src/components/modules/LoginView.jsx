import React, { useState } from 'react';
import { useProduction } from '../../context/ProductionContext';
import {
  ShieldCheck,
  User,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  Activity,
  ArrowRight,
  Shield,
  FileCheck2,
  Sparkles
} from 'lucide-react';

export const LoginView = ({ onClose, onLoginSuccess }) => {
  const { users, currentUser, login, switchUser, logout } = useProduction();

  const [selectedUserId, setSelectedUserId] = useState(currentUser?.id || users[0].id);
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleManualLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = login(selectedUserId, pin);
    if (res.success) {
      setSuccessMsg(`Session authenticated successfully!`);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
        if (onClose) onClose();
      }, 700);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleQuickDemoLogin = (user) => {
    switchUser(user);
    setSuccessMsg(`Switched active profile to ${user.name} (${user.role})`);
    setTimeout(() => {
      if (onLoginSuccess) onLoginSuccess();
      if (onClose) onClose();
    }, 600);
  };

  const selectedUserObj = users.find((u) => u.id === selectedUserId) || users[0];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs font-mono font-medium mb-3">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>PHARMA-PULSE SECURE ACCESS GATEWAY</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Module 1: Authentication & Access Control
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Role-based cleanroom terminal interface for pharmaceutical production monitoring. Compliant with 21 CFR Part 11 electronic records and signature integrity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Card: Secure Login Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/40">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-900/50 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-base">Operator Signature Login</h3>
                <p className="text-xs text-slate-400">Enter your Operator ID & Security PIN</p>
              </div>
            </div>
            {currentUser && (
              <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
              </span>
            )}
          </div>

          <form onSubmit={handleManualLogin} className="space-y-5">
            {/* Operator Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Select Pharmaceutical Personnel
              </label>
              <div className="relative">
                <select
                  value={selectedUserId}
                  onChange={(e) => {
                    setSelectedUserId(e.target.value);
                    setErrorMsg('');
                    const u = users.find((x) => x.id === e.target.value);
                    if (u) setPin(u.pin);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.role} ({u.title})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-teal-400 font-semibold">{selectedUserObj.badgeId}</span>
                <span>•</span>
                <span>{selectedUserObj.cleanroomGrade}</span>
              </div>
            </div>

            {/* PIN Entry */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Security PIN / Digital Signature
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  Demo PIN: <strong className="text-teal-300">{selectedUserObj.pin}</strong>
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder={`Enter ${selectedUserObj.name.split(' ')[0]}'s PIN`}
                  maxLength={6}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-sm font-mono tracking-widest text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
                <KeyRound className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Error / Success Feedback */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Authenticate & Enter Cleanroom Suite</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Electronic Record Signature Disclaimer */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
            <FileCheck2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              By authenticating, you affirm under FDA 21 CFR Part 11 that all electronic signatures and logged production actions are legally binding equivalents of traditional handwritten signatures.
            </span>
          </div>
        </div>

        {/* Right Card: Quick 1-Click Role Switcher & Role Permissions */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Demo Logins */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-slate-200 text-sm">One-Click Demo Switcher</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Instantly test the application from different operational perspectives:
            </p>

            <div className="space-y-3">
              {users.map((u) => {
                const isActive = currentUser?.id === u.id;
                const isAdmin = u.role === 'Admin';
                return (
                  <button
                    key={u.id}
                    onClick={() => handleQuickDemoLogin(u)}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                      isActive
                        ? 'bg-teal-950/60 border-teal-500/50 shadow-md shadow-teal-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center ${
                          isAdmin
                            ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                            : 'bg-teal-950 text-teal-300 border border-teal-500/40'
                        }`}
                      >
                        {u.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-slate-200 flex items-center gap-2">
                          <span>{u.name}</span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                              isAdmin
                                ? 'bg-purple-950 text-purple-300 border border-purple-600/40'
                                : 'bg-cyan-950 text-cyan-300 border border-cyan-600/40'
                            }`}
                          >
                            {u.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{u.title}</div>
                      </div>
                    </div>
                    {isActive ? (
                      <span className="text-xs font-mono text-teal-400 font-bold">Active</span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-medium hover:text-slate-300">Switch →</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Privileges Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-slate-200 text-sm mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-400" />
              <span>Role Permissions Matrix</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="font-semibold text-purple-300 font-mono">ADMIN / QA DIRECTOR:</span>
                <ul className="list-disc list-inside text-slate-400 mt-1 space-y-0.5">
                  <li>Configure safety temperature/pressure alarm limits</li>
                  <li>Switch fault-tolerance redundancy architectures</li>
                  <li>Author 21 CFR Part 11 audit releases</li>
                  <li>Override sensor quorum alarms</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="font-semibold text-teal-300 font-mono">OPERATOR / TECHNICIAN:</span>
                <ul className="list-disc list-inside text-slate-400 mt-1 space-y-0.5">
                  <li>Log hourly production temperature readings</li>
                  <li>Acknowledge limit deviations & file CAPA notes</li>
                  <li>Update stock quantities & dispense APIs</li>
                  <li>Export shift handover & batch trend reports</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
