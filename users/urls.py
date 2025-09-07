from django.urls import path, include
from . import views


urlpatterns = [
    path("login/", views.oauth_login, name="oauth_login"),
    path("callback/", views.oauth_callback, name="oauth_callback"),
    path("user/", views.user_info, name="user_info"),
    path("logout/", views.logout_user, name="logout_user"),
]
