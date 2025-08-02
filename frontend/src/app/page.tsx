// src/app/page.tsx

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import TripForm from "@/components/TripForm";
import { TripCard } from "@/components/TripCard"
import { TripMap } from "@/components/TripMap"
import { Timeline } from "@/components/Timeline"
import DailyLog from "@/components/DailyLog"
import { Legend } from "@/components/Legend"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import api, { API_URL } from "@/lib/api"

export default function HomePage() {
  const [driver, setDriver] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [cycleHours, setCycleHours] = useState(11)
  const [loading, setLoading] = useState(false)
  const [trips, setTrips] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetch(`${API_URL}/trips/`).then(res => res.json()).then(setTrips)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/trips/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driver_name: driver,
          start_location: start,
          end_location: end,
          cycle_hours: cycleHours,
        }),
      })
      if (!res.ok) return toast.error("Failed to create trip.")
      const trip = await res.json()
      toast.success("Trip created!")
      router.push(`/trips/${trip.id}`)
    } catch {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left: Form + Legend */}
      <div>
        <TripForm />
        <Legend />
      </div>

      {/* Right: Map + Timeline + Log Preview + Recent Trips */}
      <div className="space-y-6">
        <TripMap />

        <Timeline
          logs={[
            {
              time: new Date(Date.now() + 0 * 60 * 60 * 1000).toISOString(),
              status: "Driving",
            },
            {
              time: new Date(Date.now() + 11 * 60 * 60 * 1000).toISOString(),
              status: "Rest Stop",
            },
            {
              time: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
              status: "Off Duty",
            },
          ]}
        />

        <DailyLog
          logs={[
            {
              date: new Date().toISOString().split("T")[0],
              offDuty: 6,
              sleeper: 8,
              driving: 9,
              onDuty: 1,
              totalHours: 24,
            },
          ]}
        />

        <p className="text-xs text-muted-foreground italic text-center -mt-2">
          This is a sample log preview. Real log will be generated after trip submission.
        </p>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Trips</h2>
          {trips.map((trip) => (
            <TripCard key={trip.id} {...trip} />
          ))}
        </div>
      </div>
    </main>
  )
}



// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { TripCard } from "@/components/TripCard"
// import { TripMap } from "@/components/TripMap"
// import { Timeline } from "@/components/Timeline"
// import DailyLog from "@/components/DailyLog"
// import { Legend } from "@/components/Legend"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"
// import api, { API_URL } from "@/lib/api"

// export default function HomePage() {
//   const [driver, setDriver] = useState("")
//   const [start, setStart] = useState("")
//   const [end, setEnd] = useState("")
//   const [cycleHours, setCycleHours] = useState(11)
//   const [loading, setLoading] = useState(false)
//   const [trips, setTrips] = useState([])
//   const router = useRouter()

//   useEffect(() => {
//     fetch(`${API_URL}/trips/`).then(res => res.json()).then(setTrips)
//   }, [])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     try {
//       const res = await fetch(`${API_URL}/trips/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           driver_name: driver,
//           start_location: start,
//           end_location: end,
//           cycle_hours: cycleHours,
//         }),
//       })
//       if (!res.ok) return toast.error("Failed to create trip.")
//       const trip = await res.json()
//       toast.success("Trip created!")
//       router.push(`/trips/${trip.id}`)
//     } catch {
//       toast.error("Something went wrong.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
//       {/* Left: Form + Legend */}
//       <div>
//         <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
//           <h2 className="text-xl font-semibold">Plan a Trip</h2>

//           <div>
//             <Label>Pickup Location</Label>
//             <Input value={start} onChange={(e) => setStart(e.target.value)} />
//           </div>

//           <div>
//             <Label>Dropoff Location</Label>
//             <Input value={end} onChange={(e) => setEnd(e.target.value)} />
//           </div>

//           <div>
//             <Label>Maximum driving hours</Label>
//             <Input
//               type="number"
//               value={cycleHours}
//               onChange={(e) => setCycleHours(parseInt(e.target.value))}
//               min={1}
//               required
//             />
//           </div>

//           <Button type="submit" className="w-full" disabled={loading}>
//             {loading ? "Creating..." : "Create Trip"}
//           </Button>
//         </form>

//         <Legend />
//       </div>

//       {/* Right: Map + Timeline + Recent Trips */}
//       <div className="space-y-6">
//         <TripMap />
//         <Timeline
//   logs={[
//     {
//       time: new Date(Date.now() + 0 * 60 * 60 * 1000).toISOString(),
//       status: "Driving",
//     },
//     {
//       time: new Date(Date.now() + 11 * 60 * 60 * 1000).toISOString(),
//       status: "Rest Stop",
//     },
//     {
//       time: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
//       status: "Off Duty",
//     },
//   ]}
// />    
//       <DailyLog
//   logs={[
//     {
//       date: new Date().toISOString().split("T")[0],
//       offDuty: 6,
//       sleeper: 8,
//       driving: 9,
//       onDuty: 1,
//       totalHours: 24,
//     },
//   ]}
// />
// <p className="text-xs text-muted-foreground italic text-center -mt-2">
//   This is a sample log preview. Real log will be generated after trip submission.
// </p>


//         <div className="space-y-4">
//           <h2 className="text-xl font-semibold">Recent Trips</h2>
//           {trips.map((trip) => (
//             <TripCard key={trip.id} {...trip} />
//           ))}
//         </div>
//       </div>
//     </main>
//   )
// }
