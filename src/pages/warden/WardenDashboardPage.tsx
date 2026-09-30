import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { PageHeader, RiskBadge } from '../../components/shared/UIComponents';
import { Volume2, Users, CheckSquare, PhoneCall, AlertOctagon, Radio, ShieldCheck, Send } from 'lucide-react';

export function WardenDashboardPage() {
  const { villages, triggerAlert } = useStore();
  const village = villages[0]; // Warden for Rampur village

  const [sirenActive, setSirenActive] = useState(false);
  const [headCountCounted, setHeadCountCounted] = useState(380);

  const toggleSiren = () => {
    setSirenActive(!sirenActive);
    if (!sirenActive) {
      triggerAlert(village.name, 'RED', 'LOCAL WARDEN SIREN ACTIVATED: Move to Ridge Shelter immediately!');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title={`Village Warden Command Console — ${village.name}`} 
        subtitle="Localized head-count tracking, physical siren activation, and direct dispatch to District Control Room"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Assigned Village</div>
          <div className="text-2xl font-bold text-white mt-1">{village.name}</div>
          <div className="text-xs text-slate-400 mt-1">Total Population: {village.population}</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Evacuation Status</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{village.evacuationProgress}% Evacuated</div>
          <div className="text-xs text-slate-400 mt-1">{headCountCounted} / {village.population} accounted for</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Time-To-Impact (TTI)</div>
          <div className="text-2xl font-bold text-rose-400 mt-1 font-mono">{village.ttiMinutes} Mins</div>
          <div className="text-xs text-rose-300 mt-1">Status: HIGH RISK</div>
        </div>
      </div>

      {/* Manual Siren Activation Panel */}
      <div className="card bg-slate-900 border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 p-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
            <Volume2 className="w-6 h-6 text-rose-500 animate-pulse" />
            Physical Village Siren Control
          </div>
          <p className="text-xs text-slate-400">
            Triggers local 120dB horn siren atop Rampur Community Center & sends emergency phone call loop to all registered heads of household.
          </p>
        </div>

        <button
          onClick={toggleSiren}
          className={`px-6 py-4 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl transition-all ${
            sirenActive 
              ? 'bg-rose-600 text-white animate-pulse border-2 border-white' 
              : 'bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white'
          }`}
        >
          <AlertOctagon className="w-5 h-5" />
          {sirenActive ? 'SIREN IS SOUNDING (CLICK TO STOP)' : 'ACTIVATE LOCAL SIREN NOW'}
        </button>
      </div>

      {/* Headcount Checklist */}
      <div className="card space-y-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-cyan-400" />
          Vulnerable Resident Evacuation Audit
        </h3>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-white font-semibold">Sector 1 (Riverbank Houses) — 14 Households</span>
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded font-mono font-bold">100% EVACUATED</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-white font-semibold">Senior Citizens & Mobility Assisted Group (8 Persons)</span>
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded font-mono font-bold">BOARDED ON BUS 1</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-white font-semibold">Primary School Children (45 Students)</span>
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded font-mono font-bold">ARRIVED AT SHELTER 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
