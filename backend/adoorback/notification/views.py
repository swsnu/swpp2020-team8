from rest_framework import generics
from rest_framework import permissions
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from django.http import HttpResponse

from notification.models import Notification
from notification.serializers import NotificationSerializer

from adoorback.permissions import IsRecipient


@api_view(["GET", "PUT"])
def notification_list(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    notifications = Notification.objects.filter(recipient_id=request.user.id, is_visible=True).order_by('-created_at')
    paginator = PageNumberPagination()
    paginator.page_size = 15

    if request.method == 'GET':
        paginated_result = paginator.paginate_queryset(notifications, request)
        serializer = NotificationSerializer(paginated_result, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

    elif request.method == 'PUT':
        notifications.update(is_read=True)
        paginated_result = paginator.paginate_queryset(notifications, request)
        serializer = NotificationSerializer(paginated_result, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

class NotificationDetail(generics.UpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsRecipient]
