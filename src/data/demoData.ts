// ============================================================
// JALRAKSHAK — Demo Data for "Demo Valley" Catchment
// ============================================================
// All data is simulated. Do not imply real deployments.

import type {
  Village, Catchment, StreamReach, Sensor, SensorReading,
  SafeSpace, Route, RouteSegment, CatchmentNode, ResponseTeam,
  ReliefCampaign, User, Coordinates
} from '../types';

// --- Coordinates (Simulated hilly region) ---
const DEMO_CENTER: Coordinates = { lat: 30.45, lng: 78.08 }; // Simulated Uttarakhand-like region

// --- Villages ---
export const VILLAGES: Village[] = [
  {
    id: 'village-aarohi',
    name: 'Aarohi',
    coordinates: { lat: 30.42, lng: 78.10 },
    population: 320,
    elevation: 1450,
    catchmentId: 'catchment-demo-valley',
    streamReachId: 'reach-2',
    nearestSafeSpaceId: 'safe-1',
    evacuationTimeMinutes: 12,
    alertDelayMinutes: 2,
    mobilizationMinutes: 3,
    travelMinutes: 7,
    vulnerability: 'high',
    accessibility: 'moderate',
  },
  {
    id: 'village-devgarh',
    name: 'Devgarh',
    coordinates: { lat: 30.39, lng: 78.12 },
    population: 540,
    elevation: 1280,
    catchmentId: 'catchment-demo-valley',
    streamReachId: 'reach-3',
    nearestSafeSpaceId: 'safe-2',
    evacuationTimeMinutes: 15,
    alertDelayMinutes: 2,
    mobilizationMinutes: 4,
    travelMinutes: 9,
    vulnerability: 'medium',
    accessibility: 'good',
  },
  {
    id: 'village-shivgram',
    name: 'Shivgram',
    coordinates: { lat: 30.36, lng: 78.14 },
    population: 180,
    elevation: 1120,
    catchmentId: 'catchment-demo-valley',
    streamReachId: 'reach-4',
    nearestSafeSpaceId: 'safe-3',
    evacuationTimeMinutes: 10,
    alertDelayMinutes: 2,
    mobilizationMinutes: 3,
    travelMinutes: 5,
    vulnerability: 'low',
    accessibility: 'good',
  },
];

// --- Stream Reaches ---
export const STREAM_REACHES: StreamReach[] = [
  {
    id: 'reach-1',
    name: 'Headwater Stream',
    catchmentId: 'catchment-demo-valley',
    upstreamReachId: null,
    downstreamReachId: 'reach-2',
    length: 2.1,
    slope: 35,
    channelFactor: 0.8,
    coordinates: [
      { lat: 30.48, lng: 78.06 },
      { lat: 30.46, lng: 78.07 },
      { lat: 30.44, lng: 78.08 },
    ],
    sensorIds: ['RG-001', 'SM-001'],
    villageIds: [],
  },
  {
    id: 'reach-2',
    name: 'Upper Valley Stream',
    catchmentId: 'catchment-demo-valley',
    upstreamReachId: 'reach-1',
    downstreamReachId: 'reach-3',
    length: 3.4,
    slope: 22,
    channelFactor: 0.6,
    coordinates: [
      { lat: 30.44, lng: 78.08 },
      { lat: 30.43, lng: 78.09 },
      { lat: 30.42, lng: 78.10 },
    ],
    sensorIds: ['SL-001'],
    villageIds: ['village-aarohi'],
  },
  {
    id: 'reach-3',
    name: 'Mid Valley Stream',
    catchmentId: 'catchment-demo-valley',
    upstreamReachId: 'reach-2',
    downstreamReachId: 'reach-4',
    length: 4.2,
    slope: 15,
    channelFactor: 0.5,
    coordinates: [
      { lat: 30.42, lng: 78.10 },
      { lat: 30.41, lng: 78.11 },
      { lat: 30.39, lng: 78.12 },
    ],
    sensorIds: [],
    villageIds: ['village-devgarh'],
  },
  {
    id: 'reach-4',
    name: 'Lower Valley Stream',
    catchmentId: 'catchment-demo-valley',
    upstreamReachId: 'reach-3',
    downstreamReachId: null,
    length: 3.8,
    slope: 10,
    channelFactor: 0.4,
    coordinates: [
      { lat: 30.39, lng: 78.12 },
      { lat: 30.38, lng: 78.13 },
      { lat: 30.36, lng: 78.14 },
    ],
    sensorIds: [],
    villageIds: ['village-shivgram'],
  },
];

// --- Sensors ---
export const SENSORS: Sensor[] = [
  {
    id: 'RG-001',
    name: 'Rain Gauge Alpha',
    type: 'rain_gauge',
    coordinates: { lat: 30.47, lng: 78.07 },
    streamReachId: 'reach-1',
    catchmentId: 'catchment-demo-valley',
    elevation: 2100,
    installDate: '2025-06-15',
  },
  {
    id: 'SM-001',
    name: 'Soil Moisture Beta',
    type: 'soil_moisture',
    coordinates: { lat: 30.46, lng: 78.075 },
    streamReachId: 'reach-1',
    catchmentId: 'catchment-demo-valley',
    elevation: 1950,
    installDate: '2025-06-15',
  },
  {
    id: 'SL-001',
    name: 'Stream Level Gamma',
    type: 'stream_level',
    coordinates: { lat: 30.43, lng: 78.09 },
    streamReachId: 'reach-2',
    catchmentId: 'catchment-demo-valley',
    elevation: 1520,
    installDate: '2025-07-01',
  },
  {
    id: 'TV-001',
    name: 'Tilt Sensor Delta',
    type: 'tilt',
    coordinates: { lat: 30.445, lng: 78.085 },
    catchmentId: 'catchment-demo-valley',
    elevation: 1800,
    installDate: '2025-08-10',
  },
];

// --- Default Sensor Readings (Normal) ---
export function getDefaultSensorReadings(): Record<string, SensorReading> {
  const now = new Date().toISOString();
  return {
    'RG-001': {
      sensorId: 'RG-001',
      timestamp: now,
      value: 12,
      unit: 'mm/h',
      status: 'online',
      battery: 87,
      signal: 92,
      lastHeartbeat: now,
    },
    'SM-001': {
      sensorId: 'SM-001',
      timestamp: now,
      value: 42,
      unit: '%',
      status: 'online',
      battery: 79,
      signal: 88,
      lastHeartbeat: now,
    },
    'SL-001': {
      sensorId: 'SL-001',
      timestamp: now,
      value: 0.3,
      unit: 'm',
      status: 'online',
      battery: 91,
      signal: 95,
      lastHeartbeat: now,
    },
    'TV-001': {
      sensorId: 'TV-001',
      timestamp: now,
      value: 0.2,
      unit: '°',
      status: 'online',
      battery: 94,
      signal: 90,
      lastHeartbeat: now,
    },
  };
}

// --- Catchment ---
export const CATCHMENT: Catchment = {
  id: 'catchment-demo-valley',
  name: 'Demo Valley',
  area: 45,
  bounds: [
    { lat: 30.50, lng: 78.04 },
    { lat: 30.50, lng: 78.16 },
    { lat: 30.34, lng: 78.16 },
    { lat: 30.34, lng: 78.04 },
  ],
  streamReachIds: ['reach-1', 'reach-2', 'reach-3', 'reach-4'],
  villageIds: ['village-aarohi', 'village-devgarh', 'village-shivgram'],
  sensorIds: ['RG-001', 'SM-001', 'SL-001', 'TV-001'],
  headwaterCoordinates: { lat: 30.48, lng: 78.06 },
};

// --- Safe Spaces ---
export const SAFE_SPACES: SafeSpace[] = [
  {
    id: 'safe-1',
    name: 'Aarohi Community Hall',
    coordinates: { lat: 30.425, lng: 78.105 },
    capacity: 500,
    availableCapacity: 500,
    elevation: 1520,
    distance: 1.2,
    medicalSupport: true,
    accessibility: 'elderly_friendly',
    status: 'open',
    villageIds: ['village-aarohi'],
  },
  {
    id: 'safe-2',
    name: 'Devgarh Higher Secondary School',
    coordinates: { lat: 30.395, lng: 78.125 },
    capacity: 800,
    availableCapacity: 800,
    elevation: 1350,
    distance: 0.8,
    medicalSupport: true,
    accessibility: 'wheelchair',
    status: 'open',
    villageIds: ['village-devgarh'],
  },
  {
    id: 'safe-3',
    name: 'Shivgram Temple Complex',
    coordinates: { lat: 30.365, lng: 78.145 },
    capacity: 300,
    availableCapacity: 300,
    elevation: 1200,
    distance: 0.6,
    medicalSupport: false,
    accessibility: 'standard',
    status: 'open',
    villageIds: ['village-shivgram'],
  },
];

// --- Routes ---
export const ROUTES: Route[] = [
  {
    id: 'route-1',
    fromVillageId: 'village-aarohi',
    toSafeSpaceId: 'safe-1',
    totalDistance: 1.2,
    estimatedTime: 7,
    status: 'safe',
    segments: [
      {
        id: 'seg-1a',
        name: 'Aarohi Main Road',
        coordinates: [
          { lat: 30.42, lng: 78.10 },
          { lat: 30.422, lng: 78.103 },
        ],
        distance: 0.5,
        status: 'safe',
        hazards: [],
        elevation: 1460,
        hasBridge: false,
      },
      {
        id: 'seg-1b',
        name: 'Uphill Path to Community Hall',
        coordinates: [
          { lat: 30.422, lng: 78.103 },
          { lat: 30.425, lng: 78.105 },
        ],
        distance: 0.7,
        status: 'safe',
        hazards: [],
        elevation: 1510,
        hasBridge: false,
      },
    ],
  },
  {
    id: 'route-2',
    fromVillageId: 'village-devgarh',
    toSafeSpaceId: 'safe-2',
    totalDistance: 0.8,
    estimatedTime: 5,
    status: 'safe',
    segments: [
      {
        id: 'seg-2a',
        name: 'Devgarh Bridge Road',
        coordinates: [
          { lat: 30.39, lng: 78.12 },
          { lat: 30.392, lng: 78.122 },
        ],
        distance: 0.3,
        status: 'safe',
        hazards: [],
        elevation: 1290,
        hasBridge: true,
      },
      {
        id: 'seg-2b',
        name: 'School Lane',
        coordinates: [
          { lat: 30.392, lng: 78.122 },
          { lat: 30.395, lng: 78.125 },
        ],
        distance: 0.5,
        status: 'safe',
        hazards: [],
        elevation: 1340,
        hasBridge: false,
      },
    ],
  },
  {
    id: 'route-3',
    fromVillageId: 'village-shivgram',
    toSafeSpaceId: 'safe-3',
    totalDistance: 0.6,
    estimatedTime: 4,
    status: 'safe',
    segments: [
      {
        id: 'seg-3a',
        name: 'Shivgram Path',
        coordinates: [
          { lat: 30.36, lng: 78.14 },
          { lat: 30.365, lng: 78.145 },
        ],
        distance: 0.6,
        status: 'safe',
        hazards: [],
        elevation: 1180,
        hasBridge: false,
      },
    ],
  },
];

// --- Catchment Graph Nodes (Normal State) ---
export function getDefaultCatchmentNodes(): CatchmentNode[] {
  return [
    {
      id: 'node-headwater',
      type: 'headwater',
      name: 'Demo Valley Headwater',
      status: 'safe',
      data: { rainfall: 12, waterLevel: 0.3 },
      downstreamNodeIds: ['node-sensor-rg001'],
      upstreamNodeIds: [],
      coordinates: { lat: 30.48, lng: 78.06 },
    },
    {
      id: 'node-sensor-rg001',
      type: 'sensor',
      name: 'RG-001 Rain Gauge',
      status: 'safe',
      data: { sensorState: 'online', rainfall: 12 },
      downstreamNodeIds: ['node-reach-1'],
      upstreamNodeIds: ['node-headwater'],
      coordinates: { lat: 30.47, lng: 78.07 },
    },
    {
      id: 'node-reach-1',
      type: 'stream_reach',
      name: 'Headwater Stream',
      status: 'safe',
      data: { waterLevel: 0.3 },
      downstreamNodeIds: ['node-village-aarohi'],
      upstreamNodeIds: ['node-sensor-rg001'],
      coordinates: { lat: 30.44, lng: 78.08 },
    },
    {
      id: 'node-village-aarohi',
      type: 'village',
      name: 'Aarohi',
      status: 'safe',
      data: { riskScore: 15 },
      downstreamNodeIds: ['node-reach-2'],
      upstreamNodeIds: ['node-reach-1'],
      coordinates: { lat: 30.42, lng: 78.10 },
    },
    {
      id: 'node-reach-2',
      type: 'stream_reach',
      name: 'Mid Valley Stream',
      status: 'safe',
      data: { waterLevel: 0.2 },
      downstreamNodeIds: ['node-village-devgarh'],
      upstreamNodeIds: ['node-village-aarohi'],
      coordinates: { lat: 30.41, lng: 78.11 },
    },
    {
      id: 'node-village-devgarh',
      type: 'village',
      name: 'Devgarh',
      status: 'safe',
      data: { riskScore: 10 },
      downstreamNodeIds: ['node-reach-3'],
      upstreamNodeIds: ['node-reach-2'],
      coordinates: { lat: 30.39, lng: 78.12 },
    },
    {
      id: 'node-reach-3',
      type: 'stream_reach',
      name: 'Lower Valley Stream',
      status: 'safe',
      data: { waterLevel: 0.15 },
      downstreamNodeIds: ['node-village-shivgram'],
      upstreamNodeIds: ['node-village-devgarh'],
      coordinates: { lat: 30.38, lng: 78.13 },
    },
    {
      id: 'node-village-shivgram',
      type: 'village',
      name: 'Shivgram',
      status: 'safe',
      data: { riskScore: 5 },
      downstreamNodeIds: [],
      upstreamNodeIds: ['node-reach-3'],
      coordinates: { lat: 30.36, lng: 78.14 },
    },
  ];
}

// --- Response Teams ---
export const RESPONSE_TEAMS: ResponseTeam[] = [
  {
    id: 'team-ndrf-1',
    name: 'NDRF Team Alpha',
    type: 'ndrf',
    members: 12,
    status: 'standby',
    currentLocation: { lat: 30.40, lng: 78.08 },
  },
  {
    id: 'team-sdrf-1',
    name: 'SDRF Team Bravo',
    type: 'sdrf',
    members: 8,
    status: 'standby',
    currentLocation: { lat: 30.38, lng: 78.10 },
  },
  {
    id: 'team-medical-1',
    name: 'Medical Response Unit',
    type: 'medical',
    members: 5,
    status: 'standby',
    currentLocation: { lat: 30.41, lng: 78.12 },
  },
];

// --- Relief Campaigns ---
export const RELIEF_CAMPAIGNS: ReliefCampaign[] = [
  {
    id: 'relief-1',
    name: 'Emergency Food Supply - Aarohi',
    villageId: 'village-aarohi',
    need: 'Food packets for 320 people (3 days)',
    verification: 'verified',
    authorityApproval: true,
    endDate: '2026-10-15',
    status: 'active',
  },
  {
    id: 'relief-2',
    name: 'Medical Kit Distribution - Devgarh',
    villageId: 'village-devgarh',
    need: 'First aid kits, ORS, basic medicines',
    verification: 'verified',
    authorityApproval: true,
    endDate: '2026-10-10',
    status: 'active',
  },
];

// --- Demo Users ---
export const DEMO_USERS: Record<string, User> = {
  citizen: {
    id: 'user-citizen-1',
    name: 'Priya Sharma',
    role: 'citizen',
    villageId: 'village-aarohi',
    phone: '+91-XXXXXXXXXX',
  },
  warden: {
    id: 'user-warden-1',
    name: 'Rajesh Kumar (Jal Mitra)',
    role: 'warden',
    villageId: 'village-aarohi',
    phone: '+91-XXXXXXXXXX',
  },
  authority: {
    id: 'user-authority-1',
    name: 'Collector, Demo Valley',
    role: 'authority',
    email: 'collector@demovalley.gov.in',
  },
  responder: {
    id: 'user-responder-1',
    name: 'Cmdr. Vikram Singh',
    role: 'responder',
  },
  admin: {
    id: 'user-admin-1',
    name: 'System Admin',
    role: 'admin',
  },
};

export { DEMO_CENTER };
