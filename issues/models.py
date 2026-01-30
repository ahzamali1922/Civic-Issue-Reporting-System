from django.db import models
from django.contrib.auth.models import User


# Create your models here

class Issue(models.Model):

    CATEGORY_CHOICES = [
        ('POTHOLE', 'Pothole'),
        ('GARBAGE', 'Garbage'),
        ('WATER', 'Water Leakage'),
        ('STREETLIGHT', 'Street Light'),
        ('DRAINAGE', 'Drainage'),
        ('OTHER', 'Other'),
    ]

    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('RESOLVED', 'Resolved'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='issue_images/', null=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    latitude = models.FloatField()
    longitude = models.FloatField()
    priority = models.IntegerField(default=0)
    assigned_to = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="assigned_issues"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.status}"
    


class IssueStatusHistory(models.Model):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='history')
    status = models.CharField(max_length=20)
    message = models.TextField()
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.issue.title} - {self.status}"

