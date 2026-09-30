import React from 'react';
import { useStore } from '../../store/useStore';
import { PageHeader, RiskBadge, TTIDisplay, MarginDisplay, DataQualityBanner } from '../../components/shared/UIComponents';
import { Clock, TrendingDown, AlertTriangle } from 'lucide-react';

export function TTIBoardPage() {
  const villages = useStore(s => s.villages);
  const risks = useStore(s => s.risks);
  const ttis = useStore(s => s.ttis);
  const evacuationMargins = useStore(s => s.evacuationMargins);
  const dataQuality = useStore(s => s.dataQuality);
  const simulation = useStore(s => s.simulation);

  return (
    <div className="p-6">
      <PageHeader title="Time-to-Impact Board" subtitle="Estimated time until hazard reaches each downstream village" />

      {dataQuality !== 'high' && (
        <div className="mb-4">
          <DataQualityBanner
            quality={dataQuality}
            reason={simulation.sensorFailures.length > 0 ? `Sensor(s) offline: ${simulation.sensorFailures.join(', ')}` : undefined}
          />
        </div>
      )}

      {Object.keys(ttis).length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-4xl mb-3">🟢</div>
          <h3 className="text-lg font-semibold text-navy-800">No Active Threats</h3>
          <p className="text-sm text-navy-400 mt-1 max-w-md mx-auto">
            Time-to-Impact calculations will appear when upstream sensors detect hazardous conditions.
            Use the Simulation Center to test scenarios.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Response Priority Table */}
          <div className="card">
            <div className="card-header flex items-center gap-2">
              <TrendingDown size={12} />
              Response Priority (Simulated Decision-Support Ranking)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100">
                    <th className="text-left py-2 px-3 text-xs text-navy-400 font-semibold uppercase">Priority</th>
                    <th className="text-left py-2 px-3 text-xs text-navy-400 font-semibold uppercase">Village</th>
                    <th className="text-left py-2 px-3 text-xs text-navy-400 font-semibold uppercase">Risk</th>
                    <th className="text-center py-2 px-3 text-xs text-navy-400 font-semibold uppercase">TTI</th>
                    <th className="text-center py-2 px-3 text-xs text-navy-400 font-semibold uppercase">Evac. Time</th>
                    <th className="text-center py-2 px-3 text-xs text-navy-400 font-semibold uppercase">Margin</th>
                    <th className="text-left py-2 px-3 text-xs text-navy-400 font-semibold uppercase">Population</th>
                    <th className="text-left py-2 px-3 text-xs text-navy-400 font-semibold uppercase">Vulnerability</th>
                    <th className="text-left py-2 px-3 text-xs text-navy-400 font-semibold uppercase">Confidence</th>
                    <th className="text-left py-2 px-3 text-xs text-navy-400 font-semibold uppercase">Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {villages
                    .filter(v => ttis[v.id])
                    .sort((a, b) => {
                      const ma = evacuationMargins[a.id]?.marginMinutes ?? 999;
                      const mb = evacuationMargins[b.id]?.marginMinutes ?? 999;
                      return ma - mb; // Lowest margin = highest priority
                    })
                    .map((v, idx) => {
                      const tti = ttis[v.id];
                      const margin = evacuationMargins[v.id];
                      const risk = risks[v.id];
                      return (
                        <tr key={v.id} className="border-b border-navy-50 hover:bg-navy-50/50">
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${idx === 0 ? 'bg-risk-alert text-white' : 'bg-navy-100 text-navy-600'
                              }`}>
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-navy-900">{v.name}</td>
                          <td className="py-3 px-3"><RiskBadge level={risk?.riskLevel || 'safe'} size="xs" /></td>
                          <td className="py-3 px-3 text-center">
                            <div className="font-bold text-lg text-navy-900 tabular-nums">{tti.ttiMinutesBest} min</div>
                            <div className="text-[10px] text-navy-400">{tti.ttiMinutesLow}–{tti.ttiMinutesHigh}</div>
                          </td>
                          <td className="py-3 px-3 text-center text-sm text-navy-600">{v.evacuationTimeMinutes} min</td>
                          <td className="py-3 px-3 text-center">
                            {margin && (
                              <span className={`text-lg font-bold ${margin.status === 'safe' ? 'text-margin-safe' :
                                  margin.status === 'caution' ? 'text-margin-caution' :
                                    margin.status === 'critical' ? 'text-margin-critical' : 'text-margin-negative'
                                }`}>
                                {margin.marginMinutes > 0 ? '+' : ''}{margin.marginMinutes}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-sm text-navy-600">{v.population}</td>
                          <td className="py-3 px-3">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${v.vulnerability === 'high' ? 'bg-risk-alert/10 text-risk-alert' :
                                v.vulnerability === 'medium' ? 'bg-risk-watch/10 text-risk-watch' :
                                  'bg-risk-safe/10 text-risk-safe'
                              }`}>
                              {v.vulnerability}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-sm text-navy-600">{risk?.confidence ?? '—'}%</td>
                          <td className="py-3 px-3 text-xs text-navy-500 max-w-48">{margin?.recommendation}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Village Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {villages.filter(v => ttis[v.id]).map(v => {
              const tti = ttis[v.id];
              const margin = evacuationMargins[v.id];
              const risk = risks[v.id];

              return (
                <div key={v.id} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-navy-900">{v.name}</h3>
                    <RiskBadge level={risk?.riskLevel || 'safe'} />
                  </div>

                  <div className="flex items-center justify-around py-4 border-y border-navy-100">
                    <TTIDisplay
                      minutes={tti.ttiMinutesBest}
                      range={{ low: tti.ttiMinutesLow, high: tti.ttiMinutesHigh }}
                      confidence={tti.confidence}
                      size="lg"
                    />
                    {margin && (
                      <MarginDisplay margin={margin.marginMinutes} status={margin.status} size="md" />
                    )}
                  </div>

                  {margin && (
                    <div className="mt-4 space-y-2">
                      <div className="text-[10px] text-navy-400 uppercase font-semibold tracking-wider">Evacuation Breakdown</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 bg-navy-50 rounded">
                          <div className="font-bold text-navy-700">{margin.alertDelayMinutes} min</div>
                          <div className="text-[10px] text-navy-400">Alert Delay</div>
                        </div>
                        <div className="text-center p-2 bg-navy-50 rounded">
                          <div className="font-bold text-navy-700">{margin.mobilizationMinutes} min</div>
                          <div className="text-[10px] text-navy-400">Mobilization</div>
                        </div>
                        <div className="text-center p-2 bg-navy-50 rounded">
                          <div className="font-bold text-navy-700">{margin.travelMinutes} min</div>
                          <div className="text-[10px] text-navy-400">Travel</div>
                        </div>
                      </div>

                      {margin.status === 'negative' && (
                        <div className="p-2 bg-risk-evacuate/10 border border-risk-evacuate/20 rounded text-xs text-risk-evacuate font-semibold text-center animate-pulse">
                          ⚠ EVACUATION MARGIN EXCEEDED — Immediate action required
                        </div>
                      )}

                      <div className="text-xs text-navy-500 p-2 bg-navy-50 rounded">
                        <strong>Recommendation:</strong> {margin.recommendation}
                      </div>
                    </div>
                  )}

                  {risk?.degradedSensors && risk.degradedSensors.length > 0 && (
                    <div className="mt-3 p-2 bg-risk-watch/10 border border-risk-watch/20 rounded text-xs text-risk-watch flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Degraded confidence — Sensors offline: {risk.degradedSensors.join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
