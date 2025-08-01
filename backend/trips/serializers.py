from rest_framework import serializers
from .models import Trip, Stop

class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = '__all__'

class TripSerializer(serializers.ModelSerializer):
    stop = StopSerializer(many=True, read_only = True)

    class Metea:
        model = Trip
        fields = '__all__'