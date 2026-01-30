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


]
