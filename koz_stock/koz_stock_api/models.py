from django.db import models
from dirtyfields import DirtyFieldsMixin
from django.contrib.auth.models import AbstractUser

class SequenceNumber(models.Model):
    number = models.IntegerField(default=1)

class Company(models.Model):
    name = models.CharField(max_length=200)


class Project(models.Model):
    name = models.CharField(max_length=200)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)


class CustomUser(AbstractUser):
    is_superstaff = models.BooleanField(default=False)
    is_stockstaff = models.BooleanField(default=False)
    is_accountingstaff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True)
    current_project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True)
    projects = models.ManyToManyField(Project, related_name="users")

class ProductGroups(models.Model, DirtyFieldsMixin):
    group_code = models.IntegerField(null=True)
    group_name = models.CharField(max_length=255)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

class ProductSubgroups(models.Model, DirtyFieldsMixin):
    subgroup_code = models.IntegerField(null=True)
    subgroup_name = models.CharField(max_length=255)
    group = models.ForeignKey(ProductGroups, on_delete=models.PROTECT)
    sequence_number = models.IntegerField(default= 1)

class Products(models.Model, DirtyFieldsMixin):
    product_code = models.CharField(max_length=255)
<<<<<<< HEAD
    group = models.CharField(max_length=255)
    subgroup = models.CharField(max_length=255)
=======
    group = models.ForeignKey(ProductGroups, on_delete=models.PROTECT)
    subgroup = models.ForeignKey(ProductSubgroups, on_delete=models.PROTECT)
>>>>>>> 21dff2f77a7d3ed0db9232a0ba730ee34e01f714
    brand = models.CharField(max_length=255)
    serial_number = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    unit = models.CharField(max_length=255)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    #! project kısmında foreign key yerine manytomany field kullanılabilir. böylece tedarikçi ve tüketiciler tek bir projeye bağlı kalmaz
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    pass



class Suppliers(models.Model, DirtyFieldsMixin):
    tax_code = models.IntegerField()
    name = models.CharField(max_length=350)
    contact_name = models.CharField(max_length=255)
    contact_no = models.CharField(max_length=255)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    products = models.ManyToManyField(Products)
    pass

class Consumers(models.Model, DirtyFieldsMixin):
    tax_code = models.IntegerField()
    name = models.CharField(max_length=350)
    contact_name = models.CharField(max_length=255)
    contact_no = models.CharField(max_length=255)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    products = models.ManyToManyField(Products)
    pass


class ProductInflow(models.Model, DirtyFieldsMixin):
    date = models.DateField()
    product = models.ForeignKey(Products, on_delete=models.PROTECT)
    barcode = models.CharField(max_length=100)
    supplier_company = models.ForeignKey(Suppliers, on_delete=models.PROTECT, related_name='supplier_inflows')
    receiver_company = models.ForeignKey(Suppliers, on_delete=models.PROTECT, related_name='receiver_inflows')
    status = models.CharField(max_length=255)
    place_of_use = models.CharField(max_length=255)
    amount = models.FloatField(null= True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

class ProductOutflow(models.Model, DirtyFieldsMixin):
    date = models.DateField()
    product = models.ForeignKey(Products, on_delete=models.PROTECT)
    barcode = models.CharField(max_length=100)
    supplier_company = models.ForeignKey(Consumers, on_delete=models.PROTECT, related_name='supplier_outflows')
    receiver_company = models.ForeignKey(Consumers, on_delete=models.PROTECT, related_name='receiver_outflows')
    status = models.CharField(max_length=255)
    place_of_use = models.CharField(max_length=255)
    amount = models.FloatField(null= True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)


class Stock(models.Model):
    product = models.ForeignKey(Products, on_delete=models.PROTECT)
    warehouse = models.CharField(max_length=255, null=True)
    inflow = models.FloatField(null=True)
    outflow = models.FloatField(null=True)
    stock = models.FloatField(null=True)
    reserve_stock = models.FloatField(null=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)


class Accounting(models.Model, DirtyFieldsMixin):
    product_inflow = models.ForeignKey(ProductInflow, on_delete=models.CASCADE)
    unit_price = models.FloatField(null= True)
    discount_rate = models.FloatField(null= True)
    discount_amount = models.FloatField(null= True)
    tax_rate = models.FloatField(null= True)
    tevkifat_rate = models.FloatField(null= True)
    price_without_tax = models.FloatField(null= True)
    unit_price_without_tax = models.FloatField(null= True)
    price_with_tevkifat = models.FloatField(null= True)
    price_total = models.FloatField(null= True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)


    def save(self, *args, **kwargs):
        self.unit_price = float(self.unit_price)
        self.discount_rate = float(self.discount_rate)
        self.discount_amount = float(self.discount_amount)
        self.tax_rate = float(self.tax_rate)
        self.tevkifat_rate = float(self.tevkifat_rate)
        self.price_without_tax = float(self.price_without_tax)
        self.price_with_tevkifat = float(self.price_with_tevkifat)
        self.price_total = float(self.price_total)
        self.product_inflow.amount = float(self.product_inflow.amount)
        if self.discount_rate and float(self.discount_rate) != 0:
            discount = self.discount_rate * self.unit_price * self.product_inflow.amount
        else:
            discount = 0
        if self.discount_amount and self.discount_amount != 0:
            discount = self.discount_amount
        tax = (self.tax_rate/100) * (self.unit_price * self.product_inflow.amount - discount)
        tax_tevkifat = ((self.tax_rate)-((self.tevkifat_rate/100)*self.tax_rate))/100 * (self.unit_price * self.product_inflow.amount - discount)
        
        self.unit_price_without_tax = self.price_without_tax / self.product_inflow.amount
        self.price_without_tax = (self.unit_price * self.product_inflow.amount) - discount
        self.price_with_tevkifat = (self.unit_price * self.product_inflow.amount) - discount + tax_tevkifat
        self.price_total = (self.unit_price * self.product_inflow.amount) - discount + tax
        super().save(*args, **kwargs)



# class Customers(models.Model):
#     customer_code = models.IntegerField(unique= True)
#     description = models.CharField(max_length=200)
#     quantity = models.IntegerField(null= True)
#     area_code = models.CharField(max_length=100)
#     code = models.CharField(max_length=100)
#     city = models.CharField(max_length=100)
#     area = models.CharField(max_length=100)
#     def __str__(self):
#         return self.customer_code

# class Sales(DirtyFieldsMixin, models.Model):
#     no = models.PositiveIntegerField(unique=True, db_index= True)
#     bill_number = models.PositiveIntegerField(null=True, blank=True)
#     date = jmodels.jDateField()
#     psr = models.CharField(max_length=1)
#     customer_code = models.PositiveIntegerField(null=True, blank=True)
#     name = models.CharField(max_length=50)
#     city = models.CharField(max_length=50)
#     area = models.CharField(max_length=50)
#     color_making_saler = models.CharField(max_length=50)
#     group = models.CharField(max_length=50)
#     product_code = models.PositiveIntegerField(null=True, blank=True)
#     product_name = models.CharField(max_length=100)
#     unit = models.CharField(max_length=30)
#     unit2 = models.CharField(max_length=30)
#     kg = models.FloatField(null=True, blank=True)
#     original_value = models.FloatField(null=True, blank=True)
#     original_output_value = models.FloatField(null=True, blank=True)
#     secondary_output_value = models.FloatField(null=True, blank=True)
#     price = models.FloatField(null=True, blank=True)
#     original_price = models.FloatField(null=True, blank=True)
#     discount_percentage = models.FloatField(null=True, blank=True)
#     amount_sale = models.FloatField(null=True, blank=True)
#     discount = models.FloatField(null=True, blank=True)
#     additional_sales = models.FloatField(null=True, blank=True)
#     net_sales = models.FloatField(null=True, blank=True)
#     discount_percentage_2 = models.FloatField(null=True, blank=True)
#     real_discount_percentage = models.FloatField(null=True, blank=True)
#     payment_cash = models.FloatField(null=True, blank=True)
#     payment_check = models.FloatField(null=True, blank=True)
#     balance = models.FloatField(null=True, blank=True)
#     saler = models.CharField(max_length=100)
#     currency_sepidar = models.FloatField(null=True, blank=True)
#     dollar_sepidar = models.FloatField(null=True, blank=True)
#     currency = models.FloatField(null=True, blank=True)
#     dollar = models.FloatField(null=True, blank=True)
#     manager_rating = models.FloatField(null=True, blank=True)
#     senior_saler = models.FloatField(null=True, blank=True)
#     tot_monthly_sales = models.FloatField(null=True, blank=True)
#     receipment = models.FloatField(null=True, blank=True)
#     ct = models.FloatField(null=True, blank=True)
#     payment_type = models.CharField(max_length=50)
#     customer_size = models.FloatField(null=True, blank=True)
#     saler_factor = models.FloatField(null=True, blank=True)
#     prim_percentage = models.FloatField(null=True, blank=True)
#     bonus_factor = models.FloatField(null=True, blank=True)
#     bonus = models.FloatField(null=True, blank=True)
#     def __str__(self):
#         return self.no

# class Warehouse(models.Model):
#     product_code = models.IntegerField(unique=True)
#     title = models.CharField(max_length=200)
#     unit = models.CharField(max_length=50)
#     stock = models.FloatField(null=True, blank=True)

# class Products(models.Model):
#     group = models.CharField(max_length=255)
#     subgroup = models.CharField(max_length=255)
#     feature = models.CharField(max_length=255)
#     product_code_ir = models.IntegerField(unique= True)
#     product_code_tr = models.CharField(max_length=255)
#     description_tr = models.CharField(max_length=400)
#     description_ir = models.CharField(max_length=400)
#     unit = models.CharField(max_length=255)
#     unit_secondary = models.CharField(max_length=255)
#     weight = models.FloatField(null= True)
#     currency = models.CharField(max_length=255)
#     price = models.FloatField(null= True)

# class ROP(models.Model):
#     group = models.CharField(max_length=100)
#     subgroup = models.CharField(max_length=100)
#     feature = models.CharField(max_length=100)
#     new_or_old_product = models.CharField(max_length=100, null=True, blank=True)
#     related = models.CharField(max_length=100, null=True, blank=True)
#     origin = models.CharField(max_length=100, null=True, blank=True)
#     product_code_ir = models.CharField(max_length=100)
#     product_code_tr = models.CharField(max_length=100)
#     dont_order_again = models.IntegerField(default=0, null=True, blank= True)
#     description_tr = models.CharField(max_length=100, null=True, blank=True)
#     description_ir = models.CharField(max_length=100, null=True, blank=True)
#     unit = models.CharField(max_length=100)
#     weight = models.CharField(max_length=100, null=True, blank=True)
#     unit_secondary = models.CharField(max_length=100, null=True, blank=True)
#     price = models.FloatField(null=True, blank=True)
#     avarage_previous_year = models.FloatField(null=True, blank=True)
#     month_1 = models.FloatField(null=True, blank=True)
#     month_2 = models.FloatField(null=True, blank=True)
#     month_3 = models.FloatField(null=True, blank=True)
#     month_4 = models.FloatField(null=True, blank=True)
#     month_5 = models.FloatField(null=True, blank=True)
#     month_6 = models.FloatField(null=True, blank=True)
#     month_7 = models.FloatField(null=True, blank=True)
#     month_8 = models.FloatField(null=True, blank=True)
#     month_9 = models.FloatField(null=True, blank=True)
#     month_10 = models.FloatField(null=True, blank=True)
#     month_11 = models.FloatField(null=True, blank=True)
#     month_12 = models.FloatField(null=True, blank=True)
#     total_sale = models.FloatField(null=True, blank=True)
#     warehouse = models.FloatField(null=True, blank=True)
#     goods_on_the_road = models.FloatField(null=True, blank=True)
#     total_stock_all = models.FloatField(null=True, blank=True)
#     total_month_stock = models.FloatField(null=True, blank=True)
#     standart_deviation = models.FloatField(null=True, blank=True)
#     lead_time = models.FloatField(null=True, blank=True)
#     product_coverage_percentage = models.FloatField(null=True, blank=True)
#     demand_status = models.FloatField(null=True, blank=True)
#     safety_stock = models.FloatField(null=True, blank=True)
#     rop = models.FloatField(null=True, blank=True)
#     monthly_mean = models.FloatField(null=True, blank=True)
#     new_party = models.FloatField(null=True, blank=True)
#     cycle_service_level = models.FloatField(null=True, blank=True)
#     total_stock = models.FloatField(null=True, blank=True)
#     need_prodcuts = models.FloatField(null=True, blank=True)
#     over_stock = models.FloatField(null=True, blank=True)
#     calculated_need = models.FloatField(null=True, blank=True)
#     calculated_max_stock = models.FloatField(null=True, blank=True)
#     calculated_min_stock = models.FloatField(null=True, blank=True)

#     def __str__(self):
#         return self.product_code_ir

# class Salers(models.Model):
#     #saler_code = models.IntegerField(unique= True)
#     objects = jmodels.jManager()
#     name = models.CharField(max_length=200)
#     job_start_date = jmodels.jDateField()
#     manager_performance_rating = models.FloatField(null=True)
#     experience_rating = models.FloatField(null=True)
#     monthly_total_sales_rating = models.FloatField(null=True)
#     receipment_rating = models.FloatField(null=True)
#     is_active = models.BooleanField(default=True)
#     is_deleted = models.BooleanField(default=False)
#     is_active_saler = models.BooleanField()
#     is_passive_saler = models.BooleanField()


# class SalerPerformance(models.Model):
#     name = models.CharField(max_length=100)
#     year = models.IntegerField(null=True)
#     month = models.IntegerField(null=True)
#     day = models.IntegerField(null=True)
#     sale = models.FloatField(default=0, null=True)
#     bonus = models.FloatField(default=0, null=True)
    

# class SaleSummary(models.Model):
#     objects = jmodels.jManager()
#     date = jmodels.jDateField()
#     year = models.IntegerField(null=True)
#     month = models.IntegerField(null=True)
#     day = models.IntegerField(null=True)
#     sale = models.FloatField(default=0, null=True)
#     dollar_sepidar_sale = models.FloatField(default=0, null=True)
#     dollar_sale = models.FloatField(default=0, null=True)
#     kg_sale = models.FloatField(default=0, null=True)

# class SalerMonthlySaleRating(models.Model):
#     objects = jmodels.jManager()
#     year = models.IntegerField(null=True)
#     month = models.IntegerField(null=True)
#     day = models.IntegerField(null=True)
#     name = models.CharField(max_length=100)
#     sale_rating = models.FloatField(default=1, null=True)

# class SalerReceipeRating(models.Model):
#     objects = jmodels.jManager()
#     date = jmodels.jDateField()
#     sale_rating = models.FloatField(default=1, null=True)

# class MonthlyProductSales(models.Model):
#     objects = jmodels.jManager()
#     product_name = models.CharField(max_length=100)
#     product_code = models.IntegerField(null=True)
#     date = jmodels.jDateField(null=True)
#     year = models.IntegerField(null=True)
#     month = models.IntegerField(null=True)
#     piece = models.FloatField(null=True, default=0)
#     sale = models.FloatField(default=0, null=True)

# class CustomerPerformance(models.Model):
#     objects = jmodels.jManager()
#     customer_code = models.IntegerField()
#     customer_name = models.CharField(max_length=100)
#     customer_area = models.CharField(max_length=100)
#     year = models.IntegerField(null=True)
#     month = models.IntegerField(null=True)
#     sale = models.FloatField(default=0, null=True)
#     sale_amount = models.FloatField(default=0, null=True)
#     dollar = models.FloatField(default=0, null=True)
#     dollar_sepidar = models.FloatField(default=0, null=True)

# class ProductPerformance(models.Model):
#     objects = jmodels.jManager()
#     product_code = models.IntegerField(null=True)
#     product_name = models.CharField(max_length=100)
#     year = models.IntegerField(null=True)
#     month = models.IntegerField(null=True)
#     sale = models.FloatField(default=0, null=True)
#     sale_amount = models.FloatField(default=0, null=True)

# class OrderList(models.Model):
#     objects = jmodels.jManager()
#     current_date = jmodels.jDateField(null=True)
#     order_flag_avrg = models.BooleanField()
#     order_flag_exp = models.BooleanField()
#     order_flag_holt = models.BooleanField()
#     order_avrg = models.FloatField(default=0, null=True)
#     order_exp = models.FloatField(default=0, null=True)
#     order_holt = models.FloatField(default=0, null=True)
#     current_stock = models.FloatField(default=0, null=True)
#     decided_order = models.FloatField(default=0, null=True)
#     weight = models.FloatField(default=0, null=True)
#     average_sale = models.FloatField(default=0, null=True)
#     product_code = models.IntegerField(null=True)
#     is_active = models.BooleanField()
#     is_ordered = models.BooleanField()

# class GoodsOnRoad(models.Model):
#     product_code = models.IntegerField(null=True)
#     product_name_tr = models.CharField(max_length=100)
#     product_name_ir = models.CharField(max_length=100)
#     decided_order = models.FloatField(default=0, null=True)
#     weight = models.FloatField(default=0, null=True)
#     truck_name = models.CharField(max_length=100)
#     is_ordered = models.BooleanField(default= False)
#     is_terminated = models.BooleanField(default= False)
#     is_on_truck = models.BooleanField(default= False)
#     is_on_road = models.BooleanField(default= False)
#     is_arrived = models.BooleanField(default= False)

# class Trucks(models.Model):
#     objects = jmodels.jManager()
#     truck_name = models.CharField(max_length=100)
#     estimated_order_date = jmodels.jDateField(null=True)
#     estimated_arrival_date = jmodels.jDateField(null=True)
#     is_arrived = models.BooleanField(default=False)
#     is_ordered = models.BooleanField(default=False)
#     is_waiting = models.BooleanField()

# class NotificationsOrderList(models.Model):
#     objects = jmodels.jManager()
#     current_date = jmodels.jDateField(null=True)
#     product_code = models.IntegerField(null=True)
#     is_active = models.BooleanField()
#     order_avrg = models.FloatField(default=0, null=True)
#     order_exp = models.FloatField(default=0, null=True)
#     order_holt = models.FloatField(default=0, null=True)






