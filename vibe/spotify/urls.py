from django.urls import path
from .views import AuthURL, spotify_callBack, spotifyAuthenticated

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callBack),
    path('is-authenticated', spotifyAuthenticated.as_view()),
]