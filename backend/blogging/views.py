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
import json

from .models import Blogs
# Create your views here.
class createBlog(APIView):
    def post(self,request):
        try:
            cookies = request.COOKIES.get('jwt_access_token')
            data = AccessToken(cookies)
            user = User.objects.filter(id = data['user_id'])[0]
            user = UserInfoSerializer(user)

            blog = Blogs.objects.create( author = user.instance, 
                                         title = request.data.get('title'),
                                         content = request.data.get('content'),
                                         tags = request.data.get('tags'),
                                         time = request.data.get('time') )
            blog.save()
            print(f"User '{blog.author.username}' created a post with title '{blog.title}'")
            # id is a default field from the django https://docs.djangoproject.com/en/dev/ref/models/instances/?from=olddocs#auto-incrementing-primary-keys
            return Response({"status" : True, "blog_id": blog.id}) 
        except:
            return Response({"status": False, "Reason": "Backend Error"})
        
class getBlog(APIView):
    def get(self, request):
        try:
            blog_id = request.GET.get('blog_id')
            print('Blog Id:', blog_id)
            blog = Blogs.objects.filter(id = blog_id).first()
            if blog == None:
                return Response({"status": False, "Reason": "Invalid Blog Id"})

            blog.update_views(1)  # Updates the view count

            print(blog.title)
            print(f"Request for blog with title '{blog.title}'")
            res = {'title':blog.title, 'time':blog.time,'author':blog.author.username,'content':blog.content,
                   'stats':{'views':blog.views,'likes':blog.likes,'dislikes':blog.dislikes},'tags':blog.tags}
            return Response({"status": True, "blog": res})
        except Exception as e:
            print(str(e))
            return Response({"status": False, "Reason": "Backend Error"})

class getFeed(APIView):
    def get(self, request):
        try:
            blogs = Blogs.objects.all()[:20]
            res = []
            for b in blogs:
                res.append({'id':b.id, 'title':b.title, 'time':str(b.time),'author':b.author.username,'content':b.content,
                   'stats':{'views':b.views,'likes':b.likes,'dislikes':b.dislikes},'tags':b.tags})
            return Response({"status": True, "blogs": json.dumps(res)})
        except Exception as e:
            print(str(e))
            return Response({"status": False, "Reason": "Backend Error"})

class getUserBlogs(APIView):
    def get(self, request):
        try:
            print(request.GET)
            user = User.objects.filter( username = request.GET.get('username') ).first()
            if user == None:
                return Response({"status": False, "Reason": "User Not Found"})
            user = UserInfoSerializer(user)
            blogs = Blogs.objects.filter(author = user.instance)[:20]
            res = []
            for b in blogs:
                res.append({'id':b.id, 'title':b.title, 'time':str(b.time),'author':b.author.username,'content':b.content,
                   'stats':{'views':b.views,'likes':b.likes,'dislikes':b.dislikes},'tags':b.tags})
            return Response({"status": True, "blogs": json.dumps(res)})
        except Exception as e:
            print(str(e))
            return Response({"status": False, "Reason": "Backend Error"})
