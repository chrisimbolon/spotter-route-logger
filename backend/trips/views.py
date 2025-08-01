from rest_framework import viewsets
from .models import Trip, Stop
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TripSerializer, StopSerializer
from .logsheet import generate_logsheet_for_trip
from .ors import fetch_route, geocode_location

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

        # Geocode start and end
        start_coords = geocode_location(trip.start_location)  # [lon, lat]
        end_coords = geocode_location(trip.end_location)

        # Fetch route
        route_info = fetch_route(start_coords, end_coords)

        # Inserting rest stop at midpoint
        midpoint = len(route_info["route"]) // 2
        midpoint_coord = route_info["route"][midpoint]

        Stop.objects.create(
            trip=trip,
            location_name="Auto Rest Stop",
            lat=midpoint_coord[1],
            lng=midpoint_coord[0],
            stop_type="rest"
        )

class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer


