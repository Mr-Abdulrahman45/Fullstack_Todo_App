from django.contrib import admin
from .models import Task

class TaskAdmin(admin.ModelAdmin):
    list_display=['user','title','created_at','is_completed']
    
admin.site.register(Task, TaskAdmin)
    
    
