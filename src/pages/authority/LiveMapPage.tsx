import React from 'react';
import { MapView } from '../../components/map/MapView';
import { PageHeader } from '../../components/shared/UIComponents';

export function LiveMapPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <PageHeader title="Live Map" subtitle="Demo Valley Catchment — Real-time sensor and village status" />
      <div className="flex-1 card p-0 overflow-hidden" style={{ minHeight: '500px' }}>
        <MapView height="100%" showControls={true} />
      </div>
    </div>
  );
}
