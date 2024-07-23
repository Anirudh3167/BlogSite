from django.urls import path
from . views import *

urlpatterns = [
    path("create-blog",createBlog.as_view(),name="Create Blog"),
    path('get-blog',getBlog.as_view(),name = "Get Blog"),
    path('get-feed', getFeed.as_view(), name = "Get Feed"),
    path('user-blogs', getUserBlogs.as_view(), name = "User Blogs"),
    path('update-blog-stats', updateBlogAction.as_view(), name = 'Update Blog Stats'),
    path('delete-blog',DeleteBlog.as_view(), name= "Delete Blog"),
    path('update-blog', UpdateBlog.as_view(), name="Update Blog"),
]