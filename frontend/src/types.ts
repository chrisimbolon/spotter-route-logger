export interface Trip {
  id: number
  driver_name: string
  start_location: string
  end_location: string
  created_at: string
}

export interface LogItem {
  event: string
  location: string
  time: string
  duration: string
}
