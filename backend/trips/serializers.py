from rest_framework import serializers
from .models import Trip, Stop

class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = '__all__'


geometry = serializers.SerializerMethodField()

class TripSerializer(serializers.ModelSerializer):
    stops = StopSerializer(many=True, read_only = True)
    geometry = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = '__all__'