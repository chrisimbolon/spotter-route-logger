from rest_framework import viewsets
from .models import Trip, Stop
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TripSerializer, StopSerializer
from .logsheet import generate_logsheet_for_trip
from .ors import fetch_route

@api_view(['GET'])
def generate_logsheet(request, trip_id):
    try:
        trip = Trip.objects.get(id=trip_id)
    except Trip.DoesNotExist:
        return Response({"error": "Trip not found"}, status=404)

    logsheet = generate_logsheet_for_trip(trip)
    return Response(logsheet, status=200)

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all().order_by('-created_at')
    serializer_class = TripSerializer

    def perform_create(self, serializer):
        trip = serializer.save()
        
        # This is Dummy coordinates (will be replaced  with geocoding)
        start_coords = [106.8456, -6.2088]  # Jakarta
        end_coords = [112.7508, -7.2575]    # Surabaya

        # Fetch route from ORS
        route_info = fetch_route(start_coords, end_coords)
        trip_summary = f"{route_info['distance_km']:.1f} km in {route_info['duration_hr']:.1f} hrs"

        # Auto-insert rest stop halfway
        midpoint = len(route_info['route']) // 2
        midpoint_coord = route_info['route'][midpoint]

        Stop.objects.create(
            trip=trip,
            location_name="Auto Rest Stop",
            lat=midpoint_coord[1],
            lng=midpoint_coord[0],
            stop_type='rest'
        )

        print(f"Trip created: {trip_summary}")

class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer