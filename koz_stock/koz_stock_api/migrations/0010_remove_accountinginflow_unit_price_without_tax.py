# Generated by Django 4.1.5 on 2023-10-04 12:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('koz_stock_api', '0009_delete_accounting'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='accountinginflow',
            name='unit_price_without_tax',
        ),
    ]