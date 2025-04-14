from django.db import models
from djmoney.models.fields import MoneyField
# Create your models here.
from django.db import models

# class surveys - the main table used to query all data for this map.
class surveys(models.Model):
    DateOrdered = models.DateField()
    DueDate = models.DateField()
    Number = models.CharField(max_length=6)
    Description = models.CharField(max_length=99)
    Ammount = MoneyField(max_digits=10, decimal_places=2, default_currency='USD', blank=True, default=0.00)
    NTEPrice = MoneyField(max_digits=10, decimal_places=2, default_currency='USD', blank=True, default=0.00)
    Client = models.CharField(max_length=50)
    PhoneNumber = models.CharField(max_length=12)
    Address = models.CharField(max_length=40)
    City = models.CharField(max_length=20)
    State = models.CharField(max_length=15)
    County = models.CharField(max_length=15)
    FractionalLot = models.CharField(max_length=30)
    Section = models.CharField(max_length=30)
    Township = models.CharField(max_length=30)
    Range = models.CharField(max_length=30)
    Subdivision = models.CharField(max_length=30)
    BlockSection = models.CharField(max_length=30)
    Lot = models.CharField(max_length=30)
    Status = models.CharField(max_length=15)
    Comments = models.CharField(max_length=100)
    Favorite = models.BooleanField(default=False)
    Hourly = models.BooleanField(default=False)
    HourlyAmmount = models.CharField(max_length=20, blank=True)
    class Meta:
            db_table = 'surveys'
    