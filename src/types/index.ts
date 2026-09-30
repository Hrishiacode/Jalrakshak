// ============================================================
// JALRAKSHAK — Core Data Models
// ============================================================

// --- Enums ---

export type Role = 'citizen' | 'warden' | 'authority' | 'responder' | 'admin';

export type RiskLevel = 'safe' | 'watch' | 'warning' | 'alert' | 'evacuate';

export type AlertSeverity = 'watch' | 'warning' | 'alert' | 'evacuate';

export type AlertChannel = 'app' | 'sms' | 'ivr' | 'siren' | 'cell_broadcast' | 'dashboard';

export type AckStatus = 'pending' | 'acknowledged' | 'escalated' | 'expired';

export type SensorType = 'rain_gauge' | 'soil_moisture' | 'stream_level' | 'tilt' | 'vibration';

export type SensorStatus = 'online' | 'warning' | 'offline' | 'stale';

export type GroundReportType =
  | 'rising_river'
  | 'muddy_water'
  | 'debris_flow'
  | 'blocked_drainage'
  | 'road_damage'
  | 'bridge_damage'
  | 'slope_movement'
  | 'landslide_dam';

export type ReportVerification = 'unverified' | 'verified' | 'rejected';

export type RouteStatus = 'safe' | 'caution' | 'unsafe' | 'blocked';

export type DataQuality = 'high' | 'medium' | 'low' | 'degraded';

export type SimulationScenario =
  | 'normal'
  | 'heavy_rain'
  | 'extreme_rain'
  | 'rapid_saturation'
  | 'cloudburst_headwater'
  | 'landslide_dam_release'
  | 'sensor_failure'
  | 'communication_outage';

export type EscalationLevel =
  | 'warden'
  | 'ward_member'
  | 'sarpanch'
  | 'block_officer'
  | 'ddma_control_room';

// --- Core Interfaces ---

export interface User {
  id: string;
  name: string;
  role: Role;
  villageId?: string;
  phone?: string;
  email?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Village {
  id: string;
  name: string;
  coordinates: Coordinates;
  population: number;
  elevation: number; // meters
  catchmentId: string;
  streamReachId: string;
  nearestSafeSpaceId: string;
  evacuationTimeMinutes: number; // alert delay + mobilization + travel
  alertDelayMinutes: number;
  mobilizationMinutes: number;
  travelMinutes: number;
  vulnerability: 'low' | 'medium' | 'high';
  accessibility: 'good' | 'moderate' | 'poor';
  wardId?: string;
}

export interface Catchment {
  id: string;
  name: string;
  area: number; // sq km
  bounds: Coordinates[];
  streamReachIds: string[];
  villageIds: string[];
  sensorIds: string[];
  headwaterCoordinates: Coordinates;
}

export interface StreamReach {
  id: string;
  name: string;
  catchmentId: string;
  upstreamReachId: string | null;
  downstreamReachId: string | null;
  length: number; // km
  slope: number; // degrees
  channelFactor: number; // roughness coefficient 0-1
  coordinates: Coordinates[]; // polyline
  sensorIds: string[];
  villageIds: string[];
}

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  coordinates: Coordinates;
  streamReachId?: string;
  catchmentId: string;
  elevation: number;
  installDate: string;
}

export interface SensorReading {
  sensorId: string;
  timestamp: string;
  value: number;
  unit: string;
  status: SensorStatus;
  battery: number; // 0-100
  signal: number; // 0-100
  lastHeartbeat: string;
}

export interface RiskAssessment {
  villageId: string;
  timestamp: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  confidence: number; // 0-100
  dataQuality: DataQuality;
  factors: RiskFactor[];
  degradedSensors: string[];
}

export interface RiskFactor {
  name: string;
  value: number;
  weight: number;
  contribution: number;
  source: 'observed' | 'predicted' | 'reported' | 'simulated';
}

export interface TimeToImpact {
  villageId: string;
  timestamp: string;
  ttiMinutesLow: number;
  ttiMinutesHigh: number;
  ttiMinutesBest: number;
  confidence: number;
  source: 'model' | 'sensor' | 'hybrid';
  upstreamTriggerId?: string;
  dataLabel: 'observed' | 'predicted' | 'simulated';
}

export interface EvacuationMargin {
  villageId: string;
  timestamp: string;
  ttiMinutes: number;
  alertDelayMinutes: number;
  mobilizationMinutes: number;
  travelMinutes: number;
  totalEvacuationMinutes: number;
  marginMinutes: number; // TTI - totalEvacuation
  status: 'safe' | 'caution' | 'critical' | 'negative';
  recommendation: string;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  villageId: string;
  villageName: string;
  timestamp: string;
  source: string;
  ttiMinutes?: number;
  evacuationMargin?: number;
  recommendedAction: string;
  channels: AlertChannel[];
  acknowledgement: AlertAcknowledgement;
  escalation: Escalation;
  isActive: boolean;
}

export interface AlertAcknowledgement {
  status: AckStatus;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  timeoutSeconds: number;
  elapsedSeconds: number;
}

export interface Escalation {
  level: EscalationLevel;
  escalatedAt?: string;
  chain: EscalationStep[];
}

export interface EscalationStep {
  level: EscalationLevel;
  notifiedAt: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
}

export interface SafeSpace {
  id: string;
  name: string;
  coordinates: Coordinates;
  capacity: number;
  availableCapacity: number;
  elevation: number;
  distance: number; // km from village center
  medicalSupport: boolean;
  accessibility: 'wheelchair' | 'elderly_friendly' | 'standard';
  status: 'open' | 'full' | 'closed' | 'preparing';
  villageIds: string[]; // villages it serves
}

export interface Route {
  id: string;
  fromVillageId: string;
  toSafeSpaceId: string;
  segments: RouteSegment[];
  totalDistance: number; // km
  estimatedTime: number; // minutes
  status: RouteStatus;
  alternateRouteId?: string;
}

export interface RouteSegment {
  id: string;
  name: string;
  coordinates: Coordinates[];
  distance: number;
  status: RouteStatus;
  hazards: string[];
  elevation: number;
  hasBridge: boolean;
}

export interface GroundReport {
  id: string;
  type: GroundReportType;
  coordinates: Coordinates;
  timestamp: string;
  reportedBy: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  photoUrl?: string;
  verification: ReportVerification;
  villageId?: string;
}

export interface Incident {
  id: string;
  type: string;
  villageId: string;
  timestamp: string;
  severity: AlertSeverity;
  description: string;
  status: 'active' | 'responding' | 'resolved' | 'closed';
  assignedTeamId?: string;
}

export interface ResponseTeam {
  id: string;
  name: string;
  type: 'ndrf' | 'sdrf' | 'local' | 'medical';
  members: number;
  status: 'standby' | 'deployed' | 'en_route' | 'on_site';
  currentLocation: Coordinates;
  assignedIncidentId?: string;
  stagingPointId?: string;
}

export interface ResponseTask {
  id: string;
  incidentId: string;
  teamId: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface SimulationState {
  scenario: SimulationScenario;
  isRunning: boolean;
  startedAt?: string;
  step: number;
  totalSteps: number;
  description: string;
  rainfallIntensity: number; // mm/h
  soilSaturation: number; // 0-100
  streamLevel: number; // meters
  streamRiseRate: number; // m/h
  upstreamTrigger: boolean;
  sensorFailures: string[];
  communicationDegraded: boolean;
}

export interface DrillRun {
  id: string;
  startedAt: string;
  completedAt?: string;
  scenario: SimulationScenario;
  totalAlertTime: number; // seconds
  acknowledgementDelay: number; // seconds
  escalationCount: number;
  villagesReached: number;
  missedAcknowledgements: number;
  sensorFailures: number;
  evacuationStatus: string;
  report: DrillReport;
}

export interface DrillReport {
  alertTime: string;
  acknowledgementTime: string;
  escalationTime: string;
  evacuationRecommendation: string;
  overallScore: number; // 0-100
  findings: string[];
  recommendations: string[];
}

export interface ReliefCampaign {
  id: string;
  name: string;
  villageId: string;
  need: string;
  verification: 'pending' | 'verified' | 'rejected';
  authorityApproval: boolean;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
}

// --- Catchment Graph Node ---

export interface CatchmentNode {
  id: string;
  type: 'headwater' | 'sensor' | 'stream_reach' | 'village';
  name: string;
  status: RiskLevel;
  data: {
    waterLevel?: number;
    sensorState?: SensorStatus;
    tti?: number;
    rainfall?: number;
    riskScore?: number;
  };
  downstreamNodeIds: string[];
  upstreamNodeIds: string[];
  coordinates: Coordinates;
}

// --- App State ---

export interface AppState {
  currentUser: User;
  currentRole: Role;
  simulation: SimulationState;
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
  systemStatus: 'operational' | 'degraded' | 'critical';
  dataQuality: DataQuality;
}

// --- Analytics ---

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface AnalyticsData {
  rainfallTrend: TimeSeriesPoint[];
  soilSaturationTrend: TimeSeriesPoint[];
  streamLevelTrend: TimeSeriesPoint[];
  riskTrend: TimeSeriesPoint[];
  ttiTrend: TimeSeriesPoint[];
  alertAckTimes: TimeSeriesPoint[];
  escalationEvents: TimeSeriesPoint[];
  sensorUptime: TimeSeriesPoint[];
}
