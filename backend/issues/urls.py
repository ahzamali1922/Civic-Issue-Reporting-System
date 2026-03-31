from django.urls import path
from . import views

urlpatterns = [
    # STEP 1 – Authentication
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('logout/', views.logout_view, name='logout'),

    # STEP 2 – Issues (we’ll use later)
    path('create/', views.create_issue, name='create_issue'),
    path('my-issues/', views.my_issues, name='my_issues'),

    path('authority/', views.authority_dashboard, name='authority_dashboard'),


    path('authority/update/<int:issue_id>/', views.update_issue_status, name='update_status'),

    path('api/me/', views.api_me),
    path('api/my-issues/', views.api_my_issues),
    path('api/create-issue/', views.api_create_issue),

    path('api/login/', views.api_login),
    path('api/all-issues/', views.api_all_issues),
    path('api/signup/', views.api_signup), # <--- ADD THIS NEW LINE
    path('api/issues/<int:pk>/status/', views.api_update_issue_status),
    path('api/issues/<int:pk>/delete/', views.api_delete_issue),

    path('api/dashboard-stats/', views.api_dashboard_stats),
    path('api/recent-issues/', views.api_recent_issues),


]
