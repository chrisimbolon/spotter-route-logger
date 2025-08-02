// src/components/TripForm.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import axios from "@/lib/api";
import { TruckIcon, MapPinned, MapIcon, ClockIcon, UserIcon } from "lucide-react";

export default function TripForm() {
  const [driverName, setDriverName] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [cycleHours, setCycleHours] = useState("11");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("/trips/", {
        driver_name: driverName,
        start_location: pickup,
        end_location: dropoff,
        cycle_hours: Number(cycleHours),
      });

      const tripId = res.data.id;
      router.push(`/trips/${tripId}`);
    } catch (err: any) {
      console.error("Failed to create trip", err);

      if (err.response?.status === 400 && err.response?.data) {
        console.error("VALIDATION ERRORS:", err.response.data);
        alert("Validation Error: " + JSON.stringify(err.response.data, null, 2));
      } else {
        alert("Error creating trip");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border border-gray-200 space-y-6"
    >
      <div className="flex items-center space-x-3">
        <TruckIcon className="text-blue-600 w-7 h-7" />
        <h2 className="text-3xl font-bold text-gray-800">Plan a New Trip</h2>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div>
          <Label className="flex items-center gap-2 text-sm text-gray-600">
            <UserIcon className="w-4 h-4 text-blue-500" />
            Driver Name
          </Label>
          <Input
            placeholder="Enter driver's name"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label className="flex items-center gap-2 text-sm text-gray-600">
            <MapPinned className="w-4 h-4 text-blue-500" />
            Pickup Location
          </Label>
          <Input
            placeholder="e.g., San Francisco"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            required
          />
        </div>

        <div>
          <Label className="flex items-center gap-2 text-sm text-gray-600">
            <MapIcon className="w-4 h-4 text-blue-500" />
            Dropoff Location
          </Label>
          <Input
            placeholder="e.g., Los Angeles"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            required
          />
        </div>

        <div>
          <Label className="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon className="w-4 h-4 text-blue-500" />
            Max Driving Hours (Cycle)
          </Label>
          <Input
            type="number"
            min={1}
            max={14}
            value={cycleHours}
            onChange={(e) => setCycleHours(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full text-white bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 text-lg font-semibold"
        >
          Create Trip
        </Button>
      </div>
    </form>
  );
}





// "use client";

// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { useRouter } from "next/navigation";
// import axios from "@/lib/api";

// export default function TripForm() {
//   const [pickup, setPickup] = useState("");
//   const [dropoff, setDropoff] = useState("");
//   const [cycleHours, setCycleHours] = useState("11");

//   const router = useRouter();

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   try {
//     const res = await axios.post("/trips/", {
//       driver_name: "Spotter Driver",
//       start_location: pickup,
//       end_location: dropoff,
//       cycle_hours: Number(cycleHours),
//     });

//     const tripId = res.data.id;
//     router.push(`/trips/${tripId}`);
//   } catch (err: any) {
//     console.error("Failed to create trip", err);

//     if (err.response?.status === 400 && err.response?.data) {
//       console.error("VALIDATION ERRORS:", err.response.data);
//       alert("Validation Error: " + JSON.stringify(err.response.data, null, 2));
//     } else {
//       alert("Error creating trip");
//     }
//   }
// };


//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-xl shadow">

//       <h2 className="text-2xl font-bold">Plan a Trip</h2>

//       <div>
//         <Label>Pickup location</Label>
//         <Input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Enter pickup location" />
//       </div>

//       <div>
//         <Label>Dropoff location</Label>
//         <Input value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="Enter dropoff location" />
//       </div>

//       <div>
//         <Label>Maximum driving hours</Label>
//         <Input
//           type="number"
//           value={cycleHours}
//           onChange={(e) => setCycleHours(e.target.value)}
//           min={1}
//           max={14}
//         />
//       </div>

//       <Button type="submit" className="w-full">
//         Create Trip
//       </Button>
//     </form>
//   );
// }
