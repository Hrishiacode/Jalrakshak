import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { PageHeader, RiskBadge } from '../../components/shared/UIComponents';
import { Radio, Send, CheckCircle2, AlertOctagon, PhoneCall, Smartphone, Volume2, MessageSquare, ShieldAlert } from 'lucide-react';

export function AlertsPage() {
  const { alerts, villages, triggerAlert, isAlertActive } = useStore();
  const [selectedVillageId, setSelectedVillageId] = useState(villages[0]?.id || 'v1');
  const [alertSeverity, setAlertSeverity] = useState<'RED' | 'ORANGE' | 'YELLOW'>('RED');
  const [customMsg, setCustomMsg] = useState('FLASH FLOOD WARNING: Flood wave estimated in 18 minutes. Move immediately to Higher Ridge Shelter 2.');
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const v = villages.find(v => v.id === selectedVillageId);
    if (!v) return;
    
    triggerAlert(v.name, alertSeverity, customMsg);
    setDispatchStatus('Alert dispatched across all 4 channels (Voice Sirens, App Push, SMS Gateway, VHF Radio).');
    setTimeout(() => setDispatchStatus(null), 5000);
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Multi-Channel Alert Dispatch Engine" 
        subtitle="Zero-latency warning dissemination via Sirens, Mobile Push, Local SMS Gateways & VHF Radio"
      />

      {dispatchStatus && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold text-sm">{dispatchStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trigger / Broadcast Form */}
        <div className="lg:col-span-1 card space-y-5">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            Manual Alert Trigger Console
          </h3>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Village / Catchment Zone</label>
              <select 
                value={selectedVillageId}
                onChange={(e) => setSelectedVillageId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-sm focus:border-rose-500 outline-none"
              >
                {villages.map(v => (
                  <option key={v.id} value={v.id}>{v.name} (Pop: {v.population})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Alert Severity Level</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAlertSeverity('RED')}
                  className={`p-2 rounded font-bold text-xs border ${
                    alertSeverity === 'RED' ? 'bg-rose-950 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  RED (Evacuate)
                </button>
                <button
                  type="button"
                  onClick={() => setAlertSeverity('ORANGE')}
                  className={`p-2 rounded font-bold text-xs border ${
                    alertSeverity === 'ORANGE' ? 'bg-amber-950 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  ORANGE (Standby)
                </button>
                <button
                  type="button"
                  onClick={() => setAlertSeverity('YELLOW')}
                  className={`p-2 rounded font-bold text-xs border ${
                    alertSeverity === 'YELLOW' ? 'bg-yellow-950 border-yellow-500 text-yellow-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  YELLOW (Watch)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Warning Broadcast Message</label>
              <textarea 
                rows={3}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-xs focus:border-rose-500 outline-none font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Targeted Dissemination Channels</label>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="flex items-center gap-2 text-slate-200">
                    <Volume2 className="w-4 h-4 text-rose-400" /> Automated High-Decibel Siren Node
                  </span>
                  <span className="text-emerald-400 font-semibold">Active</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="flex items-center gap-2 text-slate-200">
                    <Smartphone className="w-4 h-4 text-cyan-400" /> Mobile App Geo-Push
                  </span>
                  <span className="text-emerald-400 font-semibold">Active</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="flex items-center gap-2 text-slate-200">
                    <MessageSquare className="w-4 h-4 text-amber-400" /> Cell Broadcast & SMS Gateway
                  </span>
                  <span className="text-emerald-400 font-semibold">Active</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="flex items-center gap-2 text-slate-200">
                    <PhoneCall className="w-4 h-4 text-indigo-400" /> Voice IVR Outbound Call Loop
                  </span>
                  <span className="text-emerald-400 font-semibold">Active</span>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-xl shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2 text-sm transition-all"
            >
              <Send className="w-4 h-4" /> Broadcast Multi-Channel Warning
            </button>
          </form>
        </div>

        {/* Live Broadcast Logs */}
        <div className="lg:col-span-2 card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-amber-400" />
                Dissemination Activity Log
              </h3>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
                {alerts.length} Warnings Triggered Today
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No active warnings broadcasted yet. System is monitoring upstream telemetry.
                </div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RiskBadge level={alert.level} />
                        <span className="font-bold text-white text-sm">{alert.targetVillage}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800/80 font-mono">
                      "{alert.message}"
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> SMS Delivery: {alert.channels.smsDeliveryRate}%
                        </span>
                        <span className="flex items-center gap-1 text-cyan-400">
                          <Volume2 className="w-3.5 h-3.5" /> Siren Node: Active
                        </span>
                      </div>
                      <span className="font-semibold text-slate-300">
                        Evacuation Protocol: EVAC-2026-B
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
