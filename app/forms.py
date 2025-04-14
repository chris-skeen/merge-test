from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

# forms ---
class SurveyForm(forms.Form):
    DateOrdered = forms.DateField(required=False, input_formats=['%m/%d/%Y'])
    DueDate = forms.DateField(required=False, input_formats=['%m/%d/%Y'])
    Number = forms.CharField(max_length=6, required=True)
    Description = forms.CharField(max_length=99, required=False)
    Ammount = forms.DecimalField(required=False, max_digits=10, decimal_places=2)
    NTEPrice = forms.DecimalField(required=False, max_digits=10, decimal_places=2)
    Client = forms.CharField(max_length=50, required=True)
    PhoneNumber = forms.CharField(max_length=12, required=False)
    Address = forms.CharField(max_length=40, required=True)
    City = forms.CharField(max_length=20, required=True)
    State = forms.CharField(max_length=15, required=True)
    County = forms.CharField(max_length=15, required=False)
    FractionalLot = forms.CharField(max_length=30, required=False)
    Section = forms.CharField(max_length=30,required=False)
    Township = forms.CharField(max_length=30, required=False)
    Range = forms.CharField(max_length=30, required=False)
    Subdivision = forms.CharField(max_length=30, required=False)
    BlockSection = forms.CharField(max_length=30, required=False)
    Lot = forms.CharField(max_length=30, required=False)
    Status = forms.CharField(max_length=15, required=True)
    Comments = forms.CharField(max_length=100, required=False)
    Favorite = forms.BooleanField(required=False)
    Hourly = forms.BooleanField(required=False)
    HourlyAmmount = forms.CharField(max_length=20, required=False)

class CreateUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']