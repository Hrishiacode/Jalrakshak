import React from 'react';
import { useStore } from '../../store/useStore';
import { PageHeader } from '../../components/shared/UIComponents';
import { Play, Sliders, Zap, AlertTriangle, RefreshCw, BarChart2 } from 'lucide-react';

export function SimulationPage() {
  const { activeScenario, runSimulation, setScenario } = useStore();

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="What-If Hydrodynamic Scenario Simulator" 
        subtitle="Simulate intense cloudbursts, landslide dam breaches, and dam spillway releases to evaluate village evacuation safety windows"
      />

      {/* Preset scenario selection controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => setScenario('CLOUDBURST')}
          className={`card text-left transition-all ${
            activeScenario === 'CLOUDBURST' ? 'border-rose-500 bg-rose-950/30 ring-1 ring-rose-500' : 'hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Cloudburst Scenario</span>
            <span className="text-[10px] px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 rounded font-mono">120 mm/hr</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Extreme local precipitation causing rapid surge propagation down steep gradient.
          </p>
        </button>

        <button
          onClick={() => setScenario('LANDSLIDE_BREACH')}
          className={`card text-left transition-all ${
            activeScenario === 'LANDSLIDE_BREACH' ? 'border-amber-500 bg-amber-950/30 ring-1 ring-amber-500' : 'hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Landslide Dam Breach</span>
            <span className="text-[10px] px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded font-mono">Surge Wave</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Upstream natural dam failure causing instant 4.5m flood crest release.
          </p>
        </button>

        <button
          onClick={() => setScenario('DAM_RELEASE')}
          className={`card text-left transition-all ${
            activeScenario === 'DAM_RELEASE' ? 'border-cyan-500 bg-cyan-950/30 ring-1 ring-cyan-500' : 'hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Dam Spillway Release</span>
            <span className="text-[10px] px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded font-mono">Controlled</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Hydroelectric reservoir gate opening releasing 800 m³/s into lower catchment.
          </p>
        </button>

        <button
          onClick={() => setScenario('NORMAL')}
          className={`card text-left transition-all ${
            activeScenario === 'NORMAL' ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500' : 'hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Baseline Normal Flow</span>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-mono">Monsoon Normal</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Standard seasonal rainfall with stable river levels and safe evacuation margins.
          </p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulation Execution Parameters */}
        <div className="card space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            Hydrodynamic Parameters
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Peak Rainfall Rate</span>
                <span className="font-mono text-cyan-400 font-bold">120 mm/h</span>
              </div>
              <input type="range" min="10" max="200" defaultValue="120" className="w-full accent-cyan-500 cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Upstream Slope Gradient</span>
                <span className="font-mono text-cyan-400 font-bold">18° steep</span>
              </div>
              <input type="range" min="5" max="40" defaultValue="18" className="w-full accent-cyan-500 cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Soil Saturation Index (Antecedent)</span>
                <span className="font-mono text-cyan-400 font-bold">92% (Saturated)</span>
              </div>
              <input type="range" min="10" max="100" defaultValue="92" className="w-full accent-cyan-500 cursor-pointer" />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Manning's Roughness Coefficient (n)</span>
                <span className="font-mono text-cyan-400 font-bold">0.045 (Rocky Channel)</span>
              </div>
              <input type="range" min="20" max="80" defaultValue="45" className="w-full accent-cyan-500 cursor-pointer" />
            </div>
          </div>

          <button 
            onClick={() => runSimulation()}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all mt-4"
          >
            <Play className="w-4 h-4 fill-white" /> Run 1D Saint-Venant Solver Engine
          </button>
        </div>

        {/* Output Comparison Results */}
        <div className="lg:col-span-2 card space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-400" />
            Simulated Impact Comparison
          </h3>

          <div className="space-y-3">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-white">Rampur Village (Target Node V1)</span>
                <span className="text-rose-400 font-mono">Simulated TTI: 14 mins</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                <div className="bg-slate-900 p-2 rounded">
                  <div className="text-slate-400">Peak Water Level</div>
                  <div className="text-rose-400 font-bold font-mono mt-0.5">3.8 meters</div>
                </div>
                <div className="bg-slate-900 p-2 rounded">
                  <div className="text-slate-400">Floodwave Speed</div>
                  <div className="text-amber-400 font-bold font-mono mt-0.5">6.2 m/s</div>
                </div>
                <div className="bg-slate-900 p-2 rounded">
                  <div className="text-slate-400">Evacuation Margin</div>
                  <div className="text-rose-400 font-bold font-mono mt-0.5">-6 mins (DEFICIT)</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-white">Bagwan Village (Target Node V2)</span>
                <span className="text-amber-400 font-mono">Simulated TTI: 32 mins</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                <div className="bg-slate-900 p-2 rounded">
                  <div className="text-slate-400">Peak Water Level</div>
                  <div className="text-amber-400 font-bold font-mono mt-0.5">2.4 meters</div>
                </div>
                <div className="bg-slate-900 p-2 rounded">
                  <div className="text-slate-400">Floodwave Speed</div>
                  <div className="text-cyan-400 font-bold font-mono mt-0.5">4.1 m/s</div>
                </div>
                <div className="bg-slate-900 p-2 rounded">
                  <div className="text-slate-400">Evacuation Margin</div>
                  <div className="text-emerald-400 font-bold font-mono mt-0.5">+10 mins (SAFE)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
