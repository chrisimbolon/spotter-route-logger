//src/components/TripCard.tsx

"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ArrowRight, MapPin, User } from "lucide-react"

type Props = {
  id: number
  driver_name: string
  start_location: string
  end_location: string
  created_at: string
}

export function TripCard({
  id,
  driver_name,
  start_location,
  end_location,
  created_at,
}: Props) {
  return (
    <Link href={`/trips/${id}`}>
      <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-primary cursor-pointer">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <User size={16} /> {driver_name}
          </h2>
          <span className="text-sm text-muted-foreground">
            {new Date(created_at).toLocaleDateString()}
          </span>
        </div>

        <div className="mt-2 text-muted-foreground flex items-center gap-2">
          <MapPin size={14} /> {start_location} <ArrowRight size={14} /> {end_location}
        </div>
      </Card>
    </Link>
  )
}


// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"

// type TripCardProps = {
//   id: number
//   driver_name: string
//   start_location: string
//   end_location: string
//   created_at: string
// }

// export default function TripCard({
//   id,
//   driver_name,
//   start_location,
//   end_location,
//   created_at,
// }: TripCardProps) {
//   return (
//     <Card className="w-full hover:shadow-lg transition">
//       <CardContent className="p-4">
//         <div className="flex justify-between items-center mb-2">
//           <div>
//             <h2 className="text-xl font-bold">{driver_name}</h2>
//             <p className="text-sm text-muted-foreground">
//               {start_location} → {end_location}
//             </p>
//             <p className="text-xs text-gray-500">Created: {new Date(created_at).toLocaleString()}</p>
//           </div>
//           <Link href={`/trips/${id}`}>
//             <Button variant="default">View</Button>
//           </Link>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
