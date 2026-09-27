from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        user = serializers.PrimaryKeyRelatedField(read_only=True)
        model=Task
        fields='__all__'
        read_only_fields = ['user'] 