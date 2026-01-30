from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Issue, IssueStatusHistory
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages

# Create your views here.

@login_required
def create_issue(request):
    if request.method == "POST":
        Issue.objects.create(
            user=request.user,
            title=request.POST['title'],
            description=request.POST['description'],
            image=request.FILES.get('image'),
            category=request.POST['category'],
            latitude=request.POST['latitude'],
            longitude=request.POST['longitude'],
        )
        return redirect('my_issues')
    return render(request, 'issues/create_issue.html')


@login_required
def my_issues(request):
    issues = Issue.objects.filter(user=request.user)
    return render(request, 'issues/my_issues.html', {'issues': issues})



def login_view(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('my_issues')  # we’ll create this later
        else:
            messages.error(request, "Invalid username or password")

    return render(request, 'auth/login.html')
    


def signup_view(request):
    if request.method == "POST":
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists")
        else:
            User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            messages.success(request, "Account created successfully")
            return redirect('login')

    return render(request, 'auth/signup.html')


def logout_view(request):
    logout(request)
    return redirect('login')


from django.contrib.admin.views.decorators import staff_member_required


@staff_member_required
def authority_dashboard(request):
    issues = Issue.objects.filter(assigned_to=request.user)
    return render(request, 'authority/dashboard.html', {'issues': issues})



@staff_member_required
def update_issue_status(request, issue_id):
    issue = Issue.objects.get(id=issue_id, assigned_to=request.user)

    if request.method == "POST":
        new_status = request.POST['status']
        old_status = issue.status

        if old_status != new_status:
            issue.status = new_status
            issue.save()

            IssueStatusHistory.objects.create(
                issue=issue,
                status=new_status,
                message=f"Updated by authority to {new_status}"
            )

    return redirect('authority_dashboard')


