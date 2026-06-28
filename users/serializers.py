# from rest_framework import serializers
# from .models import User

# class RegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(
#         write_only=True,
#         required=True,
#         style={"input_type":"password"}
#     )

#     password_confirm = serializers.CharField(
#         write_only=True,
#         required=True,
#         style={"input_type":"password"}
#     )

#     def validate(self, data):
#         if data["password"] != data["password_confirm"]:
#             raise serializers.ValidationError("password do not match")
#         return data
    
#     def create(self, data):
#         data.pop("password_confirm")
#         return User.objects.create_user(**data)

#     class Meta:
#         model = User
#         fields = ["username", "email", "password", "password_confirm"]
