from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import surveys
from decimal import Decimal
from djmoney.money import Money
from djmoney.models.fields import MoneyField

# forms ---
class SurveyFormv2(forms.Form):
    DateOrdered = forms.DateField(required=False, input_formats=['%m/%d/%Y']) #Check
    DueDate = forms.DateField(required=False, input_formats=['%m/%d/%Y']) #Check
    Number = forms.CharField(max_length=6, required=True) # Check
    Description = forms.CharField(max_length=99, required=False) # Check
    Ammount = forms.DecimalField(required=False, max_digits=10, decimal_places=2) # Check
    NTEPrice = forms.DecimalField(required=False, max_digits=10, decimal_places=2) # Check
    Client = forms.CharField(max_length=50, required=True) # Check
    PhoneNumber = forms.CharField(max_length=12, required=False) # Check
    Address = forms.CharField(max_length=40, required=True) # Check
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

class SurveyForm(forms.ModelForm):
    DateOrdered = forms.DateField(required=False, input_formats=['%m/%d/%Y'])
    DueDate = forms.DateField(required=False, input_formats=['%m/%d/%Y'])
    PhoneNumber = forms.CharField(max_length=12, required=False)
    Status = forms.CharField(max_length=15, required=False)
    County = forms.CharField(max_length=20, required=False)
    Hourly = forms.BooleanField(required=False)
    HourlyAmmount = forms.CharField(max_length=20, required=False)
    Ammount = MoneyField(max_digits=10, decimal_places=2, currency_choices=[('USD', 'USD')], blank=True)
    NTEPrice = MoneyField(max_digits=10, decimal_places=2, currency_choices=[('USD', 'USD')], blank=True)
    FractionalLot = forms.CharField(max_length=30, required=False)
    Section = forms.CharField(max_length=30, required=False)
    Township = forms.CharField(max_length=30, required=False)
    Range = forms.CharField(max_length=30, required=False)
    Subdivision = forms.CharField(max_length=30, required=False)
    BlockSection = forms.CharField(max_length=30, required=False)
    Lot = forms.CharField(max_length=30, required=False)

    def clean_Ammount(self):
        ammount = self.cleaned_data.get('Ammount')
        # If ammount is a string, strip non-numeric characters, and convert it to a Money object
        if isinstance(ammount, str):
            # Remove dollar sign, commas, and convert to a Decimal
            ammount = ammount.replace('$', '').replace(',', '')
            ammount = Decimal(ammount)  # Convert to Decimal
        # If it's already a Money object, just return it
        if isinstance(ammount, Money):
            return ammount
        # Return the cleaned amount as a Money object (with USD currency)
        return Money(ammount, 'USD')

    def clean_NTEPrice(self):
        nte_price = self.cleaned_data.get('NTEPrice')
        # If nte_price is a string, strip non-numeric characters, and convert it to a Money object
        if isinstance(nte_price, str):
            # Remove dollar sign, commas, and convert to a Decimal
            nte_price = nte_price.replace('$', '').replace(',', '')
            nte_price = Decimal(nte_price)  # Convert to Decimal
        # If it's already a Money object, just return it
        if isinstance(nte_price, Money):
            return nte_price
        # Return the cleaned amount as a Money object (with USD currency)
        return Money(nte_price, 'USD')
    class Meta:
        model = surveys
        fields = '__all__'

class CreateUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']