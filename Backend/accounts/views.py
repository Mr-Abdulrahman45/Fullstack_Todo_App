from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes 
from rest_framework import status
from .serializers import LoginSerializer,RegisterSerializer,UserProfileUpdateSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data = request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        
        return Response({"message":"user registered successfully", "refresh": str(refresh), "access": str(refresh.access_token)},status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login successful",
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=status.HTTP_200_OK)
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def check_username(request):
    username = request.data.get("username", "").strip()

    if not username:
        return Response(
            {"available": False, "message": "Username is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    exists = User.objects.filter(username=username).exists()

    return Response({
        "available": not exists
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
    })    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    if request.method == 'PATCH':
        user = request.user
        serializer = UserProfileUpdateSerializer(user, data=request.data, partial=True)
    
        if serializer.is_valid():
            serializer.save()
            return Response({
            "message": "Profile updated successfully"
            }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    if request.method == 'POST':
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not user.check_password(current_password):
            return Response({"error": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)

    return Response({"error": "Invalid request method."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)