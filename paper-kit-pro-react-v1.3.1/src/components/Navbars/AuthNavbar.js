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
  
  return (
    <Navbar
      className={classnames("navbar-absolute fixed-top", color)}
      expand="lg"
    >
      <Container>
        <div className="navbar-wrapper">
          <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}
          style={{ color: 'white',
          fontWeight: 'bold',
          fontSize: '2.2rem', // Adjust the size as desired
         
          paddingBottom: '5px'  }}>
            KOZTECH STOCK
          </NavbarBrand>
        </div>
        <button
          aria-controls="navigation-index"
          aria-expanded={false}
          aria-label="Toggle navigation"
          className="navbar-toggler"
          data-toggle="collapse"
          type="button"
          onClick={toggleCollapse}
        >
         
        </button>
        <Collapse isOpen={collapseOpen} className="justify-content-end" navbar>
          {showNavbarItems && (
            <Nav navbar>
              {/* Remove the navbarRoutes rendering */}
            </Nav>
          )}
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default AuthNavbar;
