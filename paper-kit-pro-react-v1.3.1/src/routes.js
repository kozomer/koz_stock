/*!

=========================================================
* Paper Dashboard PRO React - v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Buttons from "views/components/Buttons.js";
import Calendar from "views/Calendar.js";
import Charts from "views/Charts.js";
import Dashboard from "views/Dashboard.js";
import ExtendedForms from "views/forms/ExtendedForms.js";
import ExtendedTables from "views/tables/ExtendedTables.js";
import FullScreenMap from "views/maps/FullScreenMap.js";
import GoogleMaps from "views/maps/GoogleMaps.js";
import GridSystem from "views/components/GridSystem.js";
import Icons from "views/components/Icons.js";
import LockScreen from "views/pages/LockScreen.js";
import Login from "views/pages/Login.js";
import Select from "views/pages/SelectProject";
import Notifications from "views/components/Notifications.js";
import Panels from "views/components/Panels.js";
import ReactTables from "views/tables/ReactTables.js";

import Bonus from "views/tables/Bonus.js";
import ProductInFlow from "views/tables/ProductInFlow";
import ProductOutFlow from "views/tables/ProductOutFlow";

import Warehouse from "views/tables/Warehouse.js";
import Products from "views/tables/Products.js";
import SalesReport from "views/tables/SalesReport";
import ReorderPoints from "views/tables/ReorderPoints.js";
import Orderlist from "views/tables/OrderList";
import GoodsOnRoad from "views/tables/GoodsOnRoad";
import StaffPerformance from "views/tables/StaffPerfomance";
import Suppliers from "views/tables/Suppliers";
import StockAccount from "views/tables/StockAccount";
import Consumers from "views/tables/Consumers";
import User from "views/tables/User";
import Search from "views/tables/Seach";
import QTO from "views/tables/QuantityTakeOff";

import CreateGroups from "views/tables/CreateGroups";
import Register from "views/pages/Register.js";
import RegularForms from "views/forms/RegularForms.js";
import RegularTables from "views/tables/RegularTables.js";
import SweetAlert from "views/components/SweetAlert.js";
import Timeline from "views/pages/Timeline.js";
import Typography from "views/components/Typography.js";
import UserProfile from "views/pages/UserProfile.js";
import ValidationForms from "views/forms/ValidationForms.js";
import VectorMap from "views/maps/VectorMap.js";
import Widgets from "views/Widgets.js";
import Wizard from "views/forms/Wizard.js";
import '../src/assets/css/Table.css';
const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin"
  },
  

  {
    collapse: true,
    name: "Firmalar",
    icon: "nc-icon nc-bank", 
    state: "companiesCollapse",
    views: [ 
        {
            path: "/suppliers",
            name: "    Tedarikçiler",
            icon: "    nc-icon nc-delivery-fast",
            component: Suppliers,
            layout: "/admin"
        },
        {
            path: "/consumers",
            name: "    Tüketiciler",
            icon: "    nc-icon nc-single-02",
            component: Consumers,
            layout: "/admin"
        },
    ]
},

 
 
  {
    collapse: true,
    name: "Malzemeler",
    icon: "nc-icon nc-box",
    state: "ProductsCollapse",
    views: [{
      path: "/products-tables",
      name: "Malzemeler",
      icon:"nc-icon nc-tag-content",
      component: Products,
      layout: "/admin"
      
    },

    {
      path: "/create-groups",
      name: "Grup Oluşturma",
      icon: "nc-icon nc-simple-add",
      component: CreateGroups,
      layout: "/admin",
     
    },
    ]
  },


  
  {
    collapse: true,
    name: "Ambar Bilgisi",
    icon: "nc-icon nc-shop", // updated icon
    state: "WarehouseCollapse",
    views: [
      {
        path: "/product-in",
        name: "Ambar Giriş",
        icon:"nc-icon nc-send",// updated icon, signifies "entering"
        component: ProductInFlow,
        layout: "/admin"
      },
      {
        path: "/product-out",
        name: "Ambar Çıkış",
        icon:"nc-icon nc-box-2", // updated icon, signifies "exiting"
        component: ProductOutFlow,
        layout: "/admin"
      },
      {
        path: "/stock-account",
        name: "Ambar Muhasebe",
        icon:"nc-icon nc-money-coins",  // updated icon, signifies "accounting"
        component: StockAccount,
        layout: "/admin"
      },
      {
        path: "/warehouse-tables",
        name: "Ambar",
        icon:"nc-icon nc-delivery-fast", // updated icon, signifies "warehouse"
        component: Warehouse,
        layout: "/admin"
      },
    ]
},

  
 
 
 
 
  {
    path: "/login",
    name: "Login",
    icon: "nc-icon nc-bus-front-12",
    component: Login,
    layout: "/auth",
    navbar: false  // Add this field to indicate that the Login link should not be displayed in the navbar
  },




  {
    path: "/deneme",
    name: "Kullanıcı",
    icon: "nc-icon nc-circle-10",
    component: User,
    layout: "/admin",
   
  },

  {
    path: "/qto",
    name: "Metraj",
    icon: "nc-icon nc-ruler-pencil",
    component: QTO,
    layout: "/admin",
   
  },


  {
    path: "/searc",
    name: "Sorgulama",
    icon: "nc-icon nc-zoom-split",
    component: Search,
    layout: "/admin",
   
  },

  {
    path: "/select",
    name: "Proje Değiştir",
    icon: "nc-icon nc-settings",
    component: Select,
    layout: "/auth",
    navbar: false
   
  },
  
];

export default routes;
