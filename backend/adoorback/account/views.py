from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from account.serializers import UserProfileSerializer
from django.contrib.auth import get_user_model
User = get_user_model()


class UserList(generics.ListCreateAPIView):
    """
    List all users, or create a new user.
    """
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or destroy a user.
    """
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer


# @api_view(['GET', 'POST'])
# def user_list(request):
#     """
#     List all users, or create a user.
#     """
#     if request.method == 'GET':
#         users = User.objects.all()
#         serializer = UserProfileSerializer(users, many=True)
#         return JsonResponse(serializer.data, safe=False)
#
#     elif request.method == 'POST':
#         data = JSONParser().parse(request)
#         serializer = UserProfileSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse(serializer.data, status=201)
#         return JsonResponse(serializer.errors, status=400)
#
#
# @api_view(['GET', 'PUT', 'DELETE'])
# def user_detail(request, pk):
#     """
#     Retrieve, update or delete a user.
#     """
#     try:
#         user = User.objects.get(pk=pk)
#     except User.DoesNotExist:
#         return HttpResponse(status=404)
#
#     if request.method == 'GET':
#         serializer = UserProfileSerializer(user)
#         return JsonResponse(serializer.data)
#
#     elif request.method == 'PUT':
#         data = JSONParser().parse(request)
#         serializer = UserProfileSerializer(user, data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse(serializer.data)
#         return JsonResponse(serializer.errors, status=400)
#
#     elif request.method == 'DELETE':
#         user.delete()
#         return HttpResponse(status=204)
