import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { PageHeader, RiskBadge } from '../../components/shared/UIComponents';
import { Network, Activity, ArrowRight, Layers, ShieldAlert, Zap } from 'lucide-react';

export function CatchmentGraphPage() {
  const { topologyNodes, activeScenario } = useStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('v1');

  const selectedNode = topologyNodes.find(n => n.id === selectedNodeId) || topologyNodes[0];

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Catchment Topology Graph & Flow Network" 
        subtitle="Hydrological flow routing from ridge sensors down to valley villages with computed travel time delays"
      />

      {/* Top statistics summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Total Network Nodes</div>
          <div className="text-2xl font-bold text-white mt-1">{topologyNodes.length}</div>
          <div className="text-xs text-slate-400 mt-1">4 Ridge Sensors + 3 Villages</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Active Flow Rate</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">2.4 m/s</div>
          <div className="text-xs text-slate-400 mt-1">Based on current slope gradient</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Critical Vulnerable Target</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">Rampur (Node V1)</div>
          <div className="text-xs text-rose-300 mt-1">TTI: 18 mins (High Risk)</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Propagation Latency</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">1.2 seconds</div>
          <div className="text-xs text-slate-400 mt-1">Edge telemetry sync rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Network View */}
        <div className="lg:col-span-2 card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-cyan-400" />
                River Network Propagation Diagram
              </h3>
              <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-full">
                Valley Hydrology Graph v2.4
              </span>
            </div>

            <div className="relative bg-slate-950/80 rounded-xl p-8 border border-slate-800 min-h-[380px] flex flex-col justify-between overflow-hidden">
              {/* Top ridge sensors */}
              <div className="flex justify-around items-center z-10">
                {topologyNodes.filter(n => n.type === 'sensor').map(node => (
                  <div 
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all ${
                      selectedNodeId === node.id 
                        ? 'bg-slate-800/90 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105' 
                        : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-sm text-white">{node.name}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Elev: {node.elevation}m</div>
                    <div className="mt-2 text-xs font-mono bg-slate-950 px-2 py-0.5 rounded text-cyan-300">
                      Sensor #{node.id.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Flow Arrows SVG Overlay */}
              <div className="my-6 text-center text-slate-500 text-xs font-mono flex items-center justify-center gap-4">
                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                  <ArrowRight className="w-4 h-4 animate-pulse" /> Downstream Channel Flow (Slope 14°)
                </span>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
              </div>

              {/* Bottom village nodes */}
              <div className="flex justify-around items-center z-10">
                {topologyNodes.filter(n => n.type === 'village').map(node => (
                  <div 
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all ${
                      selectedNodeId === node.id 
                        ? 'bg-slate-800/90 border-rose-500 shadow-lg shadow-rose-500/20 scale-105' 
                        : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="font-bold text-sm text-white">{node.name}</span>
                      <RiskBadge level={node.riskLevel || 'LOW'} />
                    </div>
                    <div className="text-xs text-slate-400">Elev: {node.elevation}m</div>
                    {node.ttiMinutes && (
                      <div className="mt-2 text-xs font-mono text-rose-400 font-semibold bg-rose-950/60 border border-rose-800/50 px-2 py-0.5 rounded">
                        TTI: {node.ttiMinutes} mins
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Node risk levels automatically re-calculate every 10s based on upstream gauge velocity and cross-sectional runoff models.</span>
          </div>
        </div>

        {/* Selected Node Details Panel */}
        <div className="card space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Node Hydrological Spec
          </h3>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-white">{selectedNode.name}</span>
              <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full font-mono uppercase">
                {selectedNode.type}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <div className="text-slate-400">Elevation</div>
                <div className="text-white font-bold mt-0.5">{selectedNode.elevation} meters</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <div className="text-slate-400">Latitude / Longitude</div>
                <div className="text-white font-mono text-[11px] mt-0.5">{selectedNode.lat.toFixed(4)}, {selectedNode.lng.toFixed(4)}</div>
              </div>
            </div>

            {selectedNode.downstreamFrom && selectedNode.downstreamFrom.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-1">Upstream Feeding Nodes</div>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.downstreamFrom.map(upId => (
                    <span key={upId} className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono">
                      {topologyNodes.find(n => n.id === upId)?.name || upId}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Hydrological Delay Matrix</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs p-2.5 bg-slate-900/80 rounded border border-slate-800">
                <span className="text-slate-300">Sensor Ridge-1 &rarr; Rampur</span>
                <span className="font-mono text-cyan-400 font-semibold">14 mins</span>
              </div>
              <div className="flex justify-between items-center text-xs p-2.5 bg-slate-900/80 rounded border border-slate-800">
                <span className="text-slate-300">Sensor Mid-River &rarr; Bagwan</span>
                <span className="font-mono text-cyan-400 font-semibold">22 mins</span>
              </div>
              <div className="flex justify-between items-center text-xs p-2.5 bg-slate-900/80 rounded border border-slate-800">
                <span className="text-slate-300">Rampur &rarr; Devprayag Slope</span>
                <span className="font-mono text-cyan-400 font-semibold">35 mins</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
