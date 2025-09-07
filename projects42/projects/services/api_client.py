from requests_oauthlib import OAuth2Session
import requests
from decouple import config


class API42Client:
    def __init__(self):
        self.uid = config('API_42_UID')
        self.secret = config('API_42_SECRET')
        self.base_url = 'https://api.intra.42.fr'
        self.token_url = f'{self.base_url}/oauth/token'
        self.auth_url = f'{self.base_url}/oauth/authorize'
        self.access_token = None

    def authenticate(self):
        """Get access token using client credentials flow"""
        data = {
            'grant_type': 'client_credentials',
            'client_secret': self.secret,
            'client_id': self.uid,
        }
        response = requests.post(self.token_url, data=data)
        response.raise_for_status()

        token_data = response.json()
        self.access_token = token_data['access_token']
        return self.access_token

    def get(self, endpoint, params=None):
        """Make authenticated GET request to 42 API"""
        if not self.access_token:
            self.authenticate()
        headers = {'Authorization': f'Bearer {self.access_token}'}
        url = f'{self.base_url}{endpoint}'
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
