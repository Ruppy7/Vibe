from django.shortcuts import render
from rest_framework import generics,status
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
#from django.utils import timezone

# Create your views here.

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            room, created = Room.objects.update_or_create(
                host=host,
                defaults={'guest_can_pause' : guest_can_pause, 
                          'votes_to_skip' : votes_to_skip}
            )
            status_code = status.HTTP_200_OK if not created else status.HTTP_201_CREATED
            return Response(RoomSerializer(room).data, status=status_code)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    