from rest_framework import serializers
from .models import CustomUserDetails

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUserDetails
        fields = ['id','username','email','interests','liked_blogs','disliked_blogs',
                  'liked_comments','disliked_comments']
        