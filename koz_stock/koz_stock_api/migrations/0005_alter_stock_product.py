# Generated by Django 3.2.5 on 2023-09-15 08:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('koz_stock_api', '0004_quantitytakeoff_pose_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stock',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='koz_stock_api.products'),
        ),
    ]
