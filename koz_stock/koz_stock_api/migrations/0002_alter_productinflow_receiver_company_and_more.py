# Generated by Django 4.1.5 on 2023-07-18 14:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('koz_stock_api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productinflow',
            name='receiver_company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='receiver_inflows', to='koz_stock_api.consumers'),
        ),
        migrations.AlterField(
            model_name='productoutflow',
            name='supplier_company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='supplier_outflows', to='koz_stock_api.suppliers'),
        ),
    ]
