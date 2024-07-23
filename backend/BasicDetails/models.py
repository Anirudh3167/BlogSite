from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUserDetails(AbstractUser):
    interests = models.TextField(default='BlogSite, Blogging', blank=True) # Contains the interests concatenated
    liked_blogs = models.TextField(default='', blank=True) # use <#SEP_USER#> as seperator for blog ids
    disliked_blogs = models.TextField(default='', blank=True) # use <#SEP_USER#> as seperator for blog ids
    liked_comments = models.TextField(default='', blank=True) # use <#SEP_USER#> as seperator for comment ids
    disliked_comments = models.TextField(default='', blank=True) # use <#SEP_USER#> as seperator for comment ids
    followed_users = models.ManyToManyField('self')

    def update_liked_blog(self, blog_id, update_type = 'add'):
        if update_type.lower() == 'add':
            self.liked_blogs += '[<#SEP#>]' + blog_id
        else:
            # Be careful while getting the data as it may give [SEP][SEP]AI[SEP]ML
            self.liked_blogs.replace(blog_id,'')
        self.save()

    def update_interests(self, name, update_type = 'add'):
        if update_type.lower() == 'add':
            self.interests += '[<#SEP#>]' + name
        else:
            # Be careful while getting the data as it may give [SEP][SEP]AI[SEP]ML
            self.interests.replace(name,'')
        self.save()

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "CustomUserDetails"
        verbose_name_plural = "CustomUsersDetails"
