from django.db import models
from django.db.models import Q
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.
class Blogs(models.Model):
    '''
    Represents a blog post.

    Fields:
        title (TextField): The title of the blog post.
        content (TextField): The content of the blog post.
        time (DateTimeField): The timestamp of when the blog was created.
        author (ForeignKey): The author of the blog post.
        tags (TextField): Tags associated with the blog.
        last_updated (DateTimeField): The timestamp of the last update.

    Functions:
        - updateBlog(new_title, new_content): Updates the title and content of the blog.
        - deleteBlog(): Deletes the blog post.
        - filterBlogs(text): Returns blogs that match the given text in title, content, or author name.
        - getBlogs(): Returns all blogs.

    Example Usage:
        # Creating a new blog
        new_blog = Blogs.objects.create(title="Sample Title", content="Sample Content", author=user_instance)

        # Updating a blog
        new_blog.updateBlog("Updated Title", "Updated Content")

        # Deleting a blog
        new_blog.deleteBlog()

        # Filtering blogs
        filtered_blogs = Blogs.filterBlogs("example")
    '''
    # As we are using the built-in id. So no need of this
    # id = models.CharField(max_length=255,primary_key=True)
    title = models.TextField(default="No Title")
    content = models.TextField(default="No Content")
    time = models.DateTimeField(default=datetime.now())
    author = models.ForeignKey(User,on_delete=models.CASCADE)
    tags = models.TextField(default="Blog")
    last_updated = models.DateTimeField(default=datetime.now())

    def updateBlog(self,title,content,last_updated):
        '''
        Update the title and content of the blog.

        Args:
            new_title (str): The new title for the blog.
            new_content (str): The new content for the blog.

        Returns:
            None
        '''
        self.title = title
        self.content = content
        self.last_updated = last_updated
        self.save()

    def deleteBlog(self):
        '''
        Delete the blog post.

        Args:
            None

        Returns:
            None
        '''
        self.delete()

    @classmethod
    def filterBlogs(cls,text):
        '''
        Filter blogs that match the given text in title, tags, content, or author name.

        Args:
            text (str): The text to search for.

        Returns:
            QuerySet: A QuerySet containing blogs that match the search text.
        '''
        return cls.objects.filter(
            Q(author__username__icontains=text) |
            Q(tags__icontains = text) |
            Q(title__icontains=text) |
            Q(content__icontains=text)
        )
    
    @classmethod
    def getBlogs(cls,user):
        '''
        Get all blogs.

        Args:
            None

        Returns:
            QuerySet: A QuerySet containing all blogs.
        '''
        return cls.objects.filter(author = user)

    def __str__(self):
        return f"Blog:Author={self.author}, Time={self.time}, Last Updated={self.last_updated}, Title={self.title}"

    class Meta:
        verbose_name = "Blog"
        verbose_name_plural = "Blogs"

class Comments(models.Model):
    '''
    Represents a comment on a blog post.

    Fields:
        author (ForeignKey): The author of the comment.
        content (TextField): The content of the comment.
        time (DateTimeField): The timestamp of when the comment was created.
        last_updated (DateTimeField): The timestamp of the last update.
        blog_id (ForeignKey): The blog post to which the comment belongs.

    Functions:
        - updateComment(new_content): Updates the content of the comment.
        - deleteComment(): Deletes the comment.
        - filterComments(text): Returns comments that match the given text in author name, title, or content.
        - getComments(blog_id): Returns comments associated with the given blog ID.

    Example Usage:
        # Creating a new comment
        new_comment = Comments.objects.create(author=user_instance, content="Sample comment", comment_id=blog_instance)

        # Updating a comment
        new_comment.updateComment("Updated comment")

        # Deleting a comment
        new_comment.deleteComment()
        
        # Filtering comments
        filtered_comments = Comments.filterComments("example")

        # Getting comments for a specific blog
        comments_for_blog = Comments.getComments(blog_instance.id)
    '''
    # As we are using the built-in id. So no need of this
    # id = models.CharField(max_length=255,primary_key=True)
    author = models.ForeignKey(User,on_delete=models.CASCADE)
    content = models.TextField(default="")
    time = models.DateTimeField(default=datetime.now())
    last_updated = models.DateTimeField(default=datetime.now())
    blog_id = models.ForeignKey(Blogs,on_delete=models.CASCADE)

    def updateComment(self,content,last_updated):
        '''
        Update the content of the comment.

        Args:
            new_content (str): The new content for the comment.

        Returns:
            None
        '''
        self.content = content
        self.last_updated = last_updated
        self.save()

    def deleteComment(self):
        '''
        Delete the comment.

        Args:
            None

        Returns:
            None
        '''
        self.delete()
    
    @classmethod
    def filterComments(cls,text):
        '''
        Filter comments that match the given text in author name, title, or content.

        Args:
            text (str): The text to search for.

        Returns:
            QuerySet: A QuerySet containing comments that match the search text.
        '''
        return cls.objects.filter(
            Q(author__username__icontains=text) |
            Q(title__icontains=text) |
            Q(content__icontains=text)
        )
    
    @classmethod
    def getComments(cls,blog_id):
        '''
        Get comments associated with the given blog ID.

        Args:
            blog_id (int): The ID of the blog post.

        Returns:
            QuerySet: A QuerySet containing comments associated with the specified blog ID.
        '''
        return cls.objects.filter(blog_id = blog_id)

    def __str__(self):
        return f"Author={self.author}, Time={self.time}, Last Updated={self.last_updated}, Comment: Content={self.content[:20]}..."

    class Meta:
        verbose_name = "Comment"
        verbose_name_plural = "Comments"
