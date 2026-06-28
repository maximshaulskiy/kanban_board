from rest_framework import permissions

class IsOwnerTask(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        target_task = obj.task if hasattr(obj, "task") else obj

        if request.method in permissions.SAFE_METHODS:
            return request.user in target_task.users.all()
        
        return target_task.owner == request.user