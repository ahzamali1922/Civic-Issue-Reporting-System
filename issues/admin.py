from django.contrib import admin

# Register your models here.
from .models import Issue, IssueStatusHistory

admin.site.register(Issue)
admin.site.register(IssueStatusHistory)
