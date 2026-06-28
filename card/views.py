from django.db import transaction
from django.db.models import Max
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.exceptions import NotAuthenticated

from users.permissions import IsOwnerTask
from .models import Subtask, Task
from .serializers import SubtaskSerializer, TaskSerializer
from rest_framework.response import Response


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    filterset_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "difficulty", "users"]
    search_fields = ["title"]
    ordering_fields = ["date", "difficulty", "order"]
    ordering = ["order"]  # Делаем сортировку по order дефолтной на бэке
    permission_classes = [IsOwnerTask]

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            raise NotAuthenticated("You are not authenticated")
        return Task.objects.filter(users=user).prefetch_related("subtasks")

    def perform_create(self, serializer):
        status_val = self.request.data.get("status", "TO DO")
        # Фильтруем строго по текущему юзеру, чтобы не смешивать порядковые номера с чужими
        max_order = (
            Task.objects.filter(users=self.request.user, status=status_val).aggregate(
                Max("order")
            )["order__max"]
            or 0
        )
        task = serializer.save(owner=self.request.user, order=max_order + 1)
        task.users.add(self.request.user)

    def partial_update(self, request, *args, **kwargs):
        """Хендлер для PATCH-запросов. Переносит задачу и пересчитывает order без пропусков."""
        instance = self.get_object()
        old_status = instance.status
        new_status = request.data.get("status")

        with transaction.atomic():
            # 1. Выполняем стандартное обновление (меняем статус задачи в БД)
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            # Если статус действительно изменился, наводим порядок в обеих колонках
            if new_status and new_status != old_status:
                
                # А. Переиндексируем СТАРУЮ колонку (убираем дыру от ушедшей задачи)
                old_column_tasks = Task.objects.filter(
                    users=request.user, 
                    status=old_status
                ).order_by("order")
                
                for index, task in enumerate(old_column_tasks, start=1):
                    if task.order != index:
                        task.order = index
                        task.save(update_fields=["order"])

                # Б. Переиндексируем НОВУЮ колонку (ставим пришедшую задачу строго в конец)
                new_column_tasks = Task.objects.filter(
                    users=request.user, 
                    status=new_status
                ).order_by("order")
                
                # Дополнительно исключаем текущую задачу из списка, чтобы принудительно положить её в самый конец
                other_new_tasks = new_column_tasks.exclude(id=instance.id)
                
                current_order = 1
                for task in other_new_tasks:
                    if task.order != current_order:
                        task.order = current_order
                        task.save(update_fields=["order"])
                    current_order += 1
                
                # Присваиваем перенесенной задаче строго следующий по порядку номер
                instance.order = current_order
                instance.save(update_fields=["order"])
                
                # Обновляем данные в сериализаторе для отправки правильного ответа фронтенду
                serializer = self.get_serializer(instance)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)



class SubtaskViewSet(viewsets.ModelViewSet):
    serializer_class = SubtaskSerializer
    permission_classes = [IsOwnerTask]

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            raise NotAuthenticated("You are not authenticated")
        return Subtask.objects.filter(task__users=user)
