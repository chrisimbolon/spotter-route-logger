import { format } from 'date-fns'

interface Stop {
  id: number
  stop_type: string
  location_name: string
  arrival_time?: string
  departure_time?: string
}

export function StopList({ stops }: { stops: Stop[] }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Stop Details</h2>
      <ul className="space-y-3">
        {stops.map((stop) => (
          <li key={stop.id} className="border p-3 rounded-md">
            <p className="text-sm font-medium capitalize">
              🚩 {stop.stop_type} — <span className="text-gray-600">{stop.location_name}</span>
            </p>
            <p className="text-xs text-gray-500">
              Arrival: {stop.arrival_time ? format(new Date(stop.arrival_time), 'PPPp') : 'N/A'}<br />
              Departure: {stop.departure_time ? format(new Date(stop.departure_time), 'PPPp') : 'N/A'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
