// src/components/TripMapInner.tsx

'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

type Stop = {
  id: number;
  location_name: string;
  lat: number;
  lng: number;
  stop_type: string;
};

export function TripMapInner({
  stops,
  route,
}: {
  stops: Stop[];
  route: [number, number][];
}) {
  console.log("🚩 Stops received by TripMapInner:", stops);
  console.log("🛣️ Route received by TripMapInner:", route);

  const mapRef = useRef(null);
  const defaultCenter: [number, number] = [39.8283, -98.5795]; // center of USA
  const defaultZoom = 5;

  const FitMapBounds = ({ route }: { route: [number, number][] }) => {
    const map = useMap();
    useEffect(() => {
      if (route.length > 0) {
        map.fitBounds(route);
      }
    }, [route, map]);
    return null;
  };

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden">
      <MapContainer
        center={route.length > 0 ? route[0] : defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {route.length > 0 && (
          <>
            <Polyline positions={route} color="blue" />
            <FitMapBounds route={route} />
          </>
        )}

        {stops.map((stop) => {
          console.log("🧭 Marker for stop:", stop.location_name, stop.lat, stop.lng);
          return (
            <Marker key={stop.id} position={[stop.lat, stop.lng]} />
          );
        })}
      </MapContainer>
    </div>
  );
}
