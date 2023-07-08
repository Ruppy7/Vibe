from dotenv import load_dotenv
load_dotenv()
import os

CLIENT_ID = "eebc4e8cfae8463f9ca933dc2c5d6fd6"
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
REDIRECT_URI = "http://127.0.0.1:8000/spotify/redirect"