# Generated by Django 5.1.7 on 2025-04-11 13:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="surveys",
            old_name="Amount",
            new_name="Ammount",
        ),
        migrations.RenameField(
            model_name="surveys",
            old_name="Amount_currency",
            new_name="Ammount_currency",
        ),
        migrations.RenameField(
            model_name="surveys",
            old_name="HourlyAmount",
            new_name="HourlyAmmount",
        ),
    ]
