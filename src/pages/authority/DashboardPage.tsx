import React from 'react';
import { useStore } from '../../store/useStore';
import { MapView } from '../../components/map/MapView';
import {
  PageHeader, StatCard, RiskBadge, TTIDisplay, MarginDisplay,
  DataQualityBanner, AckStatusBadge, LeadTimeLadder,
} from '../../components/shared/UIComponents';
import { AlertTriangle, Radio, Shield, Users, Activity, Clock, Play, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { RiskLevel } from '../../types';

export function DashboardPage() {
  const navigate = useNavigate();
  const villages = useStore(s => s.villages);
  const risks = useStore(s => s.risks);
  const ttis = useStore(s => s.ttis);
  const evacuationMargins = useStore(s => s.evacuationMargins);
  const alerts = useStore(s => s.alerts);
  const sensors = useStore(s => s.sensors);
  const sensorReadings = useStore(s => s.sensorReadings);
  const simulation = useStore(s => s.simulation);
  const systemStatus = useStore(s => s.systemStatus);
  const dataQuality = useStore(s => s.dataQuality);
  const isDemoRunning = useStore(s => s.isDemoRunning);
  const demoStep = useStore(s => s.demoStep);
  const advanceDemoStep = useStore(s => s.advanceDemoStep);
  const runDemoSequence = useStore(s => s.runDemoSequence);
  const resetScenario = useStore(s => s.resetScenario);
  const stopDemo = useStore(s => s.stopDemo);

  const activeAlerts = alerts.filter(a => a.isActive);
  const onlineSensors = sensors.filter(s => sensorReadings[s.id]?.status === 'online').length;
  const villagesAtRisk = villages.filter(v => risks[v.id] && risks[v.id].riskLevel !== 'safe').length;
  const criticalVillages = villages.filter(v => risks[v.id] && (risks[v.id].riskLevel === 'alert' || risks[v.id].riskLevel === 'evacuate')).length;

  // Get highest risk level
  const maxRiskLevel = villages.reduce<RiskLevel>((max, v) => {
    const r = risks[v.id]?.riskLevel || 'safe';
    const order: Record<RiskLevel, number> = { safe: 0, watch: 1, warning: 2, alert: 3, evacuate: 4 };
    return order[r] > order[max] ? r : max;
  }, 'safe');

  // Average lead time
  const ttiValues = Object.values(ttis).filter(t => t.ttiMinutesBest > 0);
  const avgLeadTime = ttiValues.length > 0
    ? Math.round(ttiValues.reduce((sum, t) => sum + t.ttiMinutesBest, 0) / ttiValues.length)
    : 0;

  const DEMO_DESCRIPTIONS: Record<number, string> = {
    1: 'Normal Day — All systems green, no threats detected.',
    2: 'Heavy Rain Forecast — WATCH status triggered.',
    3: 'Cloudburst at Headwater — Upstream sensor triggered, risk escalating.',
    4: 'Time-to-Impact computed for all downstream villages.',
    5: 'Evacuation Margins calculated. Check the TTI Board.',
    6: 'Alert acknowledgement step — Try acknowledging or failing an alert.',
    7: 'Sensor Failure — System enters degraded confidence mode.',
    8: 'Generate a Drill Report to complete the demo.',
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Command Center"
        subtitle="Live Disaster Intelligence · Demo Valley Catchment"
        action={
          <div className="flex items-center gap-2">
            {!isDemoRunning ? (
              <button
                onClick={runDemoSequence}
                className="flex items-center gap-2 bg-data-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-data-primary/90 transition-colors cursor-pointer"
              >
                <Play size={14} />
                Run Demo Scenario
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={advanceDemoStep}
                  disabled={demoStep >= 8}
                  className="flex items-center gap-2 bg-data-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-data-primary/90 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Step {demoStep}/8
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => { resetScenario(); stopDemo(); }}
                  className="px-3 py-2 text-sm text-navy-500 border border-navy-200 rounded-lg hover:bg-navy-50 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        }
      />

      {/* Demo Step Description */}
      {isDemoRunning && DEMO_DESCRIPTIONS[demoStep] && (
        <div className="mb-4 p-3 bg-data-primary/5 border border-data-primary/20 rounded-lg">
          <div className="text-xs font-semibold text-data-primary uppercase tracking-wider mb-1">Demo Step {demoStep}</div>
          <div className="text-sm text-navy-700">{DEMO_DESCRIPTIONS[demoStep]}</div>
        </div>
      )}

      {/* Data Quality Warning */}
      {dataQuality !== 'high' && (
        <div className="mb-4">
          <DataQualityBanner
            quality={dataQuality}
            reason={simulation.sensorFailures.length > 0 ? `Sensor(s) offline: ${simulation.sensorFailures.join(', ')}` : 'Communication degraded'}
          />
        </div>
      )}

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatCard
          label="System Status"
          value={systemStatus === 'operational' ? 'Operational' : systemStatus === 'degraded' ? 'Degraded' : 'Critical'}
          color={systemStatus === 'operational' ? 'text-risk-safe' : systemStatus === 'degraded' ? 'text-risk-watch' : 'text-risk-alert'}
          icon={<Activity size={12} />}
        />
        <StatCard
          label="Active Alerts"
          value={activeAlerts.length}
          color={activeAlerts.length > 0 ? 'text-risk-alert' : 'text-navy-900'}
          icon={<AlertTriangle size={12} />}
        />
        <StatCard
          label="Villages at Risk"
          value={villagesAtRisk}
          sublabel={`${criticalVillages} critical`}
          color={villagesAtRisk > 0 ? 'text-risk-warning' : 'text-navy-900'}
          icon={<Users size={12} />}
        />
        <StatCard
          label="Sensors Online"
          value={`${onlineSensors}/${sensors.length}`}
          color={onlineSensors < sensors.length ? 'text-risk-watch' : 'text-risk-safe'}
          icon={<Radio size={12} />}
        />
        <StatCard
          label="Avg Lead Time"
          value={avgLeadTime > 0 ? `${avgLeadTime} min` : '—'}
          color="text-data-primary"
          icon={<Clock size={12} />}
        />
        <StatCard
          label="Risk Level"
          value={maxRiskLevel.toUpperCase()}
          color={maxRiskLevel === 'safe' ? 'text-risk-safe' : maxRiskLevel === 'watch' ? 'text-risk-watch' : 'text-risk-alert'}
          icon={<Shield size={12} />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left — Map */}
        <div className="lg:col-span-5 card p-0 overflow-hidden" style={{ minHeight: '400px' }}>
          <div className="p-3 border-b border-navy-100">
            <div className="card-header mb-0">Live Map — Demo Valley</div>
          </div>
          <MapView height="380px" showControls={false} />
        </div>

        {/* Center — TTI Board */}
        <div className="lg:col-span-4">
          <div className="card">
            <div className="card-header">Village Time-to-Impact Board</div>
            <div className="space-y-3">
              {villages.map(v => {
                const risk = risks[v.id];
                const tti = ttis[v.id];
                const margin = evacuationMargins[v.id];
                const riskLevel = risk?.riskLevel || 'safe';

                return (
                  <div
                    key={v.id}
                    className="p-3 rounded-lg border border-navy-100 hover:border-navy-200 transition-colors cursor-pointer"
                    onClick={() => navigate('/tti')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-navy-900 text-sm">{v.name}</span>
                        <RiskBadge level={riskLevel} size="xs" />
                      </div>
                      <span className="text-xs text-navy-400">Pop: {v.population}</span>
                    </div>
                    {tti ? (
                      <div className="flex items-center justify-between">
                        <TTIDisplay minutes={tti.ttiMinutesBest} size="sm" />
                        {margin && <MarginDisplay margin={margin.marginMinutes} status={margin.status} size="sm" />}
                      </div>
                    ) : (
                      <div className="text-xs text-navy-400 py-2">No active threat</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lead Time Ladder */}
          <div className="card mt-4">
            <div className="card-header">Lead-Time Ladder</div>
            <LeadTimeLadder currentLevel={maxRiskLevel} />
          </div>
        </div>

        {/* Right — Alerts Panel */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <span>Active Alerts</span>
              {activeAlerts.length > 0 && (
                <span className="bg-risk-alert text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {activeAlerts.length}
                </span>
              )}
            </div>
            {activeAlerts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-sm text-navy-500 font-medium">No Active Alerts</div>
                <div className="text-xs text-navy-400 mt-1">All villages are in safe status</div>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {activeAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${alert.severity === 'evacuate'
                        ? 'border-risk-evacuate/30 bg-risk-evacuate/5'
                        : alert.severity === 'alert'
                          ? 'border-risk-alert/30 bg-risk-alert/5'
                          : 'border-risk-watch/30 bg-risk-watch/5'
                      }`}
                    onClick={() => navigate('/alerts')}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <RiskBadge level={alert.severity as any} size="xs" />
                      <span className="text-[10px] text-navy-400">{alert.id}</span>
                    </div>
                    <div className="text-sm font-semibold text-navy-900">{alert.villageName}</div>
                    <div className="text-xs text-navy-500 mt-1">{alert.recommendedAction}</div>
                    <div className="flex items-center justify-between mt-2">
                      {alert.ttiMinutes && (
                        <span className="text-xs font-bold text-risk-alert">TTI: {alert.ttiMinutes} min</span>
                      )}
                      <AckStatusBadge status={alert.acknowledgement.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Sensor Status */}
          <div className="card mt-4">
            <div className="card-header">Sensor Overview</div>
            <div className="space-y-2">
              {sensors.map(sensor => {
                const reading = sensorReadings[sensor.id];
                return (
                  <div key={sensor.id} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      <span className={`status-dot ${reading?.status || 'offline'}`}></span>
                      <span className="font-medium text-navy-700">{sensor.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-navy-500 font-semibold tabular-nums">
                        {reading?.value ?? '—'} {reading?.unit ?? ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Info */}
      {simulation.isRunning && (
        <div className="mt-4 card bg-navy-50">
          <div className="card-header">Active Scenario</div>
          <div className="text-sm text-navy-700">{simulation.description}</div>
          <div className="grid grid-cols-4 gap-4 mt-3">
            <div>
              <div className="text-[10px] text-navy-400 uppercase">Rainfall</div>
              <div className="text-sm font-bold text-navy-900">{simulation.rainfallIntensity} mm/h</div>
            </div>
            <div>
              <div className="text-[10px] text-navy-400 uppercase">Soil Saturation</div>
              <div className="text-sm font-bold text-navy-900">{simulation.soilSaturation}%</div>
            </div>
            <div>
              <div className="text-[10px] text-navy-400 uppercase">Stream Level</div>
              <div className="text-sm font-bold text-navy-900">{simulation.streamLevel} m</div>
            </div>
            <div>
              <div className="text-[10px] text-navy-400 uppercase">Upstream Trigger</div>
              <div className={`text-sm font-bold ${simulation.upstreamTrigger ? 'text-risk-alert' : 'text-risk-safe'}`}>
                {simulation.upstreamTrigger ? 'TRIGGERED' : 'Normal'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
