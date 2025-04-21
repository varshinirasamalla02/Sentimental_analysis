from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Review


class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'mobile', 'is_staff')
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'mobile')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )
    readonly_fields = ('created_at', 'updated_at')
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'mobile', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)


class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'rating', 'created_by', 'created_at')
    list_filter = ('rating', 'product')
    search_fields = ('product', 'review')
    readonly_fields = ('created_at', 'updated_at')


admin.site.register(User, UserAdmin)
admin.site.register(Review, ReviewAdmin)