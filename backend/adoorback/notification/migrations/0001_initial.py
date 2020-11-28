# Generated by Django 3.1.2 on 2020-11-28 08:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('message', models.CharField(max_length=100)),
                ('target_id', models.IntegerField(blank=True, null=True)),
                ('origin_id', models.IntegerField(blank=True, null=True)),
                ('is_visible', models.BooleanField(default=True)),
                ('is_read', models.BooleanField(default=False)),
                ('actor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_noti_set', to=settings.AUTH_USER_MODEL)),
                ('origin_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='origin_noti_set', to='contenttypes.contenttype')),
                ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_noti_set', to=settings.AUTH_USER_MODEL)),
                ('target_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='targetted_noti_set', to='contenttypes.contenttype')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
