from django.contrib.auth import login, logout
from rest_framework.authentication import authenticate
from rest_framework.response import Response
from rest_framework.decorators import APIView
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from .models import CustomUserDetails


class UserDetails(APIView):
    def get(self,request):
        # Getting Current LoggedIn user is must in both cases
        cookies = request.COOKIES.get('jwt_access_token')
        data = AccessToken(cookies)
        print("user id:", data.get('user_id'))
        user = CustomUserDetails.objects.filter(id = data.get('user_id',-1)).first()

        if request.GET.get('username',None) is not None:
            print("Requested User Details: ", request.GET.get('username', None))
            userObj2 = CustomUserDetails.objects.filter(username = request.GET['username']).first()
            if userObj2 is None:
                return Response({ 'status': False, 'reason': 'User not found'})
            user2 = UserInfoSerializer(userObj2)
            print('Before: ',user2.data)
            for i in ['liked_blogs','disliked_blogs',
                  'liked_comments','disliked_comments']:
                user2.data.pop(i)  # To remove the likes and dislikes content
            res = user2.data.copy()
            res['follows'] = False if user is None else user.followed_users.contains(userObj2) # Get the following status
            print('After: ', res)
            return Response({'status': True, 'user': res})
        
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

        # Perform authentication (returns username)
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            refresh_token = str(refresh)
            access_token = str(refresh.access_token)

            # Set access token as cookie
            response = Response({'status': True,'message': 'success'})
            response.set_cookie(key='jwt_access_token', value=access_token,httponly=True)
            response.set_cookie(key='jwt_refresh_token', value=refresh_token,httponly=True)

            return response
        else:
            return Response({'status': False ,'message': 'invalid credentials'})

class RegisterView(APIView):
    def post(self,request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        print("recieved Data: ", username,email,password)
        
        CustomUserDetails.objects.create(username=username,email=email,password=make_password(password)).save()
        print("Created new user")

        # Perform authentication
        user = authenticate(request, username=username, password=password)
        print("Authenticated new User")

        if user is not None:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)

            refresh_token = str(refresh)
            access_token = str(refresh.access_token)
            print("generated tokens")

            # Set access token as cookie
            response = Response({"status": True})
            response.set_cookie(key='jwt_access_token', value=access_token,httponly=True)
            response.set_cookie(key='jwt_refresh_token', value=refresh_token,httponly=True)
            return response
        else:
            return Response({'status': False, 'message': 'invalid credentials'}, status=401)
        
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
        
class FollowUser(APIView):
    def post(self,request):
        try:
            cookies = request.COOKIES.get('jwt_access_token')
            data = AccessToken(cookies)
            if data.get('user_id') is None:
                userObj = None
            else:
                userObj = CustomUserDetails.objects.filter(id = data['user_id']).first()

            if userObj is None:     raise   'Unable to identify the user'
            print('Current User Found')
            print(request.data)
            secondUser = CustomUserDetails.objects.filter(username = request.data.get('username')).first()
            if secondUser is None:  raise   'The user to be followed must exist'
            print('Other User Found')
            print(userObj.followed_users.contains(secondUser))
            if userObj.followed_users.contains(secondUser):    # Unfollow if already following
                userObj.followed_users.remove(secondUser)
            else:                                       # Else Follow
                userObj.followed_users.add(secondUser) 
            userObj.save()
            return Response({"status": True})
        except Exception as e:
            print(str(e))
            return Response({"status": False, "Reason": "Backend Error"})

class UpdateUser(APIView):
    def post(self, request):
        try:
            cookies = request.COOKIES.get('jwt_access_token')
            data = AccessToken(cookies)
            if data.get('user_id') is None:
                userObj = None
            else:
                userObj = CustomUserDetails.objects.filter(id = data['user_id']).first()
            if userObj is None:     raise   'Unable to identify the user'

            # Email must be constant
            n = request.data.get('username',None)
            i = request.data.get('interests',None)
            p = request.data.get('password',None)
            if (n is not None):
                if (CustomUserDetails.objects.filter(username=n).first() is None):
                    raise   'Username Already exists'
                userObj.username = n
            if i is not None:       userObj.interests = i
            if p is not None:
                if p == '':
                    raise   'Password Cannot be Empty' 
                userObj.set_password(p)

            userObj.save()
            return Response({"status": True})
        except Exception as e:
            print(str(e))
            return Response({"status": False, "Reason": "Backend Error"})
        
class DeleteUser(APIView):
    def post(self, request):
        try:
            cookies = request.COOKIES.get('jwt_access_token')
            data = AccessToken(cookies)
            if data.get('user_id') is None:
                userObj = None
            else:
                userObj = CustomUserDetails.objects.filter(id = data['user_id']).first()
            if userObj is None:     raise   'Unable to identify the user'

            userObj.delete()
            logout(request)
            response = Response({"status": True})
            response.delete_cookie(key='jwt_access_token')
            return response
        except Exception as e:
            print(str(e))
            return Response({"status": False, "Reason": "Backend Error"})
