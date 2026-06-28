from rest_framework import serializers
from .models import Task, Subtask


class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = ["id", "title", "task", "is_completed"]


class TaskSerializer(serializers.ModelSerializer):
    subtasks = SubtaskSerializer(many=True, read_only=True)
    users = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    owner_name = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Task
        fields = ["id", "title", "status", "difficulty", "date", "users", "subtasks", "order", "owner", "owner_name"]
        extra_kwargs = {
            "title": {
                "style": {"placeholder": "enter your task"},
            },
            "owner": {"read_only": True}
        }