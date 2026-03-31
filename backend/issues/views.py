from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Issue, IssueStatusHistory
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import IssueSerializer

from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import authentication_classes

from ml.predict import final_prediction, get_priority

# Create your views here.

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # Skip CSRF check


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def api_me(request):
    return Response({
        "username": request.user.username,
        "is_staff": request.user.is_staff
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def api_my_issues(request):
    issues = Issue.objects.filter(user=request.user)
    serializer = IssueSerializer(issues, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def api_all_issues(request):
    # Fetch all issues, ordering by the newest first
    issues = Issue.objects.all().order_by('-created_at')
    serializer = IssueSerializer(issues, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def api_create_issue(request):
    serializer = IssueSerializer(data=request.data)
    if serializer.is_valid():
        instance = serializer.save(user=request.user)

        # ML Prediction
        if instance.image:
            category, confidence = final_prediction(
                instance.image.path,
                instance.description
            )

            instance.category = category
            instance.priority = get_priority(category)
            instance.save()

        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

from django.contrib.auth import authenticate, login
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
# --- DASHBOARD API VIEWS ---

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
@authentication_classes([CsrfExemptSessionAuthentication])
def api_dashboard_stats(request):
    # Depending on your app logic, you might want to filter by the logged-in user:
    # Issue.objects.filter(user=request.user).count()
    # Below assumes you are fetching global stats. Adjust as needed.
    
    total = Issue.objects.count()
    active = Issue.objects.filter(status__in=['PENDING', 'IN_PROGRESS']).count()
    resolved = Issue.objects.filter(status='RESOLVED').count()
    
    # If your Issue model doesn't have a 'critical' field, you can default to 0
    # or derive it from a specific category.
    critical = 0 

    return Response({
        "total": total,
        "active": active,
        "resolved": resolved,
        "critical": critical
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def api_recent_issues(request):
    # Fetch the 5 most recently created issues
    issues = Issue.objects.all().order_by('-created_at')[:5]
    serializer = IssueSerializer(issues, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([]) # Allow any user (unauthenticated) to hit this endpoint
@authentication_classes([CsrfExemptSessionAuthentication])
def api_signup(request):
    data = request.data
    
    # Extract fields from the request
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    # Basic validation
    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
    # Check if a user with this username already exists
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        # Create the new user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        # Optionally, you can automatically log them in here if you want
        # login(request, user)
        
        return Response({'message': 'User created successfully!'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([CsrfExemptSessionAuthentication])
def api_login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return Response({
            "message": "Login successful",
            "username": user.username,
            "is_staff": user.is_staff
        })
    else:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )



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

# --- ADD THESE AT THE BOTTOM OF views.py ---

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def api_update_issue_status(request, pk):
    # Security check: Only staff (authorities) can update status
    if not request.user.is_staff:
        return Response({"error": "Unauthorized. Admins only."}, status=403)
    
    try:
        issue = Issue.objects.get(pk=pk)
    except Issue.DoesNotExist:
        return Response({"error": "Issue not found"}, status=404)

    new_status = request.data.get('status')
    if new_status and new_status != issue.status:
        # Save new status
        issue.status = new_status
        issue.save()
        
        # Log the history
        IssueStatusHistory.objects.create(
            issue=issue,
            status=new_status,
            message=f"Status updated to {new_status} by {request.user.username}"
        )
    
    serializer = IssueSerializer(issue, context={'request': request})
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([CsrfExemptSessionAuthentication])
def api_delete_issue(request, pk):
    # Security check: Only staff can delete
    if not request.user.is_staff:
        return Response({"error": "Unauthorized. Admins only."}, status=403)
    
    try:
        issue = Issue.objects.get(pk=pk)
        issue.delete()
        return Response({"message": "Issue deleted successfully"}, status=204)
    except Issue.DoesNotExist:
        return Response({"error": "Issue not found"}, status=404)

