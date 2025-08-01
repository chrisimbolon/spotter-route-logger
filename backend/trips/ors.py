import requests
from django.conf import settings

def fetch_route(start_coords, end_coords):
    url = "https://api.openrouteservice.org/v2/directions/driving-car"
    headers = {
        "Authorization": settings.ORS_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "coordinates": [start_coords, end_coords],
        "instructions": False
    }

    res = requests.post(url, json=payload, headers=headers)
    res.raise_for_status()

    data = res.json()
    route = data['features'][0]['geometry']['coordinates']
    summary = data['features'][0]['properties']['summary']

    return {
        "route": route,
        "distance_km": summary['distance'] / 1000,
        "duration_hr": summary['duration'] / 3600
    }
