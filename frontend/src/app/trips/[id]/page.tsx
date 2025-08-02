// src/app/trips/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/api';
import { useParams } from 'next/navigation';
import {Timeline} from '@/components/Timeline';
import {TripMap} from '@/components/TripMap';

type Stop = {
  id: number;
  location_name: string;
  lat: number;
  lng: number;
  stop_type: string;
  arrival_time: string;
  departure_time: string;
};

type Trip = {
  id: number;
  driver_name: string;
  start_location: string;
  end_location: string;
  created_at: string;
};

type TimelineEvent = {
  event: string;
  location: string;
  time: string;
  duration: string;
};

export default function TripPage() {
  const params = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [route, setRoute] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!params.id) return;

    const fetchData = async () => {
      const tripRes = await axios.get(`/trips/${params.id}/`);
      const stopsRes = await axios.get('/stops/');
      const timelineRes = await axios.get(`/generate-logsheet/${params.id}/`);

      const tripData = tripRes.data;
      const stopsData = stopsRes.data.filter(
        (s: Stop) => s.trip === Number(params.id)
      );

      const geometry = tripData.geometry;
      const decoded = geometry ? decodePolyline(geometry) : [];

      setTrip(tripData);
      setStops(stopsData);
      setTimeline(timelineRes.data);
      setRoute(decoded);
    };

    fetchData();
  }, [params.id]);

  if (!trip) return <p className="text-center py-10">Loading trip...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      <h1 className="text-2xl font-bold">{trip.driver_name}'s Trip</h1>

      <p className="text-muted-foreground">
        {trip.start_location} → {trip.end_location}
      </p>

      <TripMap stops={stops} route={route} />
      <Timeline events={timeline} />
    </div>
  );
}

// Polyline decoder (same logic as backend's ORS.decode)
function decodePolyline(encoded: string): [number, number][] {
  const coords: [number, number][] = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const deltaLat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += deltaLat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const deltaLng = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += deltaLng;

    coords.push([lat / 1e5, lng / 1e5]);
  }

  return coords;
}
