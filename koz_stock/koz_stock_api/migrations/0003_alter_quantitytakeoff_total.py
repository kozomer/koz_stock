# Generated by Django 3.2.5 on 2023-09-11 12:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('koz_stock_api', '0002_building_elevationorfloor_place_section_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quantitytakeoff',
            name='total',
            field=models.DecimalField(decimal_places=2, max_digits=15),
        ),
    ]