# Generated by Django 3.1.2 on 2020-12-06 18:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('target_id', models.IntegerField(null=True)),
                ('origin_id', models.IntegerField(null=True)),
                ('redirect_url', models.CharField(max_length=150)),
                ('message', models.CharField(max_length=100)),
                ('is_visible', models.BooleanField(default=True)),
                ('is_read', models.BooleanField(default=False)),
                ('actor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL,
                                            related_name='sent_noti_set', to=settings.AUTH_USER_MODEL)),
                ('origin_type', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL,
                                                  related_name='origin_noti_set', to='contenttypes.contenttype')),
                ('target_type', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT,
                                                  related_name='targetted_noti_set', to='contenttypes.contenttype')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL,
                                           related_name='received_noti_set', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
