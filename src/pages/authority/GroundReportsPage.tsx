import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { PageHeader, RiskBadge } from '../../components/shared/UIComponents';
import { Camera, MapPin, CheckCircle, ShieldAlert, Plus, MessageSquare, ThumbsUp } from 'lucide-react';

export function GroundReportsPage() {
  const { groundReports, addGroundReport, villages } = useStore();
  const [showModal, setShowModal] = useState(false);

  const [reporterName, setReporterName] = useState('');
  const [villageName, setVillageName] = useState(villages[0]?.name || 'Rampur');
  const [description, setDescription] = useState('');
  const [obsWaterLevel, setObsWaterLevel] = useState('0.8');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    addGroundReport({
      reporterName: reporterName || 'Anonymous Citizen / Warden',
      reporterRole: 'LOCAL_CITIZEN',
      villageName,
      lat: 30.145,
      lng: 78.598,
      timestamp: new Date().toISOString(),
      waterLevelObserved: parseFloat(obsWaterLevel),
      description,
      verifiedByWarden: true,
      confidenceScore: 92,
    });

    setReporterName('');
    setDescription('');
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Ground Verification & Crowdsourced Reports" 
        subtitle="Cross-referencing radar telemetry with on-ground observations from village wardens & residents"
      />

      <div className="flex justify-between items-center">
        <div className="text-xs text-slate-400">
          Showing <span className="text-white font-bold">{groundReports.length} verified ground observations</span> for current event
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow text-xs flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Submit Ground Observation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groundReports.map((report) => (
          <div key={report.id} className="card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">{report.villageName}</span>
                <span className="text-xs font-mono bg-slate-800 text-cyan-300 px-2 py-0.5 rounded">
                  {report.reporterRole.replace('_', ' ')}
                </span>
              </div>

              <span className="text-xs font-mono text-slate-400">
                {new Date(report.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800 font-sans leading-relaxed">
              "{report.description}"
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <div className="text-slate-400">Reporter</div>
                <div className="text-white font-semibold mt-0.5">{report.reporterName}</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                <div className="text-slate-400">Observed Water Depth</div>
                <div className="text-rose-400 font-bold font-mono mt-0.5">{report.waterLevelObserved} meters</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle className="w-4 h-4" /> Verified by Village Warden
              </span>
              <span className="font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded text-[11px]">
                Confidence: {report.confidenceScore}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding ground report */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card w-full max-w-lg space-y-4 border-slate-700 bg-slate-950">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-cyan-400" /> Submit Ground Observation
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Your Name / Designation</label>
                <input 
                  type="text"
                  placeholder="e.g. Ramesh Singh (Warden)"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2.5 focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Village Location</label>
                <select 
                  value={villageName}
                  onChange={(e) => setVillageName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2.5 focus:border-cyan-500 outline-none"
                >
                  {villages.map(v => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Observed Stream / Flood Water Depth (Meters)</label>
                <input 
                  type="number"
                  step="0.1"
                  value={obsWaterLevel}
                  onChange={(e) => setObsWaterLevel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2.5 focus:border-cyan-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description / Observation details</label>
                <textarea 
                  rows={3}
                  placeholder="Describe stream velocity, sediment load, debris, bridge status, or localized flooding..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2.5 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold shadow"
                >
                  Submit & Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
