from django.db import models

class Trip(models.Model):
    driver_name = models.CharField(max_length=100)
    start_location = models.CharField(max_length=255)
    end_location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    current_location = models.CharField(max_length=255, null=True, blank=True)  
    cycle_hours = models.FloatField(null=True, blank=True)  

    def __str__(self):
        return f"{self.driver_name} - {self.start_location} to {self.end_location}"

class Stop(models.Model):
    trip = models.ForeignKey(Trip, related_name='stops', on_delete=models.CASCADE)
    location_name = models.CharField(max_length=255)
    lat = models.FloatField()
    lng = models.FloatField()
    stop_type = models.CharField(max_length=50, choices=(
        ('fuel', 'Fuel'),
        ('rest', 'Rest'),
        ('break', 'Break'),
        ('custom', 'Custom')
    ))
    arrival_time = models.DateTimeField(null=True, blank=True)
    departure_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.stop_type} at {self.location_name}"

