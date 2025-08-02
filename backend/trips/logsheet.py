from datetime import timedelta

def generate_logsheet_for_trip(trip):
    logsheet = []

    # Sort stops by arrival_time
    stops = trip.stops.order_by('arrival_time')

    # Add 1 hour pickup at the start location
    if stops.exists():
        first_stop_time = stops.first().arrival_time
    else:
        first_stop_time = trip.created_at + timedelta(hours=1)

    logsheet.append({
        "event": "Pickup",
        "location": trip.start_location,
        "time": (first_stop_time - timedelta(hours=1)).isoformat(),
        "duration": "1h",
    })

    # Add entries for each stop
    for stop in stops:
        logsheet.append({
            "event": stop.stop_type.capitalize(),
            "location": stop.location_name,
            "time": stop.arrival_time.isoformat(),
            "duration": str((stop.departure_time - stop.arrival_time)),
        })

    # Add 1 hour drop-off at the end location
    if stops.exists():
        last_stop_time = stops.last().departure_time
    else:
        last_stop_time = trip.created_at + timedelta(hours=2)

    logsheet.append({
        "event": "Drop-off",
        "location": trip.end_location,
        "time": last_stop_time.isoformat(),
        "duration": "1h",
    })

    return logsheet
