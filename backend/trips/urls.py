from django.urls import path
from .views import TripViewSet, StopViewSet, generate_logsheet
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, StopViewSet

router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'stops', StopViewSet)

urlpatterns = router.urls + [
    path('generate-logsheet/<int:trip_id>/', generate_logsheet, name='generate-logsheet'),
]