from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, SubtaskViewSet
from django.urls import path, include

router = DefaultRouter()

router.register(r'tasks', TaskViewSet, basename='tasks')
router.register(r'subtasks', SubtaskViewSet, basename='subtasks')

urlpatterns = [
    path('', include(router.urls))
]