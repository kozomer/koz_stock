"""stockfish_last URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('api/', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('api/', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('api/blog/', include('api/blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from stockfish_api.views import ( AddCustomersView, AddSalesView, AddProductsView, AddWarehouseView, AddSalerView, SalerPerformanceView,
                                 ViewSalesView,  ViewWarehouseView, ViewProductsView, ChartView, ItemListView, ViewCustomersView, CollapsedSalerView, SalerCardView, SalerTableView, SalesReportView, ROPView, OrderListView,
                                 DeleteSaleView, DeleteCustomerView, DeleteProductView, DeleteSalerView, DeleteWarehouseView,
                                 EditProductView, EditCustomerView, EditSaleView, EditWarehouseView,  EditSalerView, EditOrderListView,  EditGoodsOnRoadView,
                                 LoginView, LogoutView,
                                 TopCustomersView, TopProductsView,
                                 ExchangeRateAPIView, SalerDataView, TotalDataView, TotalDataByMonthlyView, CustomerAreaPieChartView, 
                                 ExportCustomersView, ExportSalesView, ExportWarehouseView, ExportProductsView,
                                 GoodsOnRoadView, AddTruckView, WaitingTrucksView, TrucksOnRoadView, ApproveWaitingTruckView,
                                 ApproveProductsToOrderView, ApproveArrivedTruckView, NotificationsView, DeleteNotificationView
                                 )
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
    
)


urlpatterns = [
    path('api/admin/', admin.site.urls),
    
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),

    path('api/add_customers/', AddCustomersView.as_view(), name='add_customers'),
    path('api/add_warehouse/', AddWarehouseView.as_view(), name='add_warehouse'),
    path('api/add_sales/', AddSalesView.as_view(), name='add_sales'),
    path('api/add_products/',AddProductsView.as_view(), name='add_pricelists'),
    path('api/add_salers/',AddSalerView.as_view(), name='add_salers'),
    path('api/add_truck/', AddTruckView.as_view(), name='add_truck'),

    path('api/customers/', ViewCustomersView.as_view(), name='view_customers'),
    path('api/sales/', ViewSalesView.as_view(), name='view_sales'),
    path('api/warehouse/', ViewWarehouseView.as_view(), name='view_warehouse'),
    path('api/charts/', ChartView.as_view(), name='view_charts'),
    path('api/products/', ViewProductsView.as_view(), name='view_pricelists'),
    path('api/salers_card/', SalerCardView.as_view(), name='view_saler_card'),
    path('api/salers_table/', SalerTableView.as_view(), name='view_saler_table'),
    path('api/collapsed_salers/', CollapsedSalerView.as_view(), name='view_saler_collapsed'),
    path('api/rop/', ROPView.as_view(), name='view_rop'),
    path('api/order_list/', OrderListView.as_view(), name='order_list'),
    path('api/goods_on_road/', GoodsOnRoadView.as_view(), name='goods_on_road'),
    path('api/waiting_trucks/',WaitingTrucksView.as_view(), name='waiting_trucks'),
    path('api/approve_waiting/',ApproveWaitingTruckView.as_view(), name='approve_waiting'),
    path('api/trucks_on_road/',TrucksOnRoadView.as_view(), name='trucks_on_road'),
    path('api/approve_products/',ApproveProductsToOrderView.as_view(), name='approve_products'),
    path('api/approve_arrived_truck/',ApproveArrivedTruckView.as_view(), name='approve_arrived_truck'),
    path('api/notifications/', NotificationsView.as_view(), name='notifications'),
    path('api/saler_performance/', SalerPerformanceView.as_view(), name='saler_performance'),


    path('api/delete_sales/',  DeleteSaleView.as_view(), name='delete_sales'),
    path('api/delete_customers/',  DeleteCustomerView.as_view(), name='delete_customers'),
    path('api/delete_products/', DeleteProductView.as_view(), name='delete_goods'),
    path('api/delete_saler/', DeleteSalerView.as_view(), name='delete_saler'),
    path('api/delete_warehouse/', DeleteWarehouseView.as_view(), name='delete_warehouse'),
    path('api/delete_notification/', DeleteNotificationView.as_view(), name='delete_notification'),
    
    path('api/item_list/',  ItemListView.as_view(), name='item_list'),
    path('api/item_list_filter/', ItemListView.as_view(), name='item_list_filter'),
    path('api/sales_report/', SalesReportView.as_view(), name='sales_report'),

    path('api/edit_products/', EditProductView.as_view(), name='edit_product'),
    path('api/edit_customers/', EditCustomerView.as_view(), name='edit_customer'),
    path('api/edit_sales/', EditSaleView.as_view(), name='edit_sale'),
    path('api/edit_warehouse/', EditWarehouseView.as_view(), name='edit_warehouse'),
    path('api/edit_salers/', EditSalerView.as_view(), name='edit_saler'),
    path('api/edit_order_list/', EditOrderListView.as_view(), name='edit_order_list'),
    path('api/edit_goods_on_road/',  EditGoodsOnRoadView.as_view(), name='edit_goods_on_road'),

    path('api/top_customers/', TopCustomersView.as_view(), name= 'top_customers'),
    path('api/top_products/', TopProductsView.as_view(), name= 'top_products'),
    path('api/customer_area/', CustomerAreaPieChartView.as_view(), name='customer_area'),

    path('api/exchange_rate/', ExchangeRateAPIView.as_view(), name='exchange_rate'),
    path('api/daily_report/saler_data/', SalerDataView.as_view(), name='saler_data'),
    path('api/daily_report/total_data/', TotalDataView.as_view(), name='total_data'),
    path('api/daily_report/total_data_by_monthly/', TotalDataByMonthlyView.as_view(), name='total_data_by_monthly'),
    

    path('api/export_customers/', ExportCustomersView.as_view(), name= 'export_customers'),
    path('api/export_sales/', ExportSalesView.as_view(), name= 'export_sales'),
    path('api/export_warehouse/', ExportWarehouseView.as_view(), name= 'export_warehouse'),
    path('api/export_products/', ExportProductsView.as_view(), name= 'export_products'),



]
