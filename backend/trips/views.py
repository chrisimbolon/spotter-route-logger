# trips/views.py

from rest_framework import viewsets, status, serializers 
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Trip, Stop
from .serializers import TripSerializer, StopSerializer
from .logsheet import generate_logsheet_for_trip
from .ors import fetch_route, geocode_location
from openrouteservice import convert
from django.utils import timezone
import datetime

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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("VALIDATION ERRORS:", serializer.errors)  
            return Response(serializer.errors, status=400)

        self.perform_create(serializer)
        return Response(serializer.data, status=201)

    def perform_create(self, serializer):
        trip = serializer.save()

        try:
            start_coords = geocode_location(trip.start_location)
            end_coords = geocode_location(trip.end_location)
            route_geometry = fetch_route(start_coords, end_coords)  # still encoded
            coords_list = convert.decode_polyline(route_geometry)["coordinates"]

            # Pick midpoint
            midpoint = coords_list[len(coords_list) // 2]
            lon, lat = midpoint  # ORS returns [lon, lat]

            # Create a rest stop at midpoint
            Stop.objects.create(
                trip=trip,
                location_name="Midpoint Stop",
                lat=lat,
                lng=lon,
                stop_type="rest",  # or "custom"
                arrival_time=timezone.now(),
                departure_time=timezone.now() + datetime.timedelta(minutes=30),
            )

        except ValueError as e:
            trip.delete()
            raise serializers.ValidationError({"error": str(e)})

class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer
