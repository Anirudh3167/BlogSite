# Generated by Django 4.2.4 on 2024-06-12 06:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Blogging', '0003_blogs_userdisliked_blogs_userliked_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blogs',
            name='last_updated',
            field=models.CharField(default='2024-06-12 11:56:11.257008', max_length=40),
        ),
        migrations.AlterField(
            model_name='blogs',
            name='time',
            field=models.CharField(default='2024-06-12 11:56:11.257008', max_length=40),
        ),
        migrations.AlterField(
            model_name='comments',
            name='last_updated',
            field=models.CharField(default='2024-06-12 11:56:11.257008', max_length=40),
        ),
        migrations.AlterField(
            model_name='comments',
            name='time',
            field=models.CharField(default='2024-06-12 11:56:11.257008', max_length=40),
        ),
    ]