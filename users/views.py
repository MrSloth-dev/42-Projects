from django.http import JsonResponse
from django.shortcuts import redirect
from django.contrib.auth import login, logout
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import requests
import urllib.parse
from .models import User

def oauth_login(request):
    """Initiate 42 OAuth flow"""
    params = {
        "client_id": settings.OAUTH_42_CLIENT_ID,
        "redirect_uri": settings.OAUTH_42_REDIRECT_URI,
        "response_type": "code",
        "scope": "public",
    }
    auth_url = f"{settings.OAUTH_42_AUTHORIZATION_URL}?{urllib.parse.urlencode(params)}"
    return JsonResponse({"auth_url": auth_url})

@csrf_exempt
def logout_user(request):
    logout(request)
    return JsonResponse({"success": True, "message": "Logged out successfully!"})

@csrf_exempt
def oauth_callback(request):
    """Handle 42 OAuth callback"""
    if request.method == "GET":
        # Handle direct OAuth callback from 42
        code = request.GET.get("code")
        if not code:
            return redirect(f"{settings.FRONTEND_URL}/auth/callback?error=no_code")

        # Process the OAuth code
        token_data = {
            "grant_type": "authorization_code",
            "client_id": settings.OAUTH_42_CLIENT_ID,
            "client_secret": settings.OAUTH_42_CLIENT_SECRET,
            "code": code,
            "redirect_uri": settings.OAUTH_42_REDIRECT_URI,
        }

        token_response = requests.post(settings.OAUTH_42_TOKEN_URL, data=token_data)
        token_json = token_response.json()

        if "access_token" not in token_json:
            return redirect(f"{settings.FRONTEND_URL}/auth/callback?error=token_failed")

        headers = {"Authorization": f"Bearer {token_json['access_token']}"}
        user_response = requests.get(settings.OAUTH_42_USER_URL, headers=headers)

        if user_response.status_code != 200:
            return redirect(
                f"{settings.FRONTEND_URL}/auth/callback?error=user_info_failed"
            )

        user_data = user_response.json()

        try:
            user, created = User.objects.get_or_create(
                user_42_id=user_data["id"],
                defaults={
                    "username": user_data["login"],
                    "login_42": user_data["login"],
                    "email": user_data["email"],
                    "email_42": user_data["email"],
                    "image_url": user_data.get("image", {})
                    .get("versions", {})
                    .get("medium", ""),
                    "campus": user_data.get("campus", [{}])[0].get("name", "")
                    if user_data.get("campus")
                    else "",
                },
            )

            login(request, user)

            return redirect(f"{settings.FRONTEND_URL}/dashboard")
        except Exception:
            return redirect(
                f"{settings.FRONTEND_URL}/auth/callback?error=user_creation_failed"
            )

    elif request.method == "POST":
        return JsonResponse(
            {"error": "POST method not supported in direct OAuth flow"}, status=405
        )

def user_info(request):
    """Get current user info"""
    if request.user.is_authenticated:
        return JsonResponse(
            {
                "id": request.user.id,
                "username": request.user.username,
                "login_42": request.user.login_42,
                "email": request.user.email,
                "image_url": request.user.image_url,
                "campus": request.user.campus,
            }
        )
    return JsonResponse({"error": "Not authenticated"}, status=401)
