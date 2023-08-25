from django.contrib.auth import login, logout
from rest_framework.authentication import authenticate
from rest_framework.response import Response
from rest_framework.decorators import APIView
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.contrib.auth.models import User
from .api.serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from django.shortcuts import render
# Create your views here.
class create_blog(APIView):
    def post(self,request):
        try:
            cookies = request.COOKIES.get('jwt_access_token')
            data = AccessToken(cookies)
            user = User.objects.filter(id = data['user_id'])[0]
            user = UserInfoSerializer(user)
            print(f"User:{user.data['username']}")
            print(f"Title:{request.data.get('title')}")
            print(f"Tags:{request.data.get('tags')}")
            print(f"Content:{request.data.get('content')}")
            print(f"Time:{request.data.get('time')}")
            return Response({"status" : True})
        except:
            return Response("Error")