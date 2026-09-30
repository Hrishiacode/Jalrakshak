import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useStore } from '../../store/useStore';
import type { RiskLevel } from '../../types';

const RISK_COLORS: Record<RiskLevel, string> = {
  safe: '#10b981',
  watch: '#f59e0b',
  warning: '#f97316',
  alert: '#ef4444',
  evacuate: '#dc2626',
};

interface MapViewProps {
  height?: string;
  showControls?: boolean;
  selectedVillageId?: string;
  onVillageClick?: (villageId: string) => void;
}

export function MapView({ height = '100%', showControls = true, selectedVillageId, onVillageClick }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const villages = useStore((s) => s.villages);
  const sensors = useStore((s) => s.sensors);
  const sensorReadings = useStore((s) => s.sensorReadings);
  const risks = useStore((s) => s.risks);
  const ttis = useStore((s) => s.ttis);
  const evacuationMargins = useStore((s) => s.evacuationMargins);
  const safeSpaces = useStore((s) => s.safeSpaces);
  const routes = useStore((s) => s.routes);
  const catchmentNodes = useStore((s) => s.catchmentNodes);
  const groundReports = useStore((s) => s.groundReports);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [30.42, 78.10],
      zoom: 12,
      zoomControl: showControls,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    mapInstance.current = map;
    markersRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!mapInstance.current || !markersRef.current) return;

    markersRef.current.clearLayers();
    const map = mapInstance.current;
    const markers = markersRef.current;

    // Draw catchment boundary
    const catchmentBounds: L.LatLngExpression[] = [
      [30.50, 78.04], [30.50, 78.16], [30.34, 78.16], [30.34, 78.04],
    ];
    L.polygon(catchmentBounds, {
      color: '#0ea5e9',
      weight: 1.5,
      fillColor: '#0ea5e9',
      fillOpacity: 0.03,
      dashArray: '6 4',
    }).addTo(markers);

    // Draw stream network
    const streamCoords: L.LatLngExpression[][] = [
      [[30.48, 78.06], [30.46, 78.07], [30.44, 78.08]],
      [[30.44, 78.08], [30.43, 78.09], [30.42, 78.10]],
      [[30.42, 78.10], [30.41, 78.11], [30.39, 78.12]],
      [[30.39, 78.12], [30.38, 78.13], [30.36, 78.14]],
    ];

    // Determine stream color based on risk
    const maxRisk = Object.values(risks).reduce<RiskLevel>((max, r) => {
      const order: Record<RiskLevel, number> = { safe: 0, watch: 1, warning: 2, alert: 3, evacuate: 4 };
      return order[r.riskLevel] > order[max] ? r.riskLevel : max;
    }, 'safe');
    const streamColor = RISK_COLORS[maxRisk] || '#0ea5e9';

    streamCoords.forEach(coords => {
      L.polyline(coords, {
        color: streamColor,
        weight: 3,
        opacity: 0.7,
      }).addTo(markers);
    });

    // Draw routes
    routes.forEach(route => {
      route.segments.forEach(seg => {
        const coords: L.LatLngExpression[] = seg.coordinates.map(c => [c.lat, c.lng]);
        const routeColor = seg.status === 'safe' ? '#10b981' : seg.status === 'caution' ? '#f59e0b' : '#ef4444';
        L.polyline(coords, {
          color: routeColor,
          weight: 2,
          opacity: 0.6,
          dashArray: seg.hasBridge ? '4 6' : undefined,
        }).addTo(markers);

        if (seg.hasBridge) {
          const mid = seg.coordinates[0];
          L.circleMarker([mid.lat, mid.lng], {
            radius: 4,
            color: routeColor,
            fillColor: routeColor,
            fillOpacity: 0.8,
          }).bindTooltip(`🌉 ${seg.name}`, { direction: 'top', offset: [0, -6] }).addTo(markers);
        }
      });
    });

    // Headwater marker
    const headwaterNode = catchmentNodes.find(n => n.type === 'headwater');
    if (headwaterNode) {
      const hColor = RISK_COLORS[headwaterNode.status];
      L.circleMarker([headwaterNode.coordinates.lat, headwaterNode.coordinates.lng], {
        radius: 8,
        color: hColor,
        fillColor: hColor,
        fillOpacity: 0.3,
        weight: 2,
      }).bindTooltip('⛰️ Headwater Area', { direction: 'top' }).addTo(markers);
    }

    // Sensor markers
    sensors.forEach(sensor => {
      const reading = sensorReadings[sensor.id];
      const status = reading?.status || 'offline';
      const color = status === 'online' ? '#10b981' : status === 'warning' ? '#f59e0b' : status === 'offline' ? '#ef4444' : '#9fb3c8';

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width: 24px; height: 24px; border-radius: 4px;
          background: ${color}; border: 2px solid white;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: white; font-weight: bold;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          ${status === 'online' ? '' : 'opacity: 0.7;'}
        ">📡</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const sensorTypeLabel: Record<string, string> = {
        rain_gauge: 'Rain Gauge',
        soil_moisture: 'Soil Moisture',
        stream_level: 'Stream Level',
        tilt: 'Tilt Sensor',
        vibration: 'Vibration',
      };

      L.marker([sensor.coordinates.lat, sensor.coordinates.lng], { icon })
        .bindPopup(`
          <div style="font-family: Inter, sans-serif; min-width: 160px;">
            <div style="font-weight: 700; font-size: 13px; color: #243b53; margin-bottom: 4px;">${sensor.id}</div>
            <div style="font-size: 11px; color: #627d98; margin-bottom: 6px;">${sensorTypeLabel[sensor.type] || sensor.type}</div>
            <div style="font-size: 18px; font-weight: 700; color: ${color};">${reading?.value ?? '—'} ${reading?.unit ?? ''}</div>
            <div style="font-size: 10px; color: #829ab1; margin-top: 4px;">Status: ${(status || 'unknown').toUpperCase()}</div>
            <div style="font-size: 10px; color: #829ab1;">Battery: ${reading?.battery ?? '—'}% · Signal: ${reading?.signal ?? '—'}%</div>
          </div>
        `)
        .addTo(markers);
    });

    // Village markers
    villages.forEach(village => {
      const risk = risks[village.id];
      const tti = ttis[village.id];
      const margin = evacuationMargins[village.id];
      const riskLevel = risk?.riskLevel || 'safe';
      const color = RISK_COLORS[riskLevel];

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width: ${riskLevel === 'safe' ? '28px' : '34px'};
          height: ${riskLevel === 'safe' ? '28px' : '34px'};
          border-radius: 50%;
          background: ${color};
          border: 3px solid white;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; color: white; font-weight: 800;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          ${riskLevel === 'evacuate' ? 'animation: pulse 1.5s ease-in-out infinite;' : ''}
        ">${village.name.charAt(0)}</div>
        ${riskLevel === 'evacuate' ? '<style>@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}</style>' : ''}
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const popupContent = `
        <div style="font-family: Inter, sans-serif; min-width: 200px;">
          <div style="font-weight: 700; font-size: 14px; color: #243b53; margin-bottom: 2px;">${village.name}</div>
          <div style="display: inline-block; padding: 2px 8px; border-radius: 4px; background: ${color}; color: white; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 8px;">
            ${riskLevel.toUpperCase()}
          </div>
          <table style="font-size: 11px; color: #486581; width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 2px 0;">Population</td><td style="text-align: right; font-weight: 600;">${village.population}</td></tr>
            <tr><td style="padding: 2px 0;">Elevation</td><td style="text-align: right; font-weight: 600;">${village.elevation}m</td></tr>
            ${tti ? `<tr><td style="padding: 2px 0; color: ${color}; font-weight: 600;">Time-to-Impact</td><td style="text-align: right; font-weight: 800; color: ${color}; font-size: 14px;">${tti.ttiMinutesBest} min</td></tr>
            <tr><td style="padding: 2px 0; font-size: 10px; color: #829ab1;">Range</td><td style="text-align: right; font-size: 10px; color: #829ab1;">${tti.ttiMinutesLow}–${tti.ttiMinutesHigh} min</td></tr>` : ''}
            ${margin ? `<tr><td style="padding: 2px 0;">Evacuation Time</td><td style="text-align: right; font-weight: 600;">${margin.totalEvacuationMinutes} min</td></tr>
            <tr><td style="padding: 2px 0; font-weight: 700;">Evacuation Margin</td><td style="text-align: right; font-weight: 800; color: ${margin.marginMinutes > 5 ? '#10b981' : margin.marginMinutes > 0 ? '#f59e0b' : '#ef4444'}; font-size: 14px;">${margin.marginMinutes > 0 ? '+' : ''}${margin.marginMinutes} min</td></tr>` : ''}
            <tr><td style="padding: 2px 0;">Risk Score</td><td style="text-align: right; font-weight: 600;">${risk?.riskScore ?? '—'}/100</td></tr>
            <tr><td style="padding: 2px 0;">Confidence</td><td style="text-align: right; font-weight: 600;">${risk?.confidence ?? '—'}%</td></tr>
          </table>
          ${risk?.degradedSensors && risk.degradedSensors.length > 0 ? `<div style="margin-top: 6px; padding: 4px 8px; background: #fef3cd; border-radius: 4px; font-size: 10px; color: #856404;">⚠ Degraded: ${risk.degradedSensors.join(', ')}</div>` : ''}
        </div>
      `;

      const marker = L.marker([village.coordinates.lat, village.coordinates.lng], { icon })
        .bindPopup(popupContent);

      if (onVillageClick) {
        marker.on('click', () => onVillageClick(village.id));
      }

      marker.addTo(markers);
    });

    // Safe space markers
    safeSpaces.forEach(space => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width: 22px; height: 22px; border-radius: 4px;
          background: #10b981; border: 2px solid white;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; color: white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        ">🏠</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      L.marker([space.coordinates.lat, space.coordinates.lng], { icon })
        .bindPopup(`
          <div style="font-family: Inter, sans-serif; min-width: 160px;">
            <div style="font-weight: 700; font-size: 13px; color: #243b53; margin-bottom: 4px;">🏠 ${space.name}</div>
            <div style="font-size: 11px; color: #627d98;">
              Capacity: ${space.capacity}<br/>
              Available: ${space.availableCapacity}<br/>
              Elevation: ${space.elevation}m<br/>
              Medical: ${space.medicalSupport ? '✓ Available' : '✗ Not available'}
            </div>
          </div>
        `)
        .addTo(markers);
    });

    // Ground report markers
    groundReports.forEach(report => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width: 20px; height: 20px; border-radius: 50%;
          background: #f59e0b; border: 2px solid white;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        ">📋</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      L.marker([report.coordinates.lat, report.coordinates.lng], { icon })
        .bindPopup(`
          <div style="font-family: Inter, sans-serif;">
            <div style="font-weight: 700; font-size: 12px; color: #243b53;">Ground Report</div>
            <div style="font-size: 11px; color: #627d98; margin-top: 4px;">
              Type: ${report.type.replace(/_/g, ' ')}<br/>
              Severity: ${report.severity}<br/>
              Status: ${report.verification.toUpperCase()}
            </div>
          </div>
        `)
        .addTo(markers);
    });

  }, [villages, sensors, sensorReadings, risks, ttis, evacuationMargins, safeSpaces, routes, catchmentNodes, groundReports]);

  return (
    <div ref={mapRef} style={{ height, width: '100%', borderRadius: '8px' }} />
  );
}
