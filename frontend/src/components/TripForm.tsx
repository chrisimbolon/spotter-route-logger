// src/components/TripForm.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import axios from "@/lib/api";

export default function TripForm() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [cycleHours, setCycleHours] = useState("11");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("/trips/", {
        driver_name: "Spotter Driver",
        start_location: pickup,
        end_location: dropoff,
        cycle_hours: Number(cycleHours),
      });

      const tripId = res.data.id;
      router.push(`/trips/${tripId}`);
    } catch (err) {
      console.error("Failed to create trip", err);
      alert("Error creating trip");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold">Plan a Trip</h2>

      <div>
        <Label>Pickup location</Label>
        <Input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Enter pickup location" />
      </div>

      <div>
        <Label>Dropoff location</Label>
        <Input value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="Enter dropoff location" />
      </div>

      <div>
        <Label>Maximum driving hours</Label>
        <Input
          type="number"
          value={cycleHours}
          onChange={(e) => setCycleHours(e.target.value)}
          min={1}
          max={14}
        />
      </div>

      <Button type="submit" className="w-full">
        Create Trip
      </Button>
    </form>
  );
}
