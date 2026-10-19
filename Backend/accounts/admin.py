from django.contrib import admin
from .models import PasswordResetOTP,UserProfile

admin.site.register(PasswordResetOTP)
admin.site.register(UserProfile)



