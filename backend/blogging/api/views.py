from django.contrib.auth import login, logout
from rest_framework.authentication import authenticate
from rest_framework.response import Response
from rest_framework.decorators import APIView
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.contrib.auth.models import User
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password

class UserDetails(APIView):
    def get(self,request):
        cookies = request.COOKIES.get('jwt_access_token')
        data = AccessToken(cookies)
        user = User.objects.filter(id = data['user_id']).first()
        if user == None:
            return Response({ 'status': False, 'reason': 'User not found'})
        user = UserInfoSerializer(user)
        return Response({'status': True, 'user': user.data})
        # return Response({"username":"abce","email":"Dont ask me"})
    
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        if (request.COOKIES.get('jwt_access_token') is not None):
            response = Response({"status": True})
            response.delete_cookie(key='jwt_access_token')
        return response
    
class LoginView(APIView):
    def post(self,request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Perform authentication
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            refresh_token = str(refresh)
            access_token = str(refresh.access_token)

            # Set access token as cookie
            response = Response({'message': 'success'})
            response.set_cookie(key='jwt_access_token', value=access_token,httponly=True)
            response.set_cookie(key='jwt_refresh_token', value=refresh_token,httponly=True)

            return response
        else:
            return Response({'message': 'invalid credentials'}, status=401)

class RegisterView(APIView):
    def post(self,request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        User.objects.create(username=username,email=email,password=make_password(password)).save()

        # Perform authentication
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            refresh_token = str(refresh)
            access_token = str(refresh.access_token)

            # Set access token as cookie
            response = Response({'message': 'success'})
            response.set_cookie(key='jwt_access_token', value=access_token,httponly=True)
            response.set_cookie(key='jwt_refresh_token', value=refresh_token,httponly=True)
            return response
        else:
            return Response({'message': 'invalid credentials'}, status=401)
        
class IsLoggedView(APIView):
    def get(self,request):
        token = request.COOKIES.get("jwt_access_token")
        if (token is not None):
            try:
                user = AccessToken(token)
                if (user['user_id']):
                    return Response({'status':True})
                else:
                    return Response({'status':False})
            except:
                return Response({'status': False})
        else:
            return Response({'status':False})