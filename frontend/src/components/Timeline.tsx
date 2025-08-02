// src/components/Timeline.tsx
"use client"

import { LogItem } from "@/types"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Clock, MapPin } from "lucide-react"

type Props = {
  logs: LogItem[]
}

export function Timeline({ logs }: Props) {
  return (
    <div className="space-y-6 border-l-2 border-muted pl-4">
      {logs.map((log, i) => (
        <Card
          key={i}
          className={cn(
            "relative border-l-4 rounded-md p-4",
            log.event === "Pickup"
              ? "border-green-500"
              : log.event === "Drop-off"
              ? "border-red-500"
              : log.event === "Fuel"
              ? "border-yellow-400"
              : "border-blue-400"
          )}
        >
          <div className="absolute -left-[25px] top-3 w-5 h-5 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center">
            {log.event === "Fuel" ? (
              <svg className="w-3 h-3 fill-yellow-500" viewBox="0 0 24 24">
                <path d="M13 3a2 2 0 0 1 2 2v2h3a1 1 0 0 1 1 1v6a5 5 0 1 1-10 0V5a2 2 0 0 1 2-2z" />
              </svg>
            ) : (
              <div className="w-2 h-2 rounded-full bg-current" />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-lg">{log.event}</h3>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin size={14} /> {log.location}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock size={14} />
              {new Date(log.time).toLocaleString()} ({log.duration})
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
