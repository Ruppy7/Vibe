from django.shortcuts import render
from rest_framework import generics,status
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
#from django.utils import timezone

# Create your views here.

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    

class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_code = 'code'
    
    def get(self,request, format=None):
        code = request.GET.get(self.lookup_code)
        if code!=None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status = status.HTTP_200_OK)
            return Response({'Room Not Found' : 'Invalid Room Code'}, status = status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request' : 'Invalid Data Provided'}, status = status.HTTP_400_BAD_REQUEST)
    
    
class RoomJoin(APIView):
    lookup_code = 'code'
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        code = request.data.get(self.lookup_code)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                room = room[0]
                self.request.session['room_code'] = code
                return Response({'message' : 'Room Joined!'}, status = status.HTTP_200_OK)
            return Response({'Not Found' : 'Invalid room code'}, status = status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request' : 'Provide Valid Data'}, status = status.HTTP_400_BAD_REQUEST)
    
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
            self.request.session['room_code'] = room.code
            status_code = status.HTTP_200_OK if not created else status.HTTP_201_CREATED
            return Response(RoomSerializer(room).data, status=status_code)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
class UserInRoom(APIView):
    def get(self, request, format= None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'code' : self.request.session.get('room_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)
    
class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room = Room.objects.filter(host=host_id)
            if len(room) > 0:
                room = room[0]
                room.delete()
        return Response({'Message' : 'Success'}, status=status.HTTP_200_OK)
    
class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer
    
    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')
            
            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'message' : 'Room not found '}, status=status.HTTP_404_NOT_FOUND)
            room = queryset[0]
            host_id = self.request.session.session_key
            if room.host != host_id:
                return Response({"message" : "Only the hosts are allowed to change the room settings"}, status=status.HTTP_403_FORBIDDEN)
            room.guest_can_pause = guest_can_pause
            room.votes_to_skip   = votes_to_skip
            room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            return Response({'message' : 'Room updated Successfully'}, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)