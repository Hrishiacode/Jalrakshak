import React from 'react';
import { PageHeader } from '../../components/shared/UIComponents';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const accuracyData = [
  { event: 'Monsoon Jul 12', radarLeadTime: 22, actualImpactTime: 20, falseAlarm: false },
  { event: 'Cloudburst Aug 04', radarLeadTime: 18, actualImpactTime: 17, falseAlarm: false },
  { event: 'Spillway Aug 18', radarLeadTime: 45, actualImpactTime: 44, falseAlarm: false },
  { event: 'Surge Sep 02', radarLeadTime: 15, actualImpactTime: 16, falseAlarm: false },
];

export function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Post-Incident Analytics & Model Validation" 
        subtitle="Hydrological model calibration score, lead time gain metrics, and historical accuracy audit"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Model Accuracy Score</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">94.8%</div>
          <div className="text-xs text-slate-400 mt-1">Calibrated on 14 mountain storms</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Average Lead Time Gained</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">+24 minutes</div>
          <div className="text-xs text-slate-400 mt-1">Compared to traditional gauge warning</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">False Alarm Rate</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">&lt; 2.1%</div>
          <div className="text-xs text-slate-400 mt-1">Dual-sensor acoustic validation</div>
        </div>
        <div className="card">
          <div className="text-xs text-slate-400 font-medium">Lives Protected</div>
          <div className="text-2xl font-bold text-white mt-1">4,850+ residents</div>
          <div className="text-xs text-emerald-400 mt-1">Across 3 valley clusters</div>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Predicted vs Actual Time-to-Impact Accuracy Audit
        </h3>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="event" stroke="#94a3b8" />
              <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
              <Area type="monotone" dataKey="radarLeadTime" name="JalRakshak Predicted TTI" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} />
              <Area type="monotone" dataKey="actualImpactTime" name="Actual Peak Water Arrival" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
