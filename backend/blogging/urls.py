from django.urls import path
from . views import *

urlpatterns = [
    path("create-blog",create_blog.as_view(),name="Create Blog"),
]