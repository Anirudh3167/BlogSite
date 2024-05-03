from django.urls import path
from . views import *

urlpatterns = [
    path("create-blog",createBlog.as_view(),name="Create Blog"),
    path('get-blog',getBlog.as_view(),name = "Get Blog"),
    path('get-feed', getFeed.as_view(), name = "Get Feed"),
    path('user-blogs', getUserBlogs.as_view(), name = "User Blogs"),
]