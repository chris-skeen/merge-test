from django.contrib import admin
from django.urls import path
from app.views import *
from core import urls

urlpatterns = [
    # Main Pages
    path("admin/", admin.site.urls, name="admin"),
    path("all-data/", all_data_view, name="all-data"),
    path("map", map_view, name="map"),
    path("clients", client_view, name="clients"),

    # Side Pages
    path("create-surveys", create_data_view, name="create-surveys"),

    # User Pages
    path("login", login_view, name="login"),
    path("logout", logout_view, name="logout"),
    path("signup", signup_view, name="signup"),
    path("home", home_view, name="home"),
] + urls.urlpatterns
