// src/components/TripMap.tsx
"use client";

import dynamic from "next/dynamic";
import type { Trip } from "@/types";

const TripMapInner = dynamic(() => import("./TripMapInner").then(mod => mod.TripMapInner), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export function TripMap({ trip }: { trip?: Trip }) {
  const route = trip?.route ?? [];
  const stops = trip?.stops ?? [];

  return <TripMapInner route={route} stops={stops} />;
}
