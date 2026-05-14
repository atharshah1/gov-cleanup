import { Component } from 'react';
import type { ReactNode } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import type { Coordinates } from '../lib/types';

type TrackingMapProps = {
  pickupLocation?: Coordinates | null;
  driverLocation?: Coordinates | null;
  history?: Coordinates[];
  heightClassName?: string;
};

const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];

function toTuple(coordinates: Coordinates): [number, number] {
  return [coordinates.latitude, coordinates.longitude];
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  // Omit zoom so the user's current zoom level is preserved during live updates.
  map.setView(center);
  return null;
}

/**
 * Catches errors thrown by Leaflet / react-leaflet during render and displays
 * a fallback message instead of propagating the error to the root and blanking
 * the entire page.
 */
class MapErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function TrackingMap({
  pickupLocation,
  driverLocation,
  history = [],
  heightClassName = 'h-80'
}: TrackingMapProps) {
  const latestHistoryPoint = history.at(-1);
  const center = driverLocation
    ? toTuple(driverLocation)
    : pickupLocation
      ? toTuple(pickupLocation)
      : latestHistoryPoint
        ? toTuple(latestHistoryPoint)
        : DEFAULT_CENTER;
  const path = history.map(toTuple);

  if (!pickupLocation && !driverLocation && path.length === 0) {
    return (
      <div className={`grid place-items-center rounded-[1.5rem] bg-slate-100 text-sm text-slate-500 ${heightClassName}`}>
        Coordinates will appear here once a pickup is scheduled and tracking begins.
      </div>
    );
  }

  return (
    <MapErrorBoundary
      fallback={
        <div className={`grid place-items-center rounded-[1.5rem] bg-rose-50 text-sm text-rose-500 ${heightClassName}`}>
          Unable to load the map. Please reload the page.
        </div>
      }
    >
      <div className={`${heightClassName} rounded-[1.5rem] overflow-hidden`}>
      <MapContainer center={center} zoom={13} style={{ width: '100%', height: '100%' }}>
        <ChangeView center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pickupLocation ? (
          <CircleMarker center={toTuple(pickupLocation)} radius={10} pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.8 }}>
            <Popup>Pickup destination</Popup>
          </CircleMarker>
        ) : null}
        {driverLocation ? (
          <CircleMarker center={toTuple(driverLocation)} radius={10} pathOptions={{ color: '#0f172a', fillColor: '#0f172a', fillOpacity: 0.85 }}>
            <Popup>Driver live location</Popup>
          </CircleMarker>
        ) : null}
        {path.length > 1 ? <Polyline positions={path} pathOptions={{ color: '#2563eb', weight: 4 }} /> : null}
      </MapContainer>
      </div>
    </MapErrorBoundary>
  );
}
