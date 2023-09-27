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
import React, {useState, useEffect} from "react";
import classnames from "classnames";
import { useLocation } from "react-router-dom";
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

import {notifications} from '../../views/Dashboard';

import FixedPlugin from "../FixedPlugin/FixedPlugin";
import localforage from 'localforage';

function AdminNavbar(props) {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [color, setColor] = React.useState("navbar-transparent");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
   
  const [unreadCount, setUnreadCount] = useState(0);
  


  const [sidebarBgColor, setSidebarBgColor] = useState("black");
  const [sidebarActiveColor, setSidebarActiveColor] = useState("primary");
  const [sidebarMini, setSidebarMini] = useState(false);
  const [showFixedPlugin, setShowFixedPlugin] = useState(false);
  const [project, setProject] = useState(null);

  const handleBgClick = (color) => {
  setSidebarBgColor(color);
  };
  
  const handleActiveClick = (color) => {
  setSidebarActiveColor(color);
  };
  
  const handleMiniClick = (value) => {
  setSidebarMini(value);
  };

  const toggleFixedPlugin = () => {
    setShowFixedPlugin(!showFixedPlugin);
  };
  
  useEffect(() => {
    async function fetchProject() {
      try {
        const access_token = await localforage.getItem('access_token');
        
        const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/get_current_project/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(access_token)
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setProject(data);
        } else {
          console.error('Error fetching project', response.statusText);
          console.log('Bearer ' + String(access_token));
        }
      } catch (error) {
        console.error('Failed to fetch the project:', error.message);
      }
    }
    
    fetchProject();
  }, []);
  useEffect(() => {
    
      console.log(notifications)
      console.log(notifications.length)
      setUnreadCount(notifications.length);
 

   
  }, [notifications]);
  
 /* useEffect(() => {
    // Retrieve the notifications from localforage
    localforage.getItem('notifications').then((data) => {
      // If there are no notifications in localforage, set an empty array as the default value
      const savedNotifications = data ? JSON.parse(data) : [];
      console.log(savedNotifications)
      setNotifications(savedNotifications);
      
    });
  }, []);
 */
  const handleBellClick = () => {
    setDropdownOpen(!dropdownOpen);
    setModalOpen(true);
  };

  
  const location = useLocation();
  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
    
  });
  React.useEffect(() => {
    if (
      window.outerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
  }, [location]);
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && collapseOpen) {
      setColor("bg-white");
    } else {
      setColor("navbar-transparent");
    }
  };
  // this function opens and closes the sidebar on small devices
  const toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    setSidebarOpen(!sidebarOpen);
  };
  // this function opens and closes the collapse on small devices
  // it also adds navbar-transparent class to the navbar when closed
  // ad bg-white when opened
  const toggleCollapse = () => {
    if (!collapseOpen) {
      setColor("bg-white");
    } else {
      setColor("navbar-transparent");
    }
    setCollapseOpen(!collapseOpen);
  };


  
  return (
    <>
      <Navbar
        className={classnames("navbar-absolute fixed-top", color)}
        expand="lg"
      >
        <Container fluid>
          <div className="navbar-wrapper">
            <div className="navbar-minimize">
              <Button
                className="btn-icon btn-round"
                color="default"
                id="minimizeSidebar"
                onClick={props.handleMiniClick}
              >
                <i className="nc-icon nc-minimal-right text-center visible-on-sidebar-mini" />
                <i className="nc-icon nc-minimal-left text-center visible-on-sidebar-regular" />
              </Button>
            </div>
            <div
              className={classnames("navbar-toggle", {
                toggled: sidebarOpen
              })}
            >
              <button
                className="navbar-toggler"
                type="button"
                onClick={toggleSidebar}
              >
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </button>
            </div>
            <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
              <span className="d-none d-md-block"
               style={{ color: 'black',
               fontWeight: 'bold',
               fontSize: '1.5rem', // Adjust the size as desired
               
               paddingBottom: '5px'  }}>
                 {project && project[1] ? project[1] : ''}
              </span>
              <span className="d-block d-md-none"
                style={{ color: 'black',
                fontWeight: 'bold',}}>KZ</span>
            </NavbarBrand>
          </div>
          <button
            aria-controls="navigation-index"
            aria-expanded={collapseOpen}
            aria-label="Toggle navigation"
            className="navbar-toggler"
            // data-target="#navigation"
            data-toggle="collapse"
            type="button"
            onClick={toggleCollapse}
          >
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </button>
          <Collapse
            className="justify-content-end"
            navbar
            isOpen={collapseOpen}
          >

            {/* Search
            <Form>
              <InputGroup className="no-border">
                <Input defaultValue="" placeholder="Search..." type="text" />
                <InputGroupAddon addonType="append">
                  <InputGroupText>
                    <i className="nc-icon nc-zoom-split" />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Form>
             */}

            
            <Nav navbar>
               {/*Stats 
              <NavItem>
                <NavLink
                  className="btn-magnify"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="nc-icon nc-layout-11" />
                  <p>
                    <span className="d-lg-none d-md-block">Stats</span>
                  </p>
                </NavLink>
              </NavItem>
              */}
            
<UncontrolledDropdown className="btn-rotate" nav isOpen={dropdownOpen} toggle={handleBellClick}>
  <DropdownToggle
    aria-haspopup={true}
    caret
    color="default"
    data-toggle="dropdown"
    id="navbarDropdownMenuLink"
    nav
  >
    <i className="nc-icon nc-bell-55" />
    <p>
      <span className="d-lg-none d-md-block">Some Actions</span>
    </p>
    
      <span className="notification-badge">{unreadCount}</span>
    
  </DropdownToggle>
  <DropdownMenu persist aria-labelledby="navbarDropdownMenuLink" right  placement="bottom-left">
    
    {notifications.length > 0 ? (
      notifications.map((notification, index) => (
        <DropdownItem key={index}  onClick={() => {
          notification.read = true;
          
         
        }}>{notification.message}</DropdownItem>
      ))
    ) : (
      <DropdownItem>There's no notification right now</DropdownItem>
    )}
    <DropdownItem divider />
    <DropdownItem onClick={() => {notifications.length = 0}}>
      Clear notifications
    </DropdownItem>
    
  </DropdownMenu>
</UncontrolledDropdown>
      
<NavItem>
      <NavLink
        className="btn-rotate"
        href="#pablo"
        onClick={toggleFixedPlugin}
      >
        <i className="nc-icon nc-settings-gear-65" />
        <p>
          <span className="d-lg-none d-md-block">Account</span>
        </p>
      </NavLink>
      {showFixedPlugin && (
        <FixedPlugin
          bgColor={sidebarBgColor}
          activeColor={sidebarActiveColor}
          sidebarMini={sidebarMini}
          handleBgClick={handleBgClick}
          handleActiveClick={handleActiveClick}
          handleMiniClick={handleMiniClick}
        />
      )}
    </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default AdminNavbar;
