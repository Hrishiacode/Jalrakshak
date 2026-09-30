// ============================================================
// JALRAKSHAK — Central State Store (Zustand)
// ============================================================
// Single source of truth. Simulation engine modifies this store.
// All UI components read from here.

import { create } from 'zustand';
import type {
  Role, RiskLevel, DataQuality, SimulationScenario, SimulationState,
  Village, Sensor, SensorReading, RiskAssessment, TimeToImpact,
  EvacuationMargin, Alert, SafeSpace, GroundReport, CatchmentNode,
  Route, Incident, ResponseTeam, DrillRun, ReliefCampaign, User,
  AlertSeverity, AckStatus, EscalationLevel, AnalyticsData, TimeSeriesPoint,
} from '../types';
import {
  VILLAGES, SENSORS, SAFE_SPACES, ROUTES, RESPONSE_TEAMS, RELIEF_CAMPAIGNS,
  DEMO_USERS, getDefaultSensorReadings, getDefaultCatchmentNodes,
} from '../data/demoData';

// --- Helper to generate IDs ---
let alertCounter = 0;
const genAlertId = () => `ALT-${String(++alertCounter).padStart(4, '0')}`;
let reportCounter = 0;
const genReportId = () => `RPT-${String(++reportCounter).padStart(4, '0')}`;
let drillCounter = 0;
const genDrillId = () => `DRL-${String(++drillCounter).padStart(3, '0')}`;

// --- Scenario Configurations ---
const SCENARIO_CONFIGS: Record<SimulationScenario, {
  description: string;
  rainfall: number;
  soilSaturation: number;
  streamLevel: number;
  streamRiseRate: number;
  upstreamTrigger: boolean;
  sensorFailures: string[];
  communicationDegraded: boolean;
}> = {
  normal: {
    description: 'Normal conditions. Light rain, stable soil, low stream levels.',
    rainfall: 12, soilSaturation: 42, streamLevel: 0.3, streamRiseRate: 0,
    upstreamTrigger: false, sensorFailures: [], communicationDegraded: false,
  },
  heavy_rain: {
    description: 'Heavy sustained rainfall. Soil wetting, stream rising slowly.',
    rainfall: 65, soilSaturation: 68, streamLevel: 0.8, streamRiseRate: 0.2,
    upstreamTrigger: false, sensorFailures: [], communicationDegraded: false,
  },
  extreme_rain: {
    description: 'Extreme rainfall intensity. High risk developing.',
    rainfall: 110, soilSaturation: 82, streamLevel: 1.4, streamRiseRate: 0.6,
    upstreamTrigger: false, sensorFailures: [], communicationDegraded: false,
  },
  rapid_saturation: {
    description: 'Soil reaching saturation point rapidly after prolonged rain.',
    rainfall: 85, soilSaturation: 94, streamLevel: 1.1, streamRiseRate: 0.4,
    upstreamTrigger: false, sensorFailures: [], communicationDegraded: false,
  },
  cloudburst_headwater: {
    description: 'Cloudburst detected at headwater. Upstream sensor triggered. Flash flood risk imminent.',
    rainfall: 180, soilSaturation: 91, streamLevel: 2.2, streamRiseRate: 1.4,
    upstreamTrigger: true, sensorFailures: [], communicationDegraded: false,
  },
  landslide_dam_release: {
    description: 'Landslide dam breach upstream. Sudden water release detected.',
    rainfall: 45, soilSaturation: 75, streamLevel: 3.0, streamRiseRate: 2.5,
    upstreamTrigger: true, sensorFailures: [], communicationDegraded: false,
  },
  sensor_failure: {
    description: 'Critical stream-level sensor has gone offline. Degraded data quality.',
    rainfall: 95, soilSaturation: 78, streamLevel: 1.2, streamRiseRate: 0.5,
    upstreamTrigger: false, sensorFailures: ['SL-001'], communicationDegraded: false,
  },
  communication_outage: {
    description: 'Partial communication outage. Some sensors reporting stale data.',
    rainfall: 88, soilSaturation: 80, streamLevel: 1.3, streamRiseRate: 0.5,
    upstreamTrigger: false, sensorFailures: ['TV-001'], communicationDegraded: true,
  },
};

// --- Risk Calculation ---
function calculateRiskLevel(rainfall: number, soilSat: number, streamLevel: number, upstreamTrigger: boolean): RiskLevel {
  if (upstreamTrigger && streamLevel > 2.0) return 'evacuate';
  if (upstreamTrigger || (rainfall > 100 && soilSat > 85)) return 'alert';
  if (rainfall > 60 && soilSat > 70) return 'warning';
  if (rainfall > 40 || soilSat > 60) return 'watch';
  return 'safe';
}

function calculateRiskScore(rainfall: number, soilSat: number, streamLevel: number, upstreamTrigger: boolean): number {
  let score = 0;
  score += Math.min(rainfall / 200, 1) * 35;
  score += Math.min(soilSat / 100, 1) * 25;
  score += Math.min(streamLevel / 3, 1) * 25;
  if (upstreamTrigger) score += 15;
  return Math.round(Math.min(score, 100));
}

function riskLevelToSeverity(risk: RiskLevel): AlertSeverity | null {
  if (risk === 'safe') return null;
  return risk as AlertSeverity;
}

// --- TTI Calculation ---
function calculateTTI(
  villageIndex: number, // 0-based downstream position
  rainfall: number,
  streamRiseRate: number,
  upstreamTrigger: boolean,
): { low: number; high: number; best: number } | null {
  if (!upstreamTrigger && rainfall < 80) return null;

  // Base travel time increases with distance downstream
  const baseTimes = [18, 29, 43]; // minutes per village
  const base = baseTimes[villageIndex] || 45;

  // Adjust based on intensity
  const intensityFactor = upstreamTrigger ? 0.85 : (rainfall > 120 ? 0.9 : 1.0);
  const best = Math.round(base * intensityFactor);
  const low = Math.round(best * 0.85);
  const high = Math.round(best * 1.15);

  return { low, high, best };
}

// --- Store Interface ---
interface JalRakshakStore {
  // Auth
  currentUser: User;
  currentRole: Role;
  setRole: (role: Role) => void;

  // Simulation
  simulation: SimulationState;
  runScenario: (scenario: SimulationScenario) => void;
  resetScenario: () => void;
  runDemoSequence: () => void;
  demoStep: number;
  isDemoRunning: boolean;
  advanceDemoStep: () => void;
  stopDemo: () => void;

  // Core Data
  villages: Village[];
  sensors: Sensor[];
  sensorReadings: Record<string, SensorReading>;
  risks: Record<string, RiskAssessment>;
  ttis: Record<string, TimeToImpact>;
  evacuationMargins: Record<string, EvacuationMargin>;
  alerts: Alert[];
  safeSpaces: SafeSpace[];
  groundReports: GroundReport[];
  catchmentNodes: CatchmentNode[];
  routes: Route[];
  incidents: Incident[];
  responseTeams: ResponseTeam[];
  drillRuns: DrillRun[];
  reliefCampaigns: ReliefCampaign[];

  // Derived
  systemStatus: 'operational' | 'degraded' | 'critical';
  dataQuality: DataQuality;
  analyticsData: AnalyticsData;

  // Actions
  acknowledgeAlert: (alertId: string) => void;
  failAcknowledgement: (alertId: string) => void;
  submitGroundReport: (report: Omit<GroundReport, 'id' | 'timestamp' | 'verification'>) => void;
  triggerSensorFailure: (sensorId: string) => void;
  restoreSensor: (sensorId: string) => void;
  updateHeadcount: (safeSpaceId: string, count: number) => void;
  runDrill: () => void;
}

// --- Generate Analytics Data ---
function generateAnalytics(sim: SimulationState): AnalyticsData {
  const now = Date.now();
  const points = 24;
  const makeTimeSeries = (baseFn: (i: number) => number): TimeSeriesPoint[] =>
    Array.from({ length: points }, (_, i) => ({
      timestamp: new Date(now - (points - i) * 3600000).toISOString(),
      value: baseFn(i),
    }));

  return {
    rainfallTrend: makeTimeSeries(i => {
      const base = i < 18 ? 10 + Math.random() * 10 : sim.rainfallIntensity * (0.3 + (i - 18) / 8);
      return Math.round(base);
    }),
    soilSaturationTrend: makeTimeSeries(i => {
      const base = i < 18 ? 35 + Math.random() * 10 : sim.soilSaturation * (0.5 + (i - 18) / 12);
      return Math.round(Math.min(base, 100));
    }),
    streamLevelTrend: makeTimeSeries(i => {
      const base = i < 18 ? 0.2 + Math.random() * 0.1 : sim.streamLevel * (0.3 + (i - 18) / 10);
      return Math.round(base * 100) / 100;
    }),
    riskTrend: makeTimeSeries(i => {
      const risk = calculateRiskScore(
        i < 18 ? 12 : sim.rainfallIntensity * ((i - 18) / 6),
        i < 18 ? 42 : sim.soilSaturation * ((i - 18) / 6),
        i < 18 ? 0.3 : sim.streamLevel * ((i - 18) / 6),
        i >= 22 && sim.upstreamTrigger,
      );
      return risk;
    }),
    ttiTrend: makeTimeSeries(i => i >= 20 && sim.upstreamTrigger ? 50 - (i - 20) * 8 : 0),
    alertAckTimes: makeTimeSeries(i => (i > 20 ? Math.round(30 + Math.random() * 60) : 0)),
    escalationEvents: makeTimeSeries(i => (i > 22 ? Math.round(Math.random() * 2) : 0)),
    sensorUptime: makeTimeSeries(() => sim.sensorFailures.length > 0 ? 75 : 98 + Math.random() * 2),
  };
}

// --- The Store ---
export const useStore = create<JalRakshakStore>((set, get) => ({
  // Auth
  currentUser: DEMO_USERS.authority,
  currentRole: 'authority',
  setRole: (role: Role) => set({
    currentRole: role,
    currentUser: DEMO_USERS[role],
  }),

  // Simulation
  simulation: {
    scenario: 'normal',
    isRunning: false,
    step: 0,
    totalSteps: 0,
    description: SCENARIO_CONFIGS.normal.description,
    rainfallIntensity: 12,
    soilSaturation: 42,
    streamLevel: 0.3,
    streamRiseRate: 0,
    upstreamTrigger: false,
    sensorFailures: [],
    communicationDegraded: false,
  },
  demoStep: 0,
  isDemoRunning: false,

  runScenario: (scenario: SimulationScenario) => {
    const config = SCENARIO_CONFIGS[scenario];
    const now = new Date().toISOString();
    const sim: SimulationState = {
      scenario,
      isRunning: true,
      startedAt: now,
      step: 1,
      totalSteps: 1,
      description: config.description,
      rainfallIntensity: config.rainfall,
      soilSaturation: config.soilSaturation,
      streamLevel: config.streamLevel,
      streamRiseRate: config.streamRiseRate,
      upstreamTrigger: config.upstreamTrigger,
      sensorFailures: config.sensorFailures,
      communicationDegraded: config.communicationDegraded,
    };

    // Update sensor readings
    const readings = getDefaultSensorReadings();
    readings['RG-001'] = { ...readings['RG-001'], value: config.rainfall, unit: 'mm/h', timestamp: now };
    readings['SM-001'] = { ...readings['SM-001'], value: config.soilSaturation, unit: '%', timestamp: now };
    readings['SL-001'] = { ...readings['SL-001'], value: config.streamLevel, unit: 'm', timestamp: now };

    // Apply sensor failures
    for (const sId of config.sensorFailures) {
      if (readings[sId]) {
        readings[sId] = { ...readings[sId], status: 'offline', battery: 0, signal: 0, lastHeartbeat: new Date(Date.now() - 600000).toISOString() };
      }
    }
    if (config.communicationDegraded) {
      readings['TV-001'] = { ...readings['TV-001'], status: 'stale', signal: 12, lastHeartbeat: new Date(Date.now() - 300000).toISOString() };
    }

    // Sensor statuses for warnings
    if (config.rainfall > 100) readings['RG-001'].status = 'warning';
    if (config.soilSaturation > 85) readings['SM-001'].status = 'warning';
    if (config.streamLevel > 1.5) readings['SL-001'].status = 'warning';

    // Calculate risks
    const risks: Record<string, RiskAssessment> = {};
    const ttis: Record<string, TimeToImpact> = {};
    const margins: Record<string, EvacuationMargin> = {};
    const hasSensorFailure = config.sensorFailures.length > 0;
    const quality: DataQuality = hasSensorFailure ? 'degraded' : (config.communicationDegraded ? 'low' : 'high');
    const confidenceBase = hasSensorFailure ? 55 : (config.communicationDegraded ? 65 : 90);

    VILLAGES.forEach((v, idx) => {
      // Downstream attenuation
      const distanceFactor = 1 - idx * 0.1;
      const effectiveRainfall = config.rainfall * distanceFactor;
      const effectiveSoil = config.soilSaturation * distanceFactor;
      const effectiveStream = config.streamLevel * (1 - idx * 0.05);

      const riskLevel = calculateRiskLevel(effectiveRainfall, effectiveSoil, effectiveStream, config.upstreamTrigger);
      const riskScore = calculateRiskScore(effectiveRainfall, effectiveSoil, effectiveStream, config.upstreamTrigger);

      risks[v.id] = {
        villageId: v.id,
        timestamp: now,
        riskLevel,
        riskScore,
        confidence: Math.round(confidenceBase - idx * 3),
        dataQuality: quality,
        factors: [
          { name: 'Rainfall Intensity', value: effectiveRainfall, weight: 0.35, contribution: effectiveRainfall / 200 * 35, source: 'observed' },
          { name: 'Soil Saturation', value: effectiveSoil, weight: 0.25, contribution: effectiveSoil / 100 * 25, source: 'observed' },
          { name: 'Stream Level', value: effectiveStream, weight: 0.25, contribution: effectiveStream / 3 * 25, source: 'observed' },
          { name: 'Upstream Trigger', value: config.upstreamTrigger ? 1 : 0, weight: 0.15, contribution: config.upstreamTrigger ? 15 : 0, source: 'observed' },
        ],
        degradedSensors: config.sensorFailures,
      };

      // TTI
      const ttiCalc = calculateTTI(idx, config.rainfall, config.streamRiseRate, config.upstreamTrigger);
      if (ttiCalc) {
        ttis[v.id] = {
          villageId: v.id,
          timestamp: now,
          ttiMinutesLow: ttiCalc.low,
          ttiMinutesHigh: ttiCalc.high,
          ttiMinutesBest: ttiCalc.best,
          confidence: confidenceBase - idx * 5,
          source: 'hybrid',
          dataLabel: 'simulated',
        };

        // Evacuation Margin
        const marginMinutes = ttiCalc.best - v.evacuationTimeMinutes;
        let marginStatus: 'safe' | 'caution' | 'critical' | 'negative';
        if (marginMinutes > 10) marginStatus = 'safe';
        else if (marginMinutes > 5) marginStatus = 'caution';
        else if (marginMinutes > 0) marginStatus = 'critical';
        else marginStatus = 'negative';

        let recommendation = 'Monitor situation';
        if (marginStatus === 'negative') recommendation = 'IMMEDIATE EVACUATION — Consider vertical evacuation / higher ground';
        else if (marginStatus === 'critical') recommendation = 'Begin evacuation immediately. Limited time available.';
        else if (marginStatus === 'caution') recommendation = 'Prepare for evacuation. Move vulnerable populations first.';

        margins[v.id] = {
          villageId: v.id,
          timestamp: now,
          ttiMinutes: ttiCalc.best,
          alertDelayMinutes: v.alertDelayMinutes,
          mobilizationMinutes: v.mobilizationMinutes,
          travelMinutes: v.travelMinutes,
          totalEvacuationMinutes: v.evacuationTimeMinutes,
          marginMinutes,
          status: marginStatus,
          recommendation,
        };
      }
    });

    // Generate alerts for at-risk villages
    const alerts: Alert[] = [];
    VILLAGES.forEach(v => {
      const risk = risks[v.id];
      if (risk && risk.riskLevel !== 'safe') {
        const severity = riskLevelToSeverity(risk.riskLevel);
        if (severity) {
          const tti = ttis[v.id];
          const margin = margins[v.id];
          const actionMap: Record<AlertSeverity, string> = {
            watch: 'Review preparedness plans. Check sensor readings.',
            warning: 'Prepare evacuation. Open safe spaces. Ready sirens.',
            alert: 'Notify residents. Activate sirens. Begin evacuation.',
            evacuate: 'IMMEDIATE EVACUATION. Move all residents to safe spaces.',
          };
          alerts.push({
            id: genAlertId(),
            severity,
            villageId: v.id,
            villageName: v.name,
            timestamp: now,
            source: config.upstreamTrigger ? 'Upstream Sensor Trigger' : 'Risk Assessment Engine',
            ttiMinutes: tti?.ttiMinutesBest,
            evacuationMargin: margin?.marginMinutes,
            recommendedAction: actionMap[severity],
            channels: severity === 'evacuate'
              ? ['app', 'sms', 'ivr', 'siren', 'dashboard']
              : severity === 'alert'
                ? ['app', 'sms', 'siren', 'dashboard']
                : ['app', 'dashboard'],
            acknowledgement: {
              status: 'pending',
              timeoutSeconds: severity === 'evacuate' ? 60 : severity === 'alert' ? 120 : 300,
              elapsedSeconds: 0,
            },
            escalation: {
              level: 'warden',
              chain: [{
                level: 'warden',
                notifiedAt: now,
                acknowledged: false,
              }],
            },
            isActive: true,
          });
        }
      }
    });

    // Update catchment nodes
    const nodes = getDefaultCatchmentNodes();
    const riskToNodeStatus = (riskLevel: RiskLevel) => riskLevel;
    nodes[0].status = config.upstreamTrigger ? 'alert' : (config.rainfall > 60 ? 'warning' : 'safe');
    nodes[0].data = { rainfall: config.rainfall, waterLevel: config.streamLevel };
    nodes[1].status = config.sensorFailures.includes('RG-001') ? 'warning' : nodes[0].status;
    nodes[1].data = { sensorState: config.sensorFailures.includes('RG-001') ? 'offline' : 'online', rainfall: config.rainfall };
    nodes[2].status = config.streamLevel > 1.5 ? 'warning' : (config.streamLevel > 2.0 ? 'alert' : 'safe');
    nodes[2].data = { waterLevel: config.streamLevel };

    VILLAGES.forEach((v, idx) => {
      const nodeIdx = 3 + idx * 2; // village nodes are at 3, 5, 7
      if (nodes[nodeIdx]) {
        nodes[nodeIdx].status = risks[v.id]?.riskLevel || 'safe';
        nodes[nodeIdx].data = {
          riskScore: risks[v.id]?.riskScore || 0,
          tti: ttis[v.id]?.ttiMinutesBest,
        };
      }
      const reachIdx = 4 + idx * 2; // reach nodes between villages
      if (nodes[reachIdx]) {
        nodes[reachIdx].status = risks[v.id]?.riskLevel || 'safe';
        nodes[reachIdx].data = { waterLevel: config.streamLevel * (0.9 - idx * 0.1) };
      }
    });

    // Update routes if extreme
    const updatedRoutes = [...ROUTES];
    if (config.streamLevel > 2.0) {
      // Bridge road becomes unsafe
      updatedRoutes[1] = {
        ...updatedRoutes[1],
        status: 'unsafe',
        segments: updatedRoutes[1].segments.map((s, i) =>
          i === 0 ? { ...s, status: 'unsafe', hazards: ['Bridge at risk — high water level'] } : s
        ),
      };
    }

    // System status
    const sysStatus = config.sensorFailures.length > 0 ? 'degraded' as const : (config.upstreamTrigger ? 'critical' as const : 'operational' as const);

    set({
      simulation: sim,
      sensorReadings: readings,
      risks,
      ttis,
      evacuationMargins: margins,
      alerts,
      catchmentNodes: nodes,
      routes: updatedRoutes,
      systemStatus: sysStatus,
      dataQuality: quality,
      analyticsData: generateAnalytics(sim),
    });
  },

  resetScenario: () => {
    alertCounter = 0;
    set({
      simulation: {
        scenario: 'normal',
        isRunning: false,
        step: 0,
        totalSteps: 0,
        description: SCENARIO_CONFIGS.normal.description,
        rainfallIntensity: 12,
        soilSaturation: 42,
        streamLevel: 0.3,
        streamRiseRate: 0,
        upstreamTrigger: false,
        sensorFailures: [],
        communicationDegraded: false,
      },
      sensorReadings: getDefaultSensorReadings(),
      risks: {},
      ttis: {},
      evacuationMargins: {},
      alerts: [],
      catchmentNodes: getDefaultCatchmentNodes(),
      routes: ROUTES,
      systemStatus: 'operational',
      dataQuality: 'high',
      demoStep: 0,
      isDemoRunning: false,
      analyticsData: generateAnalytics({
        scenario: 'normal', isRunning: false, step: 0, totalSteps: 0,
        description: '', rainfallIntensity: 12, soilSaturation: 42,
        streamLevel: 0.3, streamRiseRate: 0, upstreamTrigger: false,
        sensorFailures: [], communicationDegraded: false,
      }),
    });
  },

  runDemoSequence: () => {
    set({ isDemoRunning: true, demoStep: 1 });
    get().runScenario('normal');
  },

  advanceDemoStep: () => {
    const step = get().demoStep + 1;
    set({ demoStep: step });
    const scenarioByStep: Record<number, SimulationScenario> = {
      1: 'normal',
      2: 'heavy_rain',
      3: 'cloudburst_headwater',
      4: 'cloudburst_headwater', // TTI appears (same scenario, data already computed)
      5: 'cloudburst_headwater', // Evacuation margin (same)
      6: 'cloudburst_headwater', // Ack step (handled in UI)
      7: 'sensor_failure',
      8: 'sensor_failure', // Drill report step
    };
    const scenario = scenarioByStep[step];
    if (scenario && step <= 3) {
      get().runScenario(scenario);
    } else if (step === 7) {
      get().runScenario('sensor_failure');
    } else if (step > 8) {
      set({ isDemoRunning: false });
    }
  },

  stopDemo: () => set({ isDemoRunning: false, demoStep: 0 }),

  // Core Data
  villages: VILLAGES,
  sensors: SENSORS,
  sensorReadings: getDefaultSensorReadings(),
  risks: {},
  ttis: {},
  evacuationMargins: {},
  alerts: [],
  safeSpaces: SAFE_SPACES,
  groundReports: [],
  catchmentNodes: getDefaultCatchmentNodes(),
  routes: ROUTES,
  incidents: [],
  responseTeams: RESPONSE_TEAMS,
  drillRuns: [],
  reliefCampaigns: RELIEF_CAMPAIGNS,

  systemStatus: 'operational',
  dataQuality: 'high',
  analyticsData: generateAnalytics({
    scenario: 'normal', isRunning: false, step: 0, totalSteps: 0,
    description: '', rainfallIntensity: 12, soilSaturation: 42,
    streamLevel: 0.3, streamRiseRate: 0, upstreamTrigger: false,
    sensorFailures: [], communicationDegraded: false,
  }),

  // Actions
  acknowledgeAlert: (alertId: string) => {
    set(state => ({
      alerts: state.alerts.map(a => a.id === alertId ? {
        ...a,
        acknowledgement: {
          ...a.acknowledgement,
          status: 'acknowledged' as AckStatus,
          acknowledgedBy: state.currentUser.name,
          acknowledgedAt: new Date().toISOString(),
        },
      } : a),
    }));
  },

  failAcknowledgement: (alertId: string) => {
    const now = new Date().toISOString();
    set(state => ({
      alerts: state.alerts.map(a => {
        if (a.id !== alertId) return a;
        const levels: EscalationLevel[] = ['warden', 'ward_member', 'sarpanch', 'block_officer', 'ddma_control_room'];
        const currentIdx = levels.indexOf(a.escalation.level);
        const nextIdx = Math.min(currentIdx + 1, levels.length - 1);
        const nextLevel = levels[nextIdx];
        return {
          ...a,
          acknowledgement: {
            ...a.acknowledgement,
            status: 'escalated' as AckStatus,
            elapsedSeconds: a.acknowledgement.timeoutSeconds,
          },
          escalation: {
            level: nextLevel,
            escalatedAt: now,
            chain: [
              ...a.escalation.chain.map(s => ({
                ...s,
                acknowledged: false,
              })),
              {
                level: nextLevel,
                notifiedAt: now,
                acknowledged: false,
              },
            ],
          },
        };
      }),
    }));
  },

  submitGroundReport: (report) => {
    const newReport: GroundReport = {
      ...report,
      id: genReportId(),
      timestamp: new Date().toISOString(),
      verification: 'unverified',
    };
    set(state => ({
      groundReports: [...state.groundReports, newReport],
    }));
  },

  triggerSensorFailure: (sensorId: string) => {
    set(state => {
      const readings = { ...state.sensorReadings };
      if (readings[sensorId]) {
        readings[sensorId] = {
          ...readings[sensorId],
          status: 'offline',
          battery: 0,
          signal: 0,
          lastHeartbeat: new Date(Date.now() - 600000).toISOString(),
        };
      }
      const sim = {
        ...state.simulation,
        sensorFailures: [...state.simulation.sensorFailures, sensorId],
      };
      return {
        sensorReadings: readings,
        simulation: sim,
        systemStatus: 'degraded' as const,
        dataQuality: 'degraded' as DataQuality,
      };
    });
  },

  restoreSensor: (sensorId: string) => {
    set(state => {
      const readings = { ...state.sensorReadings };
      if (readings[sensorId]) {
        readings[sensorId] = {
          ...readings[sensorId],
          status: 'online',
          battery: 85,
          signal: 90,
          lastHeartbeat: new Date().toISOString(),
        };
      }
      const sim = {
        ...state.simulation,
        sensorFailures: state.simulation.sensorFailures.filter(s => s !== sensorId),
      };
      const hasFailures = sim.sensorFailures.length > 0;
      return {
        sensorReadings: readings,
        simulation: sim,
        systemStatus: hasFailures ? 'degraded' as const : 'operational' as const,
        dataQuality: hasFailures ? 'degraded' as DataQuality : 'high' as DataQuality,
      };
    });
  },

  updateHeadcount: (safeSpaceId: string, count: number) => {
    set(state => ({
      safeSpaces: state.safeSpaces.map(s =>
        s.id === safeSpaceId
          ? { ...s, availableCapacity: Math.max(0, s.capacity - count) }
          : s
      ),
    }));
  },

  runDrill: () => {
    const state = get();
    const now = new Date().toISOString();
    const drill: DrillRun = {
      id: genDrillId(),
      startedAt: now,
      completedAt: now,
      scenario: state.simulation.scenario,
      totalAlertTime: 45,
      acknowledgementDelay: state.alerts.some(a => a.acknowledgement.status === 'acknowledged') ? 28 : 0,
      escalationCount: state.alerts.filter(a => a.acknowledgement.status === 'escalated').length,
      villagesReached: state.alerts.filter(a => a.acknowledgement.status === 'acknowledged').length,
      missedAcknowledgements: state.alerts.filter(a => a.acknowledgement.status === 'pending' || a.acknowledgement.status === 'escalated').length,
      sensorFailures: state.simulation.sensorFailures.length,
      evacuationStatus: state.alerts.some(a => a.severity === 'evacuate') ? 'Evacuation Initiated' : 'Standby',
      report: {
        alertTime: '00:00:45',
        acknowledgementTime: state.alerts.some(a => a.acknowledgement.status === 'acknowledged') ? '00:00:28' : 'N/A',
        escalationTime: state.alerts.some(a => a.acknowledgement.status === 'escalated') ? '00:02:15' : 'N/A',
        evacuationRecommendation: state.evacuationMargins['village-aarohi']?.recommendation || 'No evacuation required',
        overallScore: Math.round(
          (state.alerts.filter(a => a.acknowledgement.status === 'acknowledged').length / Math.max(state.alerts.length, 1)) * 100
        ),
        findings: [
          `${state.alerts.length} alerts generated across ${state.villages.length} villages`,
          `${state.alerts.filter(a => a.acknowledgement.status === 'acknowledged').length} alerts acknowledged`,
          `${state.alerts.filter(a => a.acknowledgement.status === 'escalated').length} alerts escalated`,
          `${state.simulation.sensorFailures.length} sensor failure(s) during drill`,
          state.simulation.sensorFailures.length > 0 ? 'System operated in degraded confidence mode' : 'All sensors operational',
        ],
        recommendations: [
          'Conduct regular sensor maintenance checks',
          'Review escalation timeout thresholds',
          'Ensure all wardens have backup communication methods',
          'Update evacuation route maps quarterly',
        ],
      },
    };

    set(state => ({
      drillRuns: [...state.drillRuns, drill],
    }));
  },
}));
