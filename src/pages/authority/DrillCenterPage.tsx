import React from 'react';
import { PageHeader } from '../../components/shared/UIComponents';
import { Users, Calendar, Award, CheckCircle2, Play } from 'lucide-react';

export function DrillCenterPage() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Community Drill & Readiness Center" 
        subtitle="Schedule village evacuation drills, audit warden response speeds, and calculate community preparedness index"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Overall Preparedness Index</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">88 / 100</div>
          <div className="text-xs text-slate-400 mt-1">Grade A Ready for Monsoon Season</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Last Community Drill</div>
          <div className="text-2xl font-bold text-white mt-1">12 Days Ago</div>
          <div className="text-xs text-emerald-400 mt-1">Avg Evacuation Time: 18 mins</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Active Village Wardens</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">12 Wardens Trained</div>
          <div className="text-xs text-slate-400 mt-1">100% Siren system verified</div>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          Scheduled Drills & Historical Compliance
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-white text-sm">Rampur Village Full-Scale Drill</div>
              <div className="text-slate-400">Target Time: 20 mins | Population: 420 villagers | Night Siren Exercise</div>
            </div>
            <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold flex items-center gap-1">
              <Play className="w-3.5 h-3.5 fill-white" /> Start Simulated Drill
            </button>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-white text-sm">Bagwan School & Elderly Evacuation Drill</div>
              <div className="text-slate-400">Completed on Sep 18 | Result: 16 mins (3 mins under benchmark)</div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-mono font-bold">
              PASSED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
