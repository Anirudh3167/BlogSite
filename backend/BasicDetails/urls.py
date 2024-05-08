from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('user',UserDetails.as_view(),name="User_Details"),
    path('user/isLogged',IsLoggedView.as_view(),name="User_is_logged"),
    path('logout', LogoutView.as_view(), name='logout'),
    path('login', LoginView.as_view(), name='token_obtain_pair'),
    path('register',RegisterView.as_view(), name='User_Register'),
]
# For JSON Web Tokens
urlpatterns += [
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
