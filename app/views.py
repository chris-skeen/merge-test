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
from .forms import CreateUserForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from app.decorators import *
from django.contrib.auth.models import Group

# Main Pages ----

@login_required(login_url='login')
@allowed_users(allowed_roles=['employee', 'admin'])
def all_data_view(request):
  # Always re writing json file on new page
  data = surveys.objects.values()
  json_data = json.dumps(list(data), indent=2, cls=DjangoJSONEncoder)

  file_path = "app/static/data.json"

  with open(file_path, "w") as json_file:
    json_file.write(json_data)

  return render(request, "data.html", {"data": data, "json_data": json_data})

@login_required(login_url='login')
@allowed_users(allowed_roles=['employee', 'admin'])
def map_view(request):
  # Always re writing json file on new page
  data = surveys.objects.values()
  json_data = json.dumps(list(data), indent=2, cls=DjangoJSONEncoder)

  file_path = "app/static/data.json"

  with open(file_path, "w") as json_file:
    json_file.write(json_data)

  data = surveys.objects.all()
  return render(request, "map.html", {"data": data})

@login_required(login_url='login')
@allowed_users(allowed_roles=['employee', 'admin'])
def client_view(request):
  # View all clients
  data = surveys.objects.all()
  return render(request, "clients.html", {"data": data})

# User Pages ---

@unauthenticated_user
def login_view(request):
   context = {}
   if request.method == 'POST':
      username = request.POST.get('username')
      password = request.POST.get('password')
      user = authenticate(request, username=username, password=password)

      if user is not None:
         print('hi')
         login(request, user)
         return redirect('map')
      else:
         messages.info(request, 'Username OR Password Incorrect.')
   return render(request, "login.html", context)

@login_required(login_url='login')
@allowed_users(allowed_roles=['employee', 'admin'])
def logout_view(request):
   logout(request)
   return redirect('login')

@unauthenticated_user
def signup_view(request):
   form = CreateUserForm()

   if request.method == 'POST':
      form = UserCreationForm(request.POST)
      if form.is_valid():
         user = form.save()
         username = form.cleaned_data.get('username')
         messages.success(request, 'Account Successfully Created - ' + username)
         return redirect('login')

   context = {'form':form}
   return render(request, "signup.html", context)

# Side Pages ---
@login_required(login_url='login')
@allowed_users(allowed_roles=['employee', 'admin'])
def create_data_view(request):
    context = {}

    if request.method == "POST":
        form = SurveyForm(request.POST)
        print("POST data:", request.POST)
        if form.is_valid():
            print('hi')
            # Save To DB
            date_ordered = form.cleaned_data.get('DateOrdered')
            due_date = form.cleaned_data.get('DueDate')
            number = form.cleaned_data.get('Number')
            description = form.cleaned_data.get('Description')
            ammount = form.cleaned_data.get('Ammount')
            nte_price = form.cleaned_data.get('NTEPrice')
            client = form.cleaned_data.get('Client')
            phone_number = form.cleaned_data.get('PhoneNumber')
            address = form.cleaned_data.get('Address')
            city = form.cleaned_data.get('City')
            state = form.cleaned_data.get('State')
            county = form.cleaned_data.get('County')
            fractional_lot = form.cleaned_data.get('FractionalLot')
            section = form.cleaned_data.get('Section')
            township = form.cleaned_data.get('Township')
            _range = form.cleaned_data.get('Range')
            subdivision = form.cleaned_data.get('Subdivision')
            blocksection = form.cleaned_data.get('BlockSection')
            lot = form.cleaned_data.get('Lot')
            status = form.cleaned_data.get('Status')
            comments = form.cleaned_data.get('Comments')
            favorite = form.cleaned_data.get('Favorite')
            hourly = form.cleaned_data.get('Hourly')
            hourly_ammount = form.cleaned_data.get('HourlyAmmount')

            if not nte_price:
                nte_price = 0.00  # Example: setting a default value

            obj = surveys(DateOrdered = date_ordered,
                          DueDate = due_date,
                          Number = number,
                          Description = description,
                          Ammount = ammount,
                          NTEPrice = nte_price,
                          Client = client,
                          PhoneNumber = phone_number,
                          Address = address,
                          City = city,
                          State = state,
                          County = county,
                          FractionalLot = fractional_lot,
                          Section = section,
                          Township = township,
                          Range = _range,
                          Subdivision = subdivision,
                          BlockSection = blocksection,
                          Lot = lot,
                          Status = status,
                          Comments = comments,
                          Favorite = favorite,
                          Hourly = hourly,
                          HourlyAmmount = hourly_ammount)
            try:
              obj.save()
              print("Saved:", obj.id)
            except Exception as e:
              print("Error saving object:", e)


            
        context['form'] = form 
    else:
        print('wrong')
        form = SurveyForm()
        print(form.errors)
        context['form'] = form 

    return render(request, "create-data.html", context)