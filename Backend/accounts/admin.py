from django.contrib import admin
from .models import PasswordResetOTP

class PasswordResetOTPAdmin(admin.ModelAdmin):
    list_display = ('user', 'otp', 'created_at', 'expires_at')
    search_fields = ('user__username', 'user__email', 'otp')
    list_filter = ('created_at', 'expires_at')

admin.site.register(PasswordResetOTP, PasswordResetOTPAdmin)

