from rest_framework.response import Response
from rest_framework.decorators import APIView
from rest_framework_simplejwt.tokens import AccessToken
from BasicDetails.serializers import *
import json
from .models import Blogs, Comments
from BasicDetails.models import CustomUserDetails

# Create your views here.
class createBlog(APIView):
    def post(self,request):
        print('TAGS recieved: ', request.data.get('tags'))
        print('TIME recieved: ', request.data.get('time'))
        print('TITLE recieved: ', request.data.get('title'))
        try:
            cookies = request.COOKIES.get('jwt_access_token')
            data = AccessToken(cookies)
            user = CustomUserDetails.objects.filter(id = data['user_id'])[0]
            user = UserInfoSerializer(user)

            blog = Blogs.objects.create( author = user.instance, 
                                         title = request.data.get('title'),
                                         content = request.data.get('content'),
                                         tags = request.data.get('tags'),
                                         time = request.data.get('time'),
                                         last_updated = request.data.get('time') )
            blog.save()
            print('everything is fine till here')
            print(blog)
            print(f"User '{blog.author.username}' created a post with title '{blog.title}'")
            # id is a default field from the django https://docs.djangoproject.com/en/dev/ref/models/instances/?from=olddocs#auto-incrementing-primary-keys
            return Response({"status" : True, "blog_id": blog.id}) 
        except:
            return Response({"status": False, "Reason": "Backend Error"})
        
class getBlog(APIView):
    def get(self, request):
        try:
            print('Working with getBlog.....')
            cookies = request.COOKIES.get('jwt_access_token')
            data = AccessToken(cookies)
            userObj = None
            if data.get('user_id',None) is not None:
                userObj = CustomUserDetails.objects.filter(id = data['user_id']).first()
            res = []
            likedBlogs, dislikedBlogs = [], []
            if userObj is not None:
                likedBlogs = userObj.liked_blogs.split('<#SEP_USER#>')
                dislikedBlogs = userObj.disliked_blogs.split('<#SEP_USER#>')
            print('UserObject Done')

            blog_id = request.GET.get('blog_id')
            print('Blog Id:', blog_id)
            blog = Blogs.objects.filter(id = blog_id).first()
            if blog == None:
                return Response({"status": False, "Reason": "Invalid Blog Id"})

            blog.views += 1
            blog.save()  # Updates the view count

            print(blog.title)
            print(f"Request for blog with title '{blog.title}'")
            res = {'title':blog.title, 'time':blog.last_updated,'author':blog.author.username,'content':blog.content,
                   'stats':{'views':blog.views,'likes':blog.likes,'dislikes':blog.dislikes,'liked':str(blog.id) in likedBlogs, 
                            'disliked':str(blog.id) in dislikedBlogs},'tags':blog.tags}
            return Response({"status": True, "blog": res})
        except Exception as e:
            print(str(e))
            return Response({"status": False, "Reason": "Backend Error"})

class getFeed(APIView):
    def get(self, request):
        try:
            cookies = request.COOKIES.get('jwt_access_token')
            data = AccessToken(cookies)
            if data.get('user_id') is None:
                userObj = None
            else:
                userObj = CustomUserDetails.objects.filter(id = data['user_id']).first()

            blogs = Blogs.objects.all().iterator(20)
            res = []
            likedBlogs, dislikedBlogs = [], []
            if userObj is not None:
                likedBlogs = userObj.liked_blogs.split('<#SEP_USER#>')
                dislikedBlogs = userObj.disliked_blogs.split('<#SEP_USER#>')
            print("LikedBlogs: ", likedBlogs)
            for b in blogs:
                res.append({'id':b.id, 'title':b.title, 'time':b.last_updated,'author':b.author.username,'content':b.content,
                   'stats':{'views':b.views,'likes':b.likes,'dislikes':b.dislikes,'liked':str(b.id) in likedBlogs, 
                            'disliked':str(b.id) in dislikedBlogs},'tags':b.tags})
            return Response({"status": True, "blogs": json.dumps(res)})
        except Exception as e:
            print(str(e))
            return Response({"status": False, "Reason": "Backend Error"})

class getUserBlogs(APIView):
    def get(self, request):
        try:
            print('Working From the getUserBlogs....')
            cookies = request.COOKIES.get('jwt_access_token')
            data = AccessToken(cookies)
            curUserObj = None
            if data.get('user_id',None) is not None:
                curUserObj = CustomUserDetails.objects.filter(id = data['user_id']).first()
            print(curUserObj)
            userObj = CustomUserDetails.objects.filter( username = request.GET.get('username') ).first()
            print(userObj)
            if userObj == None:
                return Response({"status": False, "Reason": "User Not Found"})
            user = UserInfoSerializer(userObj)
            likedBlogs = userObj.liked_blogs.split('<#SEP_USER#>')
            dislikedBlogs = userObj.disliked_blogs.split('<#SEP_USER#>')
            print(likedBlogs, dislikedBlogs)
            # Get the blogs that user has created
            blogs = Blogs.objects.filter(author = user.instance).iterator()
            author_blogs = []
            count = 0
            for b in blogs:
                if count >= 20: break
                else:   count += 1
                s = {'id':b.id, 'title':b.title, 'time':b.last_updated,'author':b.author.username,'content':b.content,
                   'stats':{'views':b.views,'likes':b.likes,'dislikes':b.dislikes},'tags':b.tags}
                if curUserObj == userObj:   # Only the Current User Can get this info
                    print('User created: ', b.title)
                    print('Liked: ', b.id)
                    s['stats']['liked'] = str(b.id) in likedBlogs
                    s['stats']['disliked'] = str(b.id) in dislikedBlogs
                author_blogs.append(s)
            # Get the blogs that user has liked
            serach_ids = []
            for i in userObj.liked_blogs.split('<#SEP_USER#>'):
                if i != "":     serach_ids.append(int(i))
            blogs = Blogs.objects.filter(id__in = serach_ids).iterator()
            liked_blogs = []
            count = 0
            for b in blogs:
                if count >= 20: break
                else:   count += 1
                s = {'id':b.id, 'title':b.title, 'time':b.last_updated,'author':b.author.username,'content':b.content,
                   'stats':{'views':b.views,'likes':b.likes,'dislikes':b.dislikes},'tags':b.tags}
                if curUserObj == userObj:   # Only the Current User Can get this info
                    print('User liked: ', b.title)
                    s['stats']['liked'] = str(b.id) in likedBlogs
                    s['stats']['disliked'] = str(b.id) in dislikedBlogs
                liked_blogs.append(s)
            return Response({"status": True, "author_blogs": json.dumps(author_blogs), "liked_blogs": json.dumps(liked_blogs)})
        except Exception as e:
            print(str(e))
            return Response({"status": False, "Reason": "Backend Error"})

class updateBlogAction(APIView):
    def post(self, request):
        try:
            print('Executing updateBlogAction')
            cookies = request.COOKIES.get('jwt_access_token')
            data = AccessToken(cookies)
            userObj = CustomUserDetails.objects.filter(id = data['user_id'])[0]
            user = UserInfoSerializer(userObj)
            if user is None:    raise 'Empty User'
            print('User Found')

            blog = Blogs.objects.filter(id = request.data.get('blog_id'))[0]
            if blog is None:    raise 'Empty Blog'
            print('Blog Found')
            
            # Write the code here
            action = request.data.get('action')
            u_id = str(data['user_id'])
            b_id = str(request.data.get('blog_id'))
            if action == 'likes':
                # Generally, user liked blogs will be less (compared to likes of a blog)
                userLiked = userObj.liked_blogs.split('<#SEP_USER#>')
                print(userLiked)
                if b_id in userLiked:
                    print('Performing like undo Action')
                    userLiked.remove(b_id)
                    userObj.liked_blogs += '<#SEP_USER#>'.join(userLiked)

                    blog.likes -= 1
                else:
                    print("Performing Like action")
                    userObj.liked_blogs += '<#SEP_USER#>' + b_id
                    blog.likes += 1

            elif action == 'dislikes':
                # Generally, user liked blogs will be less (compared to likes of a blog)
                userDisLiked = userObj.disliked_blogs.split('<#SEP_USER#>')
                if b_id in userDisLiked:
                    userDisLiked.remove(b_id)
                    userObj.disliked_blogs += '<#SEP_USER#>'.join(userDisLiked)

                    blog.dislikes -= 1
                else:
                    userObj.liked_blogs += '<#SEP_USER#>' + b_id
                    blog.dislikes += 1

            blog.save()
            userObj.save()
            return Response({"status": True})
        except:
            return Response({"status": False, "Reason": "Backend Error"})
        
class DeleteBlog(APIView):
    def post(self, request):
        try:
            print('Function Call entered')
            cookies = request.COOKIES.get('jwt_access_token')
            data = AccessToken(cookies)
            user = CustomUserDetails.objects.filter(id = data['user_id'])[0]
            user = UserInfoSerializer(user)
            if user is None:    raise 'Empty User'
            print('User retrieved')

            blog = Blogs.objects.filter(id = request.data.get('blog_id'))[0]
            print("Blog: ", blog)
            if blog is None:    raise 'Empty Blog'
            if blog.author != user.instance:    raise 'Only Author can Delete Blog'

            blog.delete()
            return Response({"status": True})
        except:
            return Response({"status": False, "Reason": "Backend Error"})
        
class UpdateBlog(APIView):
    def post(self, request):
        try:
            cookies = request.COOKIES.get('jwt_access_token')
            data = AccessToken(cookies)
            user = CustomUserDetails.objects.filter(id = data['user_id'])[0]
            user = UserInfoSerializer(user)
            if user is None:    raise 'Empty User'
            print("User Found")

            blog = Blogs.objects.filter(id = request.data.get('blog_id'))[0]
            if blog is None:    raise 'Empty Blog'
            print("Blog Found")
            if blog.author != user.instance:    raise 'Only Author can Update Blog'
            print("Valid Change")

            blog.updateBlog(title=request.data.get('title'),
                            content=request.data.get('content'),
                            tags = request.data.get('tags'))
            print("Updated Blog: ", request.data)
            return Response({"status": True})
        except:
            return Response({"status": False, "Reason": "Backend Error"})
        
class CreateComment(APIView):
    def post(self, request):
        try:
            cookies = request.COOKIES.get('jwt_access_token')
            data = AccessToken(cookies)
            user = CustomUserDetails.objects.filter(id = data['user_id'])[0]
            user = UserInfoSerializer(user)
            if user is None:    raise 'Empty User'
            print("User Found")

            blog = Blogs.objects.filter(id = request.data.get('blog_id'))[0]
            if blog is None:    raise 'Empty Blog'

            comment = Comments.objects.create(
                author = user.instance, content = request.POST['content'],
                blog_id = blog,
            )            
            comment.save()

            blog.comments += comment + ','
            blog.save()

            return Response({"status": True})
        except:
            return Response({"status": False, "Reason": "Backend Error"})
