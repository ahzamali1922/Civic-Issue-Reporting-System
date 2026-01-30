from django.contrib import admin
from django.contrib.auth.models import User
from .models import Issue, IssueStatusHistory


@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'priority', 'assigned_to')
    list_filter = ('status', 'category')
    search_fields = ('title', 'description')

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "assigned_to":
            # show only staff users as authorities
            kwargs["queryset"] = User.objects.filter(is_staff=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def save_model(self, request, obj, form, change):
        if change:
            old_obj = Issue.objects.get(pk=obj.pk)

            # If authority is newly assigned
            if old_obj.assigned_to != obj.assigned_to and obj.assigned_to:
                obj.status = "IN_PROGRESS"
                IssueStatusHistory.objects.create(
                    issue=obj,
                    status="IN_PROGRESS",
                    message=f"Issue assigned to {obj.assigned_to.username}"
                )

        super().save_model(request, obj, form, change)


@admin.register(IssueStatusHistory)
class IssueStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ('issue', 'status', 'updated_at')
