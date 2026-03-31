from rest_framework import serializers
from .models import Issue, IssueStatusHistory


class IssueStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueStatusHistory
        fields = ['status', 'message', 'updated_at']


class IssueSerializer(serializers.ModelSerializer):
    history = IssueStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Issue
        fields = [
            'id',
            'title',
            'description',
            'category',
            'status',
            'priority',
            'image',
            'latitude',
            'longitude',
            'created_at',
            'history',
        ]
