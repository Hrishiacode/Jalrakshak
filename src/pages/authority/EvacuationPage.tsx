import React from 'react';
import { useStore } from '../../store/useStore';
import { PageHeader } from '../../components/shared/UIComponents';
import { Navigation, ShieldCheck, MapPin, Users, AlertTriangle, Phone, Bus } from 'lucide-react';

export function EvacuationPage() {
  const { villages } = useStore();

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Safe Evacuation & Route Management" 
        subtitle="Upstream bottleneck monitoring, high-ground shelter allocation, and warden contact matrix"
      />

      {/* Evacuation shelters status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Ridge Shelter 1 (Rampur Ridge)</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">OPEN</span>
          </div>
          <div className="text-xl font-bold text-white mt-2">Capacity: 450 / 800</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: '56%' }} />
          </div>
          <div className="text-xs text-slate-400 mt-2 flex justify-between">
            <span>Water & Power: Normal</span>
            <span>Elevation: 1,420m</span>
          </div>
        </div>

        <div className="card border-cyan-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">High School Shelter 2 (Bagwan)</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">READY</span>
          </div>
          <div className="text-xl font-bold text-white mt-2">Capacity: 120 / 600</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-cyan-500 h-full" style={{ width: '20%' }} />
          </div>
          <div className="text-xs text-slate-400 mt-2 flex justify-between">
            <span>Medical Staff: 4 On-site</span>
            <span>Elevation: 1,280m</span>
          </div>
        </div>

        <div className="card border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Devprayag Stadium Compound</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 rounded">STANDBY</span>
          </div>
          <div className="text-xl font-bold text-white mt-2">Capacity: 0 / 1200</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full" style={{ width: '0%' }} />
          </div>
          <div className="text-xs text-slate-400 mt-2 flex justify-between">
            <span>Helipad: Functional</span>
            <span>Elevation: 1,150m</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Village Evacuation Status & Warden Grid */}
        <div className="lg:col-span-2 card space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Village Evacuation Status & Local Wardens
          </h3>

          <div className="space-y-4">
            {villages.map((village) => (
              <div key={village.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{village.name}</span>
                      <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        Pop: {village.population}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Evacuation Route: {village.name} High Road Path &rarr; Shelter 1
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">Evacuated:</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      {village.evacuationProgress}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-500" 
                    style={{ width: `${village.evacuationProgress}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800/80">
                    <div className="text-slate-400">Village Warden</div>
                    <div className="text-white font-semibold mt-0.5">{village.wardenName}</div>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-slate-400">Warden Contact</div>
                      <div className="text-cyan-300 font-mono mt-0.5">{village.wardenPhone}</div>
                    </div>
                    <a 
                      href={`tel:${village.wardenPhone}`}
                      className="p-1.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-800 hover:bg-cyan-900"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800/80">
                    <div className="text-slate-400">Assigned Vehicles</div>
                    <div className="text-white font-semibold mt-0.5 flex items-center gap-1">
                      <Bus className="w-3.5 h-3.5 text-amber-400" /> 2 Buses, 4 4x4 Jeeps
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route Blockages & Bottlenecks */}
        <div className="card space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Route Blockages & Hazard Alerts
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 bg-rose-950/40 border border-rose-800/50 rounded-xl space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-rose-300">Landslide Hazard — Sector 4 Bridge</span>
                <span className="font-mono text-rose-400 text-[10px]">BLOCKED</span>
              </div>
              <p className="text-xs text-slate-300">
                Debris accumulation detected near KM 14. Evacuees rerouted via Eastern Ridge Track.
              </p>
            </div>

            <div className="p-3.5 bg-amber-950/40 border border-amber-800/50 rounded-xl space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-amber-300">High Water Crossing — Rampur Stream</span>
                <span className="font-mono text-amber-400 text-[10px]">WARNING</span>
              </div>
              <p className="text-xs text-slate-300">
                Water level depth 0.6m over road. Foot-travel disabled; 4x4 vehicles only.
              </p>
            </div>

            <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/50 rounded-xl space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-emerald-300">Clear Evacuation Route A-1</span>
                <span className="font-mono text-emerald-400 text-[10px]">OPERATIONAL</span>
              </div>
              <p className="text-xs text-slate-300">
                Main high-altitude ridge road fully clear with police checkpoints deployed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
