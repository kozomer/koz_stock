import React from "react";
import classnames from "classnames";
import { NavLink, useLocation } from "react-router-dom";

// reactstrap components
import {
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  Nav,
  Container
} from "reactstrap";

import routes from "routes.js";

function AuthNavbar(props) {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [color, setColor] = React.useState("navbar-transparent");
  
  const location = useLocation();
  
  // Determine whether to show the navbar items based on the current route
  const showNavbarItems = location.pathname !== "/auth/login";
  console.log(showNavbarItems)

  // Toggle the navbar collapse
  const toggleCollapse = () => {
    if (!collapseOpen) {
      setColor("bg-white");
    } else {
      setColor("navbar-transparent");
    }
    setCollapseOpen(!collapseOpen);
  };
  
 
}

export default AuthNavbar;
