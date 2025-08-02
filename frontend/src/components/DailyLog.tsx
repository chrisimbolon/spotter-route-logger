import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyLogEntry, LogStatus } from "@/types";

interface DailyLogProps {
  logs: DailyLogEntry[];
  className?: string;
}

const logStatuses: LogStatus[] = [
  { type: 'off-duty', label: 'Off Duty', color: 'bg-log-off-duty' },
  { type: 'sleeper', label: 'Sleeper', color: 'bg-log-sleeper' },
  { type: 'driving', label: 'Driving', color: 'bg-log-driving' },
  { type: 'on-duty', label: 'On Duty (not driving)', color: 'bg-log-on-duty' }
];

export default function DailyLog({ logs, className = "" }: DailyLogProps) {
  const currentLog = logs[0] || {
    date: new Date().toISOString().split('T')[0],
    offDuty: 0,
    sleeper: 8,
    driving: 6,
    onDuty: 2,
    totalHours: 16
  };

  const renderTimelineBar = (log: DailyLogEntry) => {
    const segments = [
      { type: 'sleeper', hours: log.sleeper, color: 'bg-log-sleeper' },
      { type: 'driving', hours: log.driving, color: 'bg-log-driving' },
      { type: 'on-duty', hours: log.onDuty, color: 'bg-log-on-duty' },
      { type: 'off-duty', hours: 24 - log.sleeper - log.driving - log.onDuty, color: 'bg-log-off-duty' }
    ];

    return (
      <div className="flex h-8 rounded border overflow-hidden">
        {segments.map((segment, index) => {
          const width = (segment.hours / 24) * 100;
          return width > 0 ? (
            <div
              key={index}
              className={`${segment.color} opacity-80`}
              style={{ width: `${width}%` }}
              title={`${segment.type}: ${segment.hours}h`}
            />
          ) : null;
        })}
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Driver's Daily Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Hour markers - matching screenshot layout */}
          <div className="flex">
            <div className="w-32 flex items-center">
              <span className="text-sm font-semibold">Ho</span>
            </div>
            <div className="flex-1 grid grid-cols-15 gap-1 text-xs text-center font-medium">
              {[1, 2, 4, 6, 8, 0, 4, 2, 8, 9, 10, 11, 12, 13, 14].map((hour, index) => (
                <div key={index} className="text-muted-foreground">
                  {hour}
                </div>
              ))}
            </div>
            <div className="w-12 text-xs font-semibold text-center">Hours</div>
          </div>

          {/* Status rows with timeline bars */}
          <div className="space-y-3">
            {logStatuses.map((status, index) => (
              <div key={status.type} className="flex items-center">
                <div className="w-32 flex items-center gap-2">
                  <span className="font-semibold text-sm w-4">{index + 1}</span>
                  <span className="text-sm">{status.label}</span>
                </div>
                <div className="flex-1">
                  <div className="h-6 border rounded overflow-hidden bg-muted/20">
                    {status.type === 'sleeper' && (
                      <div 
                        className={`h-full ${status.color}`}
                        style={{ width: `${(currentLog.sleeper / 24) * 100}%` }}
                      />
                    )}
                    {status.type === 'driving' && (
                      <div 
                        className={`h-full ${status.color}`}
                        style={{ 
                          width: `${(currentLog.driving / 24) * 100}%`,
                          marginLeft: `${((currentLog.sleeper) / 24) * 100}%`
                        }}
                      />
                    )}
                    {status.type === 'on-duty' && (
                      <div 
                        className={`h-full ${status.color}`}
                        style={{ 
                          width: `${(currentLog.onDuty / 24) * 100}%`,
                          marginLeft: `${((currentLog.sleeper + currentLog.driving) / 24) * 100}%`
                        }}
                      />
                    )}
                    {status.type === 'off-duty' && (
                      <div 
                        className={`h-full ${status.color}`}
                        style={{ 
                          width: `${((24 - currentLog.sleeper - currentLog.driving - currentLog.onDuty) / 24) * 100}%`,
                          marginLeft: `${((currentLog.sleeper + currentLog.driving + currentLog.onDuty) / 24) * 100}%`
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="w-12 text-xs text-center">
                  {status.type === 'sleeper' && currentLog.sleeper}
                  {status.type === 'driving' && currentLog.driving}
                  {status.type === 'on-duty' && currentLog.onDuty}
                  {status.type === 'off-duty' && (24 - currentLog.sleeper - currentLog.driving - currentLog.onDuty)}
                </div>
              </div>
            ))}
          </div>

          {/* Break Stop indicator */}
          <div className="pt-2 border-t">
            <div className="flex">
              <div className="w-32"></div>
              <div className="flex-1 text-center text-sm text-muted-foreground">
                Break Stop
              </div>
              <div className="w-12"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}