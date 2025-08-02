"use client"

import { useEffect, useState } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

// Fix broken icon images
delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString(),
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString(),
})

export default function TripMapInner() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null // 🧠 Prevents SSR-related crashes

  const center: [number, number] = [39.5, -98.35]

  return (
    <MapContainer
      center={center}
      zoom={4}
      scrollWheelZoom={false}
      className="h-[300px] w-full rounded-xl z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[41.8781, -87.6298]}>
        <Popup>Chicago (Start)</Popup>
      </Marker>
      <Marker position={[33.749, -84.388]}>
        <Popup>Atlanta (End)</Popup>
      </Marker>
      <Polyline positions={[[41.8781, -87.6298], [33.749, -84.388]]} color="teal" />
    </MapContainer>
  )
}
