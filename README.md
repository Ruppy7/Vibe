Vibe

Vibe is a web application that emulates a fraction of functionality of Spotify's web player. It is built using Django as the backend framework and React as the frontend library. The integration with the Spotify API allows users to access their Spotify accounts, view their currently playing song, and control playback.

To set up the application, follow these steps:

Install the necessary dependencies by running npm install for the frontend and pipenv install for the backend.

Create a .env file in the root folder and add the CLIENT_ID and CLIENT_SECRET obtained from the Spotify API. These credentials are used for authentication and handling API requests.

Used the Webpack CLI to bundle the frontend code, ensuring seamless integration with the backend.

Test the application by running the appropriate commands for both the frontend and backend environments.

Key Features:

Backend: Django is used to create a secure backend, complete with models, utils and APIViews from DRF(django-rest-framework). The user session key is stored as cookies for identifying users.

Frontend: React is utilized for both functional and class-based components, providing a robust understanding of the technology. The frontend is bundled with Webpack for smooth integration with the backend.

API Integration: The Spotify API is extensively used to fetch user data, and playback control.

DRF (Django Rest Framework): The backend leverages DRF to handle API requests and ensure seamless communication between the frontend and backend components.

This project helped me understand the depth of the frameworks used to build web applications. Hoping that this project would lead me to build more complex appilcations with advanced functionalities.
