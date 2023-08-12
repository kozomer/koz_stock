"""koz_stock URL Configuration

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
from koz_stock_api.views import (LoginView, LogoutView, ProductsView, EditProductsView, AddProductsView,
                                    DeleteProductsView, AddProductInflowView, ProductInflowView, EditProductInflowView, DeleteProductInflowView,
                                    StockView,  AddProductOutflowView, ProductOutflowView, EditProductOutflowView, DeleteProductOutflowView,
                                    AccountingView, EditAccountingView, CollapsedUserView, UserCardView, DeleteUserView,  EditUserView,
                                    SetCurrentProjectView, GetProjectsView, CreateProjectView,
                                    CreateUserView, ConsumerSearchView, SupplierSearchView, CreateProductGroupView, ProductGroupsView, EditProductGroupView, DeleteProductGroupView,
                                    CreateProductSubgroupView, ProductSubgroupsView, EditProductSubgroupView, DeleteProductSubgroupView, CreateProductOutflowReceiptView,
                                    AddConsumersView, ConsumersView, EditConsumersView, DeleteConsumerView, AddSuppliersView, SuppliersView, EditSuppliersView, DeleteSupplierView, SupplierConsumerProductSearchView,
                                    AddQTOView, BuildingsForProjectView, ElevationsForBuildingView, SectionsForElevationView, PlacesForSectionView  )
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
    
)
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('api/admin/', admin.site.urls),
    
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),

    path('api/projects/', GetProjectsView.as_view(), name='get-projects'),
    path('api/set_current_project/', SetCurrentProjectView.as_view(), name='set-current-project'),
    path('api/create_project/', CreateProjectView.as_view(), name='create_project'),

    path('api/create_user/', CreateUserView.as_view(), name='create-user'),
    path('api/collapsed_users/',CollapsedUserView.as_view(), name='collapsed-users'),
    path('api/user_detail/',UserCardView.as_view(), name='user-card'),
    path('api/delete_user/',DeleteUserView.as_view(), name='delete-user'),
    path('api/edit_user/',EditUserView.as_view(), name='edit-user'),
    
    path('api/products/', ProductsView.as_view(), name='products'),
    path('api/edit_products/', EditProductsView.as_view(), name='edit_product'),
    path('api/add_products/',AddProductsView.as_view(), name='add_pricelists'),
    path('api/delete_products/', DeleteProductsView.as_view(), name='delete_goods'),

    path('api/product_inflow/', ProductInflowView.as_view(), name='product_inflow'),
    path('api/edit_product_inflow/', EditProductInflowView.as_view(), name='edit_product_inflow'),
    path('api/add_product_inflow/',AddProductInflowView.as_view(), name='add_product_inflow'),
    path('api/delete_product_inflow/', DeleteProductInflowView.as_view(), name='delete_product_inflow'),

    path('api/product_outflow/', ProductOutflowView.as_view(), name='product_outflow'),
    path('api/edit_product_outflow/', EditProductOutflowView.as_view(), name='edit_product_outflow'),
    path('api/add_product_outflow/',AddProductOutflowView.as_view(), name='add_product_outflow'),
    path('api/delete_product_outflow/', DeleteProductOutflowView.as_view(), name='delete_product_outflow'),
    path('api/create_product_outflow_receipt_pdf/', CreateProductOutflowReceiptView.as_view(), name='create_product_outflow_receipt_pdf'),

    path('api/warehouse/', StockView.as_view(), name='view_warehouse'),
    # path('api/edit_warehouse/', EditStockView.as_view(), name='edit_warehouse'),
    # path('api/delete_warehouse/', DeleteStockView.as_view(), name='delete_warehouse'),

    path('api/accounting/', AccountingView.as_view(), name='accounting'),
    path('api/edit_accounting/', EditAccountingView.as_view(), name='edit_accounting'),
    # path('api/delete_accounting/', DeleteAccountingView.as_view(), name='delete_accounting'),

    path('api/consumer_search/', ConsumerSearchView.as_view(), name='consumer_search'),
    path('api/supplier_search/', SupplierSearchView.as_view(), name='supplier_search'),

    path('api/create_product_group/', CreateProductGroupView.as_view(), name='create_product_group'),
    path('api/product_groups/', ProductGroupsView.as_view(), name='product_groups'),
    path('api/edit_product_group/', EditProductGroupView.as_view(), name='edit_product_group'),
    path('api/delete_product_group/', DeleteProductGroupView.as_view(), name='delete_product_group'),
    
    path('api/create_product_subgroup/', CreateProductSubgroupView.as_view(), name='create_product_subgroup'),
    path('api/product_subgroups/', ProductSubgroupsView.as_view(), name='product_subgroups'),
    path('api/edit_product_subgroup/', EditProductSubgroupView.as_view(), name='edit_product_subgroup'),
    path('api/delete_product_subgroup/', DeleteProductSubgroupView.as_view(), name='delete_product_subgroup'),

    path('api/add_consumer/', AddConsumersView.as_view(), name='add_consumer'),
    path('api/consumers/', ConsumersView.as_view(), name='consumers'),
    path('api/edit_consumer/', EditConsumersView.as_view(), name='edit_consumer'),
    path('api/delete_consumer/', DeleteConsumerView.as_view(), name='delete_consumer'),
    
    path('api/add_supplier/', AddSuppliersView.as_view(), name='add_supplier'),
    path('api/suppliers/', SuppliersView.as_view(), name='suppliers'),
    path('api/edit_supplier/', EditSuppliersView.as_view(), name='edit_supplier'),
    path('api/delete_supplier/', DeleteSupplierView.as_view(), name='delete_supplier'),
    
    path('api/search_supplier_consumer_product/', SupplierConsumerProductSearchView.as_view(), name='search_supplier_consumer_product'),

    path('api/add_qto/', AddQTOView.as_view(), name='add_qto'),
    path('api/buildings_for_project/', BuildingsForProjectView.as_view(), name='buildings_for_project'),
    path('api/floors_for_building/', ElevationsForBuildingView.as_view(), name='floors_for_building'),
    path('api/sections_for_floor/', SectionsForElevationView.as_view(), name='sections_for_floor'),
    path('api/places_for_section/', PlacesForSectionView.as_view(), name='places_for_section'),




    # path('api/add_customers/', AddCustomersView.as_view(), name='add_customers'),
    # path('api/add_warehouse/', AddWarehouseView.as_view(), name='add_warehouse'),
    # path('api/add_sales/', AddSalesView.as_view(), name='add_sales'),
    # path('api/add_products/',AddProductsView.as_view(), name='add_pricelists'),
    # path('api/add_salers/',AddSalerView.as_view(), name='add_salers'),
    # path('api/add_truck/', AddTruckView.as_view(), name='add_truck'),

    # path('api/customers/', ViewCustomersView.as_view(), name='view_customers'),
    # path('api/sales/', ViewSalesView.as_view(), name='view_sales'),
    # path('api/warehouse/', ViewWarehouseView.as_view(), name='view_warehouse'),
    # path('api/charts/', ChartView.as_view(), name='view_charts'),
    # path('api/products/', ViewProductsView.as_view(), name='view_pricelists'),
    # path('api/salers_card/', SalerCardView.as_view(), name='view_saler_card'),
    # path('api/salers_table/', SalerTableView.as_view(), name='view_saler_table'),
    # path('api/collapsed_salers/', CollapsedSalerView.as_view(), name='view_saler_collapsed'),
    # path('api/rop/', ROPView.as_view(), name='view_rop'),
    # path('api/order_list/', OrderListView.as_view(), name='order_list'),
    # path('api/goods_on_road/', GoodsOnRoadView.as_view(), name='goods_on_road'),
    # path('api/waiting_trucks/',WaitingTrucksView.as_view(), name='waiting_trucks'),
    # path('api/approve_waiting/',ApproveWaitingTruckView.as_view(), name='approve_waiting'),
    # path('api/trucks_on_road/',TrucksOnRoadView.as_view(), name='trucks_on_road'),
    # path('api/approve_products/',ApproveProductsToOrderView.as_view(), name='approve_products'),
    # path('api/approve_arrived_truck/',ApproveArrivedTruckView.as_view(), name='approve_arrived_truck'),
    # path('api/notifications/', NotificationsView.as_view(), name='notifications'),
    # path('api/saler_performance/', SalerPerformanceView.as_view(), name='saler_performance'),


    # path('api/delete_sales/',  DeleteSaleView.as_view(), name='delete_sales'),
    # path('api/delete_customers/',  DeleteCustomerView.as_view(), name='delete_customers'),
    # path('api/delete_products/', DeleteProductView.as_view(), name='delete_goods'),
    # path('api/delete_saler/', DeleteSalerView.as_view(), name='delete_saler'),
    # path('api/delete_warehouse/', DeleteWarehouseView.as_view(), name='delete_warehouse'),
    # path('api/delete_notification/', DeleteNotificationView.as_view(), name='delete_notification'),
    
    # path('api/item_list/',  ItemListView.as_view(), name='item_list'),
    # path('api/item_list_filter/', ItemListView.as_view(), name='item_list_filter'),
    # path('api/sales_report/', SalesReportView.as_view(), name='sales_report'),

    # path('api/edit_products/', EditProductView.as_view(), name='edit_product'),
    # path('api/edit_customers/', EditCustomerView.as_view(), name='edit_customer'),
    # path('api/edit_sales/', EditSaleView.as_view(), name='edit_sale'),
    # path('api/edit_warehouse/', EditWarehouseView.as_view(), name='edit_warehouse'),
    # path('api/edit_salers/', EditSalerView.as_view(), name='edit_saler'),
    # path('api/edit_order_list/', EditOrderListView.as_view(), name='edit_order_list'),
    # path('api/edit_goods_on_road/',  EditGoodsOnRoadView.as_view(), name='edit_goods_on_road'),

    # path('api/top_customers/', TopCustomersView.as_view(), name= 'top_customers'),
    # path('api/top_products/', TopProductsView.as_view(), name= 'top_products'),
    # path('api/customer_area/', CustomerAreaPieChartView.as_view(), name='customer_area'),

    # path('api/exchange_rate/', ExchangeRateAPIView.as_view(), name='exchange_rate'),
    # path('api/daily_report/saler_data/', SalerDataView.as_view(), name='saler_data'),
    # path('api/daily_report/total_data/', TotalDataView.as_view(), name='total_data'),
    # path('api/daily_report/total_data_by_monthly/', TotalDataByMonthlyView.as_view(), name='total_data_by_monthly'),
    

    # path('api/export_customers/', ExportCustomersView.as_view(), name= 'export_customers'),
    # path('api/export_sales/', ExportSalesView.as_view(), name= 'export_sales'),
    # path('api/export_warehouse/', ExportWarehouseView.as_view(), name= 'export_warehouse'),
    # path('api/export_products/', ExportProductsView.as_view(), name= 'export_products'),



]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)