from django.urls import path
from .views import AuthURL, spotify_callBack, spotifyAuthenticated, CurrentSong, PauseSong, PlaySong, SkipSong 

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callBack),
    path('is-authenticated', spotifyAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view()),
    path('pause', PauseSong.as_view()),
    path('play', PlaySong.as_view()),
    path('skip', SkipSong.as_view()),
]