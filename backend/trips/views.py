from rest_framework import viewsets
from .models import Trip, Stop
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TripSerializer, StopSerializer
from .logsheet import generate_logsheet_for_trip

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

class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer