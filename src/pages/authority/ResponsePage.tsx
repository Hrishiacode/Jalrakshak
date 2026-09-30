import React from 'react';
import { PageHeader } from '../../components/shared/UIComponents';
import { ShieldCheck, Truck, Crosshair, Users, PhoneCall, Anchor, Radio } from 'lucide-react';

export function ResponsePage() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Incident Command System (ICS) & Emergency Units" 
        subtitle="NDRF / SDRF team deployment, search & rescue boats, medical post allocation, and logistics tracking"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">NDRF Battalion Deployed</div>
          <div className="text-2xl font-bold text-white mt-1">2 Battalions (48 Personnel)</div>
          <div className="text-xs text-emerald-400 mt-1">Stationed at Base Alpha</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Rescue Boats & Kayaks</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">6 Motorized Inflatables</div>
          <div className="text-xs text-slate-400 mt-1">Pre-positioned along Rampur River</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">SDRF Quick Response Teams</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">4 Units</div>
          <div className="text-xs text-slate-400 mt-1">High-altitude rope kit equipped</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Emergency Ambulances</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">8 Units</div>
          <div className="text-xs text-slate-400 mt-1">4 Advanced Life Support</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deployed Response Units Table */}
        <div className="lg:col-span-2 card space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-cyan-400" />
            Field Unit Tactical Roster
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-mono">
                <tr>
                  <th className="p-3">Unit ID / Name</th>
                  <th className="p-3">Agency</th>
                  <th className="p-3">Location Sector</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Comms Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-sans">
                <tr>
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <Anchor className="w-4 h-4 text-cyan-400" /> NDRF Unit-08
                  </td>
                  <td className="p-3 font-mono text-cyan-300">NDRF 8th Batt.</td>
                  <td className="p-3">Rampur Valley Sector 1</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full font-semibold">
                      DEPLOYED
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-400">VHF Ch-4 (154.2 MHz)</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> SDRF Alpine Unit 2
                  </td>
                  <td className="p-3 font-mono text-emerald-300">State Disaster Force</td>
                  <td className="p-3">Bagwan Ridge Route</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full font-semibold">
                      PATROLLING
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-400">VHF Ch-2 (152.8 MHz)</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-400" /> Medical ALS Ambulance 4
                  </td>
                  <td className="p-3 font-mono text-amber-300">District Health Dept</td>
                  <td className="p-3">Shelter 1 Staging Area</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-full font-semibold">
                      ON STANDBY
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-400">+91 98765-43210</td>
                </tr>

                <tr>
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-indigo-400" /> Ham Radio Mobile Relay
                  </td>
                  <td className="p-3 font-mono text-indigo-300">Amateur Radio Corps</td>
                  <td className="p-3">Devprayag High Pass</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full font-semibold">
                      ACTIVE RELAY
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-400">HF 7.110 MHz</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Emergency Resources & Inventory */}
        <div className="card space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-rose-400" />
            Shelter Supply & Relief Inventory
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Ration Packs (Ready-to-eat)</span>
                <span className="font-bold text-white font-mono">4,500 units</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Clean Drinking Water Packets</span>
                <span className="font-bold text-white font-mono">12,000 L</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full" style={{ width: '90%' }} />
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Emergency Tarpaulins & Tents</span>
                <span className="font-bold text-white font-mono">350 sets</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: '70%' }} />
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="flex justify-between text-slate-300 mb-1">
                <span>First Aid Kits & Trauma Supplies</span>
                <span className="font-bold text-white font-mono">120 kits</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
