import React from 'react';
import { useStore } from '../../store/useStore';
import { PageHeader } from '../../components/shared/UIComponents';
import { Cpu, BatteryCharging, Signal, RefreshCw, AlertCircle, Wrench, ShieldCheck } from 'lucide-react';

export function SensorsPage() {
  const { sensors, activeScenario } = useStore();

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="IoT Telemetry & Edge Sensor Health" 
        subtitle="Upstream water level radar, ultrasonic surge sensors, rain gauges, solar backup, and signal diagnostic"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Total Deployed Sensors</div>
          <div className="text-2xl font-bold text-white mt-1">{sensors.length}</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> All 4 Reporting Live
          </div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Average Battery Level</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">94%</div>
          <div className="text-xs text-slate-400 mt-1">Solar Panel Input: 18.2V</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Telemetry Protocol</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">LoRaWAN + 4G</div>
          <div className="text-xs text-slate-400 mt-1">Satellite Fallback Armed</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Data Freshness</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">2 sec</div>
          <div className="text-xs text-slate-400 mt-1">Sub-second pulse active</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sensors.map((sensor) => (
          <div key={sensor.id} className="card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-white">{sensor.name}</span>
                  <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded">
                    ID: {sensor.id.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Location: Lat {sensor.lat.toFixed(4)}, Lng {sensor.lng.toFixed(4)} | Elev: {sensor.elevation}m
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                  sensor.status === 'ONLINE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {sensor.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400">Water Stage</div>
                <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                  {sensor.currentWaterLevel.toFixed(2)} m
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Threshold: {sensor.warningLevel}m</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400">Rain Intensity</div>
                <div className="text-lg font-bold text-blue-400 font-mono mt-0.5">
                  {sensor.rainfallMmHr} mm/h
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Tipping Bucket</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400">Battery & Solar</div>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                  <BatteryCharging className="w-4 h-4 text-emerald-400" /> {sensor.batteryPct}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">LiFePO4 Solar Pack</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400">Signal (RSSI)</div>
                <div className="text-lg font-bold text-indigo-400 font-mono mt-0.5 flex items-center gap-1">
                  <Signal className="w-4 h-4 text-indigo-400" /> -82 dBm
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">LoRa Gateway #1</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
              <span className="text-slate-400 font-mono">
                Last Telemetry Ping: {new Date(sensor.lastUpdated).toLocaleTimeString()}
              </span>

              <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1.5 transition-colors">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Remote Diagnostics
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
