# Generated by Django 4.2.4 on 2023-08-25 06:50

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('blogging', '0002_alter_blogs_options_alter_blogs_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='blogs',
            name='last_updated',
            field=models.DateTimeField(default=datetime.datetime(2023, 8, 25, 12, 20, 1, 606557)),
        ),
        migrations.AlterField(
            model_name='blogs',
            name='time',
            field=models.DateTimeField(default=datetime.datetime(2023, 8, 25, 12, 20, 1, 606557)),
        ),
        migrations.CreateModel(
            name='Comments',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(default='')),
                ('time', models.DateTimeField(default=datetime.datetime(2023, 8, 25, 12, 20, 1, 606557))),
                ('last_updated', models.DateTimeField(default=datetime.datetime(2023, 8, 25, 12, 20, 1, 606557))),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('blog_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='blogging.blogs')),
            ],
            options={
                'verbose_name': 'Comment',
                'verbose_name_plural': 'Comments',
            },
        ),
    ]
