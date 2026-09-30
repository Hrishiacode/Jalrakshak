import React from 'react';
import type { RiskLevel, AlertSeverity, SensorStatus, DataQuality, AckStatus, RouteStatus } from '../../types';

// --- Risk Badge ---
const riskColors: Record<RiskLevel, string> = {
  safe: 'bg-risk-safe text-white',
  watch: 'bg-risk-watch text-white',
  warning: 'bg-risk-warning text-white',
  alert: 'bg-risk-alert text-white',
  evacuate: 'bg-risk-evacuate text-white',
};

const riskLabels: Record<RiskLevel, string> = {
  safe: 'SAFE',
  watch: 'WATCH',
  warning: 'WARNING',
  alert: 'ALERT',
  evacuate: 'EVACUATE',
};

export function RiskBadge({ level, size = 'sm' }: { level: RiskLevel; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5',
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };
  return (
    <span className={`inline-flex items-center font-bold rounded-md tracking-wider ${riskColors[level]} ${sizeClasses[size]} ${level === 'evacuate' ? 'animate-pulse' : ''}`}>
      {riskLabels[level]}
    </span>
  );
}

// --- Stat Card ---
export function StatCard({ label, value, sublabel, color, icon }: {
  label: string;
  value: string | number;
  sublabel?: string;
  color?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="card">
      <div className="card-header flex items-center gap-2">
        {icon}
        {label}
      </div>
      <div className={`text-2xl font-bold ${color || 'text-navy-900'}`}>{value}</div>
      {sublabel && <div className="text-xs text-navy-400 mt-1">{sublabel}</div>}
    </div>
  );
}

// --- TTI Display ---
export function TTIDisplay({ minutes, range, confidence, size = 'md' }: {
  minutes: number;
  range?: { low: number; high: number };
  confidence?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };

  const color = minutes <= 10 ? 'text-risk-evacuate' : minutes <= 20 ? 'text-risk-alert' : minutes <= 35 ? 'text-risk-warning' : 'text-risk-watch';

  return (
    <div className="text-center countdown-active">
      <div className={`${sizeClasses[size]} font-bold ${color} tabular-nums`}>
        {minutes} <span className="text-base font-medium">MIN</span>
      </div>
      <div className="text-[10px] text-navy-400 uppercase tracking-wider font-semibold mt-0.5">
        Time to Impact
      </div>
      {range && (
        <div className="text-xs text-navy-400 mt-1">
          Range: {range.low}–{range.high} min
        </div>
      )}
      {confidence !== undefined && (
        <div className="text-[10px] text-navy-400">
          Confidence: {confidence}%
        </div>
      )}
    </div>
  );
}

// --- Evacuation Margin Display ---
const marginColors: Record<string, string> = {
  safe: 'text-margin-safe',
  caution: 'text-margin-caution',
  critical: 'text-margin-critical',
  negative: 'text-margin-negative',
};

export function MarginDisplay({ margin, status, size = 'md' }: {
  margin: number;
  status: 'safe' | 'caution' | 'critical' | 'negative';
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className="text-center">
      <div className={`${sizeClasses[size]} font-bold ${marginColors[status]} tabular-nums`}>
        {margin > 0 ? '+' : ''}{margin} <span className="text-base font-medium">MIN</span>
      </div>
      <div className="text-[10px] text-navy-400 uppercase tracking-wider font-semibold mt-0.5">
        Evacuation Margin
      </div>
      {status === 'negative' && (
        <div className="text-xs text-risk-evacuate font-semibold mt-1 animate-pulse">
          ⚠ MARGIN EXCEEDED
        </div>
      )}
    </div>
  );
}

// --- Sensor Status Badge ---
const sensorStatusColors: Record<SensorStatus, string> = {
  online: 'bg-risk-safe/10 text-risk-safe border-risk-safe/20',
  warning: 'bg-risk-watch/10 text-risk-watch border-risk-watch/20',
  offline: 'bg-risk-alert/10 text-risk-alert border-risk-alert/20',
  stale: 'bg-navy-200/30 text-navy-500 border-navy-200',
};

export function SensorStatusBadge({ status }: { status: SensorStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${sensorStatusColors[status]}`}>
      <span className={`status-dot ${status}`}></span>
      {status.toUpperCase()}
    </span>
  );
}

// --- Ack Status Badge ---
const ackColors: Record<AckStatus, string> = {
  pending: 'bg-risk-watch/10 text-risk-watch border-risk-watch/20',
  acknowledged: 'bg-risk-safe/10 text-risk-safe border-risk-safe/20',
  escalated: 'bg-risk-alert/10 text-risk-alert border-risk-alert/20',
  expired: 'bg-navy-200/30 text-navy-500 border-navy-200',
};

export function AckStatusBadge({ status }: { status: AckStatus }) {
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase ${ackColors[status]}`}>
      {status}
    </span>
  );
}

// --- Data Quality Banner ---
export function DataQualityBanner({ quality, reason }: { quality: DataQuality; reason?: string }) {
  if (quality === 'high') return null;

  const bgColors: Record<string, string> = {
    medium: 'bg-risk-watch/10 border-risk-watch/30 text-risk-watch',
    low: 'bg-risk-warning/10 border-risk-warning/30 text-risk-warning',
    degraded: 'bg-risk-alert/10 border-risk-alert/30 text-risk-alert',
  };

  return (
    <div className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 ${bgColors[quality]}`}>
      <span>⚠</span>
      <span>DATA QUALITY {quality.toUpperCase()}</span>
      {reason && <span className="text-xs opacity-75">— {reason}</span>}
    </div>
  );
}

// --- Lead Time Ladder ---
export function LeadTimeLadder({ currentLevel }: { currentLevel: RiskLevel }) {
  const levels: { level: RiskLevel; horizon: string; action: string }[] = [
    { level: 'watch', horizon: '24–72 hrs', action: 'Review plans, check sensors' },
    { level: 'warning', horizon: '1–6 hrs', action: 'Prepare evacuation, open safe spaces' },
    { level: 'alert', horizon: 'Min–1 hr', action: 'Notify residents, activate sirens' },
    { level: 'evacuate', horizon: 'Immediate', action: 'Move to safe space immediately' },
  ];

  const levelOrder: Record<RiskLevel, number> = { safe: 0, watch: 1, warning: 2, alert: 3, evacuate: 4 };
  const currentOrder = levelOrder[currentLevel];

  return (
    <div className="space-y-2">
      {levels.map(({ level, horizon, action }) => {
        const order = levelOrder[level];
        const isActive = order <= currentOrder && currentLevel !== 'safe';
        const isCurrent = level === currentLevel;

        return (
          <div
            key={level}
            className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${isCurrent
                ? `${riskColors[level]} border-transparent`
                : isActive
                  ? 'bg-navy-50 border-navy-200'
                  : 'bg-white border-navy-100 opacity-50'
              }`}
          >
            <div className="text-xs font-bold uppercase w-20 tracking-wider">
              {riskLabels[level]}
            </div>
            <div className="text-xs opacity-80 w-20">{horizon}</div>
            <div className="text-xs flex-1">{action}</div>
          </div>
        );
      })}
      {currentLevel === 'safe' && (
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-risk-safe/10 border border-risk-safe/20 text-risk-safe">
          <div className="text-xs font-bold uppercase w-20 tracking-wider">ALL CLEAR</div>
          <div className="text-xs flex-1">No threats detected. Normal operations.</div>
        </div>
      )}
    </div>
  );
}

// --- Page Header ---
export function PageHeader({ title, subtitle, action }: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900">{title}</h1>
        {subtitle && <p className="text-sm text-navy-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <span className="demo-banner">Simulated Demo Data</span>
        {action}
      </div>
    </div>
  );
}

// --- Empty State ---
export function EmptyState({ icon, title, description }: {
  icon?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <span className="text-4xl mb-3">{icon}</span>}
      <h3 className="text-sm font-semibold text-navy-600">{title}</h3>
      <p className="text-xs text-navy-400 mt-1 max-w-xs">{description}</p>
    </div>
  );
}

// --- Loading State ---
export function LoadingState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-data-primary border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-sm text-navy-400">{message || 'Loading...'}</p>
    </div>
  );
}
