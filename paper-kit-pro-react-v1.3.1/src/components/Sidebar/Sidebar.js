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
import React,{useState, useEffect} from "react";
import { NavLink,  useLocation } from "react-router-dom";
import { Nav, Collapse, Button } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

import avatar from "assets/img/faces/ayo-ogunseinde-2.jpg";
import logo from "assets/img/react-logo.png";
import localforage from 'localforage';
import { useHistory } from 'react-router-dom';
import { FaPowerOff } from 'react-icons/fa';
var ps;

function Sidebar(props) {
  const [openAvatar, setOpenAvatar] = React.useState(false);
  const [collapseStates, setCollapseStates] = React.useState({});
  const sidebar = React.useRef();
  const history = useHistory(); // get the history object
  const [name, setName] = useState("");
  const [LastName, setLastName] = useState("");
  const [project, setProject] = useState(null);

  const location = useLocation();
  console.log(location)
  
  // this creates the intial state of this component based on the collapse routes
  // that it gets through props.routes
  const getCollapseStates = (routes) => {
    let initialState = {};
    routes.map((prop, key) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: getCollapseInitialState(prop.views),
          ...getCollapseStates(prop.views),
          ...initialState
        };
      }
      return null;
    });
    return initialState;
  };
  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.js - route /admin/regular-forms
  const getCollapseInitialState = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (window.location.pathname.indexOf(routes[i].path) !== -1) {
        return true;
      }
    }
    return false;
  };
  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    
    return routes.map((prop, key) => {
      
      if (prop.redirect || prop.path === "/login") {
        return null;
      }
      if (prop.collapse) {
        var st = {};
        st[prop["state"]] = !collapseStates[prop.state];
        return (
          <li
            className={getCollapseInitialState(prop.views) ? "active" : ""}
            key={key}
          >
            <a
              href="#pablo"
              data-toggle="collapse"
              aria-expanded={collapseStates[prop.state]}
              onClick={(e) => {
                e.preventDefault();
                setCollapseStates(st);
              }}
            >
              {prop.icon !== undefined ? (
                <>
                  <i className={prop.icon} />
                  <p>
                    {prop.name}
                    <b className="caret" />
                  </p>
                </>
              ) : (
                <>
                  <span className="sidebar-mini-icon">{prop.mini}</span>
                  <span className="sidebar-normal">
                    {prop.name}
                    <b className="caret" />
                  </span>
                </>
              )}
            </a>
            <Collapse isOpen={collapseStates[prop.state]}>
              <ul className="nav">{createLinks(prop.views)}</ul>
            </Collapse>
          </li>
        );
      }
      return (
        <li className={activeRoute(prop.layout + prop.path)} key={key}>
          <NavLink to={prop.layout + prop.path} activeClassName="">
            {prop.icon !== undefined ? (
              <>
                <i className={prop.icon} />
                <p>{prop.name}</p>
              </>
            ) : (
              <>
                <span className="sidebar-mini-icon">{prop.mini}</span>
                <span className="sidebar-normal">{prop.name}</span>
              </>
            )}
          </NavLink>
         
        </li>
        
      );
    });
  };
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  React.useEffect(() => {
    // if you are using a Windows Machine, the scrollbars will have a Mac look
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }
    return function cleanup() {
      // we need to destroy the false scrollbar when we navigate
      // to a page that doesn't have this component rendered
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  });
  React.useEffect(() => {
    setCollapseStates(getCollapseStates(props.routes));
  }, []);

  async function handleLogout() {
   
    try {
      
        const access_token = await localforage.getItem('access_token');
        const refresh_token = await localforage.getItem('refresh_token');
        console.log(process.env.PUBLIC_URL)
        const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/logout/`, {
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ String(access_token)
            },
            body: JSON.stringify({
              refresh_token: refresh_token
            })
        });
        
        if (response.ok) {
            // Remove the token from async storage
            console.log("successful")

            await localforage.removeItem('access_token');
            await localforage.removeItem('refresh_token');
          
           
            setTimeout(() => {
              history.push('/login');
            }, 500); // wait for 2 seconds before navigating to login page
           // navigation.navigate("Login")
        }
        if (!response.ok){
          console.log('Bearer '+ String(access_token))
        }
    } catch (error) {
        console.error(error);
    }
    
  }


  useEffect(() => {
    async function fetchData() {
      const firstName = await localforage.getItem('first_name');
      console.log(firstName)
      const lastName = await localforage.getItem("last_name");
      console.log(lastName)
      setName(firstName);
      setLastName(lastName)
    }
    fetchData();
  }, []);

  

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
  return (
    <div
      className="sidebar"
      data-color={props.bgColor}
      data-active-color={props.activeColor}
    >
     <div className="logo" style={{ textAlign: "center", fontSize: "1.5rem", color: "white", fontWeight: 'bold', }}>
    {project && project[1] ? project[1] : ''}
</div>

      <div className="sidebar-wrapper" ref={sidebar}>
        <div className="user">
          <div className="photo"></div>
          <div className="info">
            <a
              data-toggle="collapse"
              aria-expanded={openAvatar}
              onClick={() => setOpenAvatar(!openAvatar)}
            >
              <span>
                {name} {LastName}
                <b className="caret" />
              </span>
            </a>
          </div>
        </div>
        {location.pathname !== "/auth/login" && location.pathname !== "/auth/select" && (
          <>
            <Nav>{createLinks(props.routes)}</Nav>
            <Button
              className="my-button-class d-flex justify-content-center align-items-center"
              color="primary"
              onClick={handleLogout}
              style={{
                display: "block",
                margin: "auto",
                marginTop: "120px",
                width: "120px",
                height: "40px",
                borderRadius: "20px",
                padding: "0 10px",
                fontSize: "16px",
                fontWeight: "bold",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span>Çıkış</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
  
}

export default Sidebar;
