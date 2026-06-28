from django.db import models
from django.contrib.auth.models import User
from django.conf import settings




class Task(models.Model):
    STATUS_TASK = [
        ("TO DO", "TO DO"),
        ("IN PROGRESS", "IN PROGRESS"),
        ("IN REVIEW", "IN REVIEW"),
        ("DONE", "DONE"),
    ]

    DIFFICULTY_TASK = [
        ("LOW", "LOW"),
        ("MEDIUM", "MEDIUM"),
        ("HIGH", "HIGH"),
    ]
    
    order = models.PositiveIntegerField(default=0)
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=12, choices=STATUS_TASK, default="TO DO")
    difficulty = models.CharField(max_length=7, choices=DIFFICULTY_TASK, default="MEDIUM")
    date = models.DateTimeField(auto_now_add=True)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="tasks")
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="owned_tasks",
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ['order']



class Subtask(models.Model):
    title = models.CharField(max_length=255)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="subtasks")
    is_completed = models.BooleanField(default=False)

    class Meta:
        ordering = ["id"]