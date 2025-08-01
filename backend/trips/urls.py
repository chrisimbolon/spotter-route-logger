from rest_framework.routers import DefaultRouter
from .views import TripViewSet, StopViewSet

router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'stops', StopViewSet)

urlpatterns = router.urls
