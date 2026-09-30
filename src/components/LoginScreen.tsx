import React from 'react';
import { useStore } from '../store/useStore';
import type { Role } from '../types';

const ROLES: { role: Role; label: string; description: string; icon: string }[] = [
  { role: 'citizen', label: 'Citizen', description: 'View alerts, safe routes, and report hazards', icon: '👤' },
  { role: 'warden', label: 'Village Warden / Jal Mitra', description: 'Monitor village, acknowledge alerts, manage headcount', icon: '🛡️' },
  { role: 'authority', label: 'Authority (DDMA/SDMA)', description: 'Command center dashboard, regional oversight', icon: '🏛️' },
  { role: 'responder', label: 'NDRF / Response Team', description: 'Response priority, staging, task management', icon: '🚨' },
  { role: 'admin', label: 'Admin / Demo', description: 'System health, simulation controls, audit', icon: '⚙️' },
];

export function LoginScreen() {
  const setRole = useStore((s) => s.setRole);

  return (
    <div className="min-h-screen bg-navy-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 bg-data-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
              J
            </div>
            <h1 className="text-3xl font-bold text-navy-900 tracking-tight">JALRAKSHAK</h1>
          </div>
          <p className="text-navy-500 text-sm mt-1">Valley-to-Village Flash Flood Early Warning Platform</p>
          <div className="demo-banner inline-block mt-3">Prototype · Simulated Demo Data</div>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-xl border border-navy-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-navy-600 uppercase tracking-wider mb-4">Select Role to Enter</h2>
          <div className="space-y-3">
            {ROLES.map((r) => (
              <button
                key={r.role}
                onClick={() => setRole(r.role)}
                className="w-full text-left p-4 rounded-lg border border-navy-100 hover:border-data-primary hover:bg-navy-50 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{r.icon}</span>
                  <div>
                    <div className="font-semibold text-navy-900 group-hover:text-data-primary transition-colors">
                      {r.label}
                    </div>
                    <div className="text-sm text-navy-400">{r.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-navy-400">
          Smart India Hackathon 2026 · Problem Statement 26192 · Disaster Management
        </div>
      </div>
    </div>
  );
}
