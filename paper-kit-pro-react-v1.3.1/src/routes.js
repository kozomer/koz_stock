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
import Notifications from "views/components/Notifications.js";
import Panels from "views/components/Panels.js";
import ReactTables from "views/tables/ReactTables.js";
import CustomerTables from "views/tables/Customers.js";
import Bonus from "views/tables/Bonus.js";
import Sales from "views/tables/Sales.js";
import Warehouse from "views/tables/Warehouse.js";
import Products from "views/tables/Products.js";
import SalesReport from "views/tables/SalesReport";
import ReorderPoints from "views/tables/ReorderPoints.js";
import Orderlist from "views/tables/OrderList";
import GoodsOnRoad from "views/tables/GoodsOnRoad";
import StaffPerformance from "views/tables/StaffPerfomance";

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
    path: "/products-tables",
    name: "Malzemeler",
    icon:"nc-icon nc-tag-content",
    component: Products,
    layout: "/admin"
  },
 
  {
    path: "/sales-tables",
    name: "Ambar Giriş/Çıkış",
    icon:"nc-icon nc-cart-simple",
    component: Sales,
    layout: "/admin"
  },
  {
    path: "/customer-tables",
    name: "Ambar Muhasebe",
    icon:"nc-icon nc-briefcase-24",
    component: CustomerTables,
    layout: "/admin"
  },
  {
    path: "/warehouse-tables",
    name: "Ambar",
    icon:"nc-icon nc-box",
    component: Warehouse,
    layout: "/admin"
  },
  
  {
    path: "/bonus-tables",
    name: "Staff",
    icon:"nc-icon nc-badge",
    component:Bonus,
    layout: "/admin"
  },
  
  {
    path: "/saler-performance",
    name: "Staff Performance",
    icon:"nc-icon nc-user-run",
    component: StaffPerformance,
    layout: "/admin"
  },
 
  
  {
    path: "/sales-report",
    name: "Sales Report",
    icon:"nc-icon nc-single-copy-04",
    component: SalesReport,
    layout: "/admin"
  },
  {
    path: "/rop",
    name: "Reorder Points",
    icon:"nc-icon nc-bullet-list-67",
    component: ReorderPoints,
    layout: "/admin"
  },
  {
    path: "/orderlist",
    name: "Orderlist",
    icon:"nc-icon nc-bookmark-2",
    component: Orderlist,
    layout: "/admin"
  },
  {
    path: "/goods-road",
    name: "Goods On Road",
    icon: "nc-icon nc-bus-front-12",
    component: GoodsOnRoad,
    layout: "/admin",
    navbar: false  // Add this field to indicate that the Login link should not be displayed in the navbar
  },
  {
    path: "/login",
    name: "Login",
    icon: "nc-icon nc-bus-front-12",
    component: Login,
    layout: "/auth",
    navbar: false  // Add this field to indicate that the Login link should not be displayed in the navbar
  },
  
];

export default routes;
