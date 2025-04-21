from django.contrib import admin
from django.urls import path
from app.views import *
from core import urls

urlpatterns = [
    # Main Pages
    path('dashboard', index, name='dashboard'),
    path("admin/", admin.site.urls, name="admin"),
    path("all-data/", all_data_view, name="all-data"),
    path("map", map_view, name="map"),
    path("clients", client_view, name="clients"),
    path("", home_view, name="home"),

    # Side Pages
    path("create-surveys", create_data_view, name="create-survey"),
    path('delete-survey/<int:survey_id>/', delete_survey_view, name='delete_survey'),
    path('update-survey/<int:survey_id>/', update_survey_view, name='update_survey'),
    path('nearby-survey/<int:survey_id>/', nearby_survey_view, name='nearby_survey'),

    # User Pages
    path("login", login_view, name="login"),
    path("logout", logout_view, name="logout"),
    path("signup", signup_view, name="signup"),
    path("reset-password", reset_password_view, name="password_reset"),

    # Test Pages
    # path("test", test_view, name="test"),
] + urls.urlpatterns
