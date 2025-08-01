from datetime import datetime, timedelta

def generate_logsheet_for_trip(trip):
    # Grab stops and sort by arrival time
    stops = trip.stops.all().order_by('arrival_time')

    # Initialize 24h log starting from the first stop (or now)
    log_entries = []
    current_time = stops[0].arrival_time if stops else datetime.now()

    for stop in stops:
        # Driving block: from current time to arrival
        if stop.arrival_time and stop.arrival_time > current_time:
            log_entries.append({
                "type": "driving",
                "start": current_time.isoformat(),
                "end": stop.arrival_time.isoformat()
            })
            current_time = stop.arrival_time

        # Rest/fuel block
        if stop.departure_time and stop.departure_time > current_time:
            log_entries.append({
                "type": stop.stop_type,
                "start": stop.arrival_time.isoformat(),
                "end": stop.departure_time.isoformat()
            })
            current_time = stop.departure_time

    return log_entries
