# Generated by Django 3.2.5 on 2023-08-05 13:14

import dirtyfields.dirtyfields
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import koz_stock_api.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Consumers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tax_code', models.IntegerField()),
                ('name', models.CharField(max_length=350)),
                ('contact_name', models.CharField(max_length=255)),
                ('contact_no', models.CharField(max_length=255)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='koz_stock_api.company')),
            ],
            bases=(models.Model, dirtyfields.dirtyfields.DirtyFieldsMixin),
        ),
        migrations.CreateModel(
            name='ProductGroups',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('group_code', models.IntegerField(null=True)),
                ('group_name', models.CharField(max_length=255)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='koz_stock_api.company')),
            ],
            bases=(models.Model, dirtyfields.dirtyfields.DirtyFieldsMixin),
        ),
        migrations.CreateModel(
            name='ProductInflow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('barcode', models.CharField(max_length=100)),
                ('status', models.CharField(max_length=255)),
                ('place_of_use', models.CharField(max_length=255)),
                ('amount', models.FloatField(null=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='koz_stock_api.company')),
            ],
            bases=(models.Model, dirtyfields.dirtyfields.DirtyFieldsMixin),
        ),
        migrations.CreateModel(
            name='ProductOutflow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('barcode', models.CharField(max_length=100)),
                ('status', models.CharField(max_length=255)),
                ('place_of_use', models.CharField(max_length=255)),
                ('amount', models.FloatField(null=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='koz_stock_api.company')),
            ],
            bases=(models.Model, dirtyfields.dirtyfields.DirtyFieldsMixin),
        ),
        migrations.CreateModel(
            name='Products',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_code', models.CharField(max_length=255)),
                ('brand', models.CharField(max_length=255)),
                ('serial_number', models.CharField(max_length=255)),
                ('model', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=255)),
                ('unit', models.CharField(max_length=255)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='koz_stock_api.company')),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='koz_stock_api.productgroups')),
            ],
            bases=(models.Model, dirtyfields.dirtyfields.DirtyFieldsMixin),
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='koz_stock_api.company')),
            ],
        ),
        migrations.CreateModel(
            name='SequenceNumber',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='Suppliers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tax_code', models.IntegerField()),
                ('name', models.CharField(max_length=350)),
                ('contact_name', models.CharField(max_length=255)),
                ('contact_no', models.CharField(max_length=255)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='koz_stock_api.company')),
                ('products', models.ManyToManyField(to='koz_stock_api.Products')),
                ('projects', models.ManyToManyField(related_name='suppliers', to='koz_stock_api.Project')),
            ],
            bases=(models.Model, dirtyfields.dirtyfields.DirtyFieldsMixin),
        ),
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('warehouse', models.CharField(max_length=255, null=True)),
                ('inflow', models.FloatField(null=True)),
                ('outflow', models.FloatField(null=True)),
                ('stock', models.FloatField(null=True)),
                ('reserve_stock', models.FloatField(null=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='koz_stock_api.company')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='koz_stock_api.products')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='koz_stock_api.project')),
            ],
        ),
        migrations.CreateModel(
            name='ProductSubgroups',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subgroup_code', models.IntegerField(null=True)),
                ('subgroup_name', models.CharField(max_length=255)),
                ('sequence_number', models.IntegerField(default=1)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='koz_stock_api.productgroups')),
            ],
            bases=(models.Model, dirtyfields.dirtyfields.DirtyFieldsMixin),
        ),
        migrations.AddField(
            model_name='products',
            name='projects',
            field=models.ManyToManyField(related_name='products', to='koz_stock_api.Project'),
        ),
        migrations.AddField(
            model_name='products',
            name='subgroup',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='koz_stock_api.productsubgroups'),
        ),
        migrations.CreateModel(
            name='ProductOutflowImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to=koz_stock_api.models.RandomFileName('product_images/'))),
                ('product_outflow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='koz_stock_api.productoutflow')),
            ],
        ),
        migrations.AddField(
            model_name='productoutflow',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='koz_stock_api.products'),
        ),
        migrations.AddField(
            model_name='productoutflow',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='koz_stock_api.project'),
        ),
        migrations.AddField(
            model_name='productoutflow',
            name='receiver_company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='receiver_outflows', to='koz_stock_api.consumers'),
        ),
        migrations.AddField(
            model_name='productoutflow',
            name='supplier_company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='supplier_outflows', to='koz_stock_api.suppliers'),
        ),
        migrations.CreateModel(
            name='ProductInflowImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to=koz_stock_api.models.RandomFileName('product_images/'))),
                ('product_inflow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='koz_stock_api.productinflow')),
            ],
        ),
        migrations.AddField(
            model_name='productinflow',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='koz_stock_api.products'),
        ),
        migrations.AddField(
            model_name='productinflow',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='koz_stock_api.project'),
        ),
        migrations.AddField(
            model_name='productinflow',
            name='receiver_company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='receiver_inflows', to='koz_stock_api.consumers'),
        ),
        migrations.AddField(
            model_name='productinflow',
            name='supplier_company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='supplier_inflows', to='koz_stock_api.suppliers'),
        ),
        migrations.AddField(
            model_name='productgroups',
            name='projects',
            field=models.ManyToManyField(related_name='product_groups', to='koz_stock_api.Project'),
        ),
        migrations.AddField(
            model_name='consumers',
            name='products',
            field=models.ManyToManyField(to='koz_stock_api.Products'),
        ),
        migrations.AddField(
            model_name='consumers',
            name='projects',
            field=models.ManyToManyField(related_name='consumers', to='koz_stock_api.Project'),
        ),
        migrations.CreateModel(
            name='Accounting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('unit_price', models.FloatField(null=True)),
                ('discount_rate', models.FloatField(null=True)),
                ('discount_amount', models.FloatField(null=True)),
                ('tax_rate', models.FloatField(null=True)),
                ('tevkifat_rate', models.FloatField(null=True)),
                ('price_without_tax', models.FloatField(null=True)),
                ('unit_price_without_tax', models.FloatField(null=True)),
                ('price_with_tevkifat', models.FloatField(null=True)),
                ('price_total', models.FloatField(null=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='koz_stock_api.company')),
                ('product_inflow', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='koz_stock_api.productinflow')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='koz_stock_api.project')),
            ],
            bases=(models.Model, dirtyfields.dirtyfields.DirtyFieldsMixin),
        ),
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('is_superstaff', models.BooleanField(default=False)),
                ('is_stockstaff', models.BooleanField(default=False)),
                ('is_accountingstaff', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('company', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='koz_stock_api.company')),
                ('current_project', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='koz_stock_api.project')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('projects', models.ManyToManyField(related_name='users', to='koz_stock_api.Project')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
    ]
