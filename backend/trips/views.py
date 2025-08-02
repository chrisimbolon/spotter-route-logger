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
from datetime import datetime, timedelta

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
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("VALIDATION ERRORS:", serializer.errors)
            return Response(serializer.errors, status=400)

        trip = serializer.save()

        try:
            start_coords = geocode_location(trip.start_location)
            end_coords = geocode_location(trip.end_location)

            # Full route response
            route = fetch_route(start_coords, end_coords)
            coords = route["coordinates"]           # list of [lon, lat]
            total_distance = route["distance"]      # in meters
            total_duration = route["duration"]      # in seconds

            # Estimate driving speed (m/s)
            average_speed = total_distance / total_duration

            # Init tracking
            current_time = datetime.now()
            distance_covered = 0
            time_covered = 0

            rest_interval = 11 * 3600       # every 11 hours driving
            fuel_interval = 1609344         # every 1000 miles (in meters)

            next_rest = rest_interval
            next_fuel = fuel_interval

            for i in range(1, len(coords)):
                seg_dist = 1000  # estimate 1km per segment
                seg_time = seg_dist / average_speed

                distance_covered += seg_dist
                time_covered += seg_time
                current_time += timedelta(seconds=seg_time)

                if distance_covered >= next_fuel:
                    Stop.objects.create(
                        trip=trip,
                        stop_type="fuel",
                        location_name=f"Fuel Stop",
                        lat=coords[i][1],
                        lng=coords[i][0],
                        arrival_time=current_time,
                        departure_time=current_time + timedelta(minutes=30)
                    )
                    next_fuel += fuel_interval

                if time_covered >= next_rest:
                    Stop.objects.create(
                        trip=trip,
                        stop_type="rest",
                        location_name=f"Rest Stop",
                        lat=coords[i][1],
                        lng=coords[i][0],
                        arrival_time=current_time,
                        departure_time=current_time + timedelta(hours=10)
                    )
                    next_rest += rest_interval

            # Prepare final response with geometry
            final_data = TripSerializer(trip).data
            final_data["geometry"] = route["geometry"]  # Polyline

            return Response(final_data, status=201)

        except ValueError as e:
            trip.delete()
            return Response({"error": str(e)}, status=400)

   
class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer
