# Generated by Django 4.2.4 on 2024-06-11 12:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Blogging', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blogs',
            name='last_updated',
            field=models.CharField(default='2024-06-11 17:56:33.556177', max_length=40),
        ),
        migrations.AlterField(
            model_name='blogs',
            name='time',
            field=models.CharField(default='2024-06-11 17:56:33.556177', max_length=40),
        ),
        migrations.AlterField(
            model_name='comments',
            name='last_updated',
            field=models.CharField(default='2024-06-11 17:56:33.557174', max_length=40),
        ),
        migrations.AlterField(
            model_name='comments',
            name='time',
            field=models.CharField(default='2024-06-11 17:56:33.557174', max_length=40),
        ),
    ]