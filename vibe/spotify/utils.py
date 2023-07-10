from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
import requests

BASE_URL = "https://api.spotify.com/v1/me/"

def get_user_tokens(session_key):
    user_tokens = SpotifyToken.objects.filter(user=session_key)
    if user_tokens.exists():
        return user_tokens[0]
    return None

def update_or_create_user_token(session_key, access_token, token_type, expires_in, refresh_token):
    tokens     = get_user_tokens(session_key)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token  = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in    = expires_in
        tokens.token_type    = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=session_key, access_token=access_token, refresh_token=refresh_token, expires_in=expires_in, token_type=token_type)
        tokens.save()
        
def is_spotify_authenticated(session_key):
    tokens = get_user_tokens(session_key)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_key, tokens)
        return True
    return False

def refresh_spotify_token(session_key, tokens):
    refresh_token = tokens.refresh_token
    
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type' : 'refresh_token',
        'refresh_token' : refresh_token,
        'client_id'  : CLIENT_ID,
        'client_secret' : CLIENT_SECRET,
    }).json()
    
    access_token = response.get('access_token')
    token_type   = response.get('token_type')
    expires_in   = response.get('expires_in')
    
    update_or_create_user_token(session_key, access_token, token_type, expires_in, refresh_token)

def execute_spotify_api_request(session_key, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_key)
    headers = {'Content-type': 'application/json', 'Authorization': "Bearer " + tokens.access_token}
    
    if post_:
        response = requests.post(BASE_URL + endpoint, headers=headers)
    elif put_:
        response = requests.put(BASE_URL + endpoint, headers=headers)
    else:
        response = requests.get(BASE_URL + endpoint, headers=headers)
    
    if response.status_code == requests.codes.ok:
        return response.json()
    else:
        return {'Error': f'Request failed with status code {response.status_code}'}