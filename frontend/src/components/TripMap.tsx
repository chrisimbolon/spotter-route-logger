"use client"

import dynamic from "next/dynamic"

const TripMapInner = dynamic(() => import("./TripMapInner"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
})

export function TripMap() {
  return <TripMapInner />
}
