# django basic imports
from django.shortcuts import render, redirect
from app.models import *
from app.forms import *
from django.contrib import messages
# json based imports
import json
from django.core.serializers.json import DjangoJSONEncoder
# user based imports
from django.contrib.auth.forms import UserCreationForm
from app.forms import CreateUserForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from app.decorators import *
from django.contrib.auth.models import Group

# Create your views here.

def index(request):
    data = surveys.objects.all()
    recent_survey = len(data) - 1
    print(data[recent_survey])
    # Page from the theme 
    return render(request, 'pages/index.html', {"data": data, "recent_survey": data[recent_survey]})
