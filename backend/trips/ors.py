# trips/ors.py

import requests
from django.conf import settings
from openrouteservice import convert

GEOCODE_URL = "https://api.openrouteservice.org/geocode/search"
ROUTE_URL = "https://api.openrouteservice.org/v2/directions/driving-car"

def geocode_location(location_name):
    response = requests.get(
        GEOCODE_URL,
        params={
            "api_key": settings.ORS_API_KEY,
            "text": location_name,
            "size": 1,
        },
    )
    data = response.json()

    if not data.get("features"):
        raise ValueError(f"No geocoding results found for: {location_name}")

    coords = data["features"][0]["geometry"]["coordinates"]  # [lon, lat]
    return coords


def fetch_route(start_coords, end_coords):
    response = requests.post(
        ROUTE_URL,
        json={
            "coordinates": [start_coords, end_coords],
        },
        headers={
            "Authorization": settings.ORS_API_KEY,
            "Content-Type": "application/json",
        },
    )

    print("ORS ROUTE STATUS CODE:", response.status_code)
    print("ORS ROUTE RAW RESPONSE:", response.text)

    data = response.json()

    if not data.get("routes"):
        raise ValueError("No route found between the provided locations.")

    route = data["routes"][0]

    return {
        "distance": route["summary"]["distance"],       # in meters
        "duration": route["summary"]["duration"],       # in seconds
        "geometry": route["geometry"],                  # encoded polyline
        "coordinates": convert.decode_polyline(route["geometry"])["coordinates"],  # [[lon, lat], ...]
    }

