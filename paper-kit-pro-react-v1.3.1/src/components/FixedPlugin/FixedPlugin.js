import React, { useState } from "react";
import Switch from "react-bootstrap-switch";
import { Button, NavItem, NavLink } from "reactstrap";

function FixedPlugin(props) {
  const [classes, setClasses] = useState("dropdown");
  const [darkMode, setDarkMode] = useState(false);

  const handleClick = () => {
    console.log("sdadas")
    setClasses((prevState) => {
      return prevState === "dropdown" ? "dropdown show" : "dropdown";
    });
  };

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      // If dark mode is being turned off, set the colors back to the default
      props.handleBgClick("white");
      props.handleActiveClick("primary");
    } else {
      // If dark mode is being turned on, set the colors to a dark theme
      props.handleBgClick("black");
      props.handleActiveClick("danger");
    }
  };
  

  return (
    <div className="fixed-plugin">
      <div className={classes}>
        <div onClick={handleClick}>
          <i className="fa fa-cog fa-2x" />
        </div>
        <ul className="dropdown-menu show">
          <li className="header-title">SIDEBAR BACKGROUND</li>
          <li className="adjustments-line">
            <div className="badge-colors text-center">
              <span
                className={props.bgColor === "black" ? "badge filter badge-dark active" : "badge filter badge-dark"}
                data-color="black"
                onClick={() => {
                  props.handleBgClick("black");
                }}
              />
              <span
                className={props.bgColor === "brown" ? "badge filter badge-default active" : "badge filter badge-default"}
                data-color="black"
                onClick={() => {
                  props.handleBgClick("brown");
                }}
              />
              <span
                className={props.bgColor === "white" ? "badge filter badge-light active" : "badge filter badge-light"}
                data-color="white"
                onClick={() => {
                  props.handleBgClick("white");
                }}
              />
            </div>
          </li>
          <li className="header-title">SIDEBAR ACTIVE COLOR</li>
          <li className="adjustments-line">
            <div className="badge-colors text-center">
              <span
                className={
                  props.activeColor === "primary"
                    ? "badge filter badge-primary active"
                    : "badge filter badge-primary"
                }
                data-color="primary"
                onClick={() => {
                  props.handleActiveClick("primary");
                }}
              />
              <span
                className={
                  props.activeColor === "info"
                    ? "badge filter badge-info active"
                    : "badge filter badge-info"
                }
                data-color="info"
                onClick={() => {
                  props.handleActiveClick("info");
                }}
              />
              <span
                className={
                  props.activeColor === "success"
                    ? "badge filter badge-success active"
                    : "badge filter badge-success"
                }
                data-color="success"
                onClick={() => {
                  props.handleActiveClick("success");
                }}
              />
              <span
                className={
                  props.activeColor === "warning"
                    ? "badge filter badge-warning active"
                    : "badge filter badge-warning"
                }
                data-color="warning"
                onClick={() => {
                  props.handleActiveClick("warning");
                }}
              />
              <span
                className={
                  props.activeColor === "danger"
                    ? "badge filter badge-danger active"
                    : "badge filter badge-danger"
                }
                data-color="danger"
                onClick={() => {
                  props.handleActiveClick("danger");
                }}
              />
            </div>
          </li>
          <li className="header-title">SIDEBAR MINI</li>
          <li className="adjustments-line">
            <div className="togglebutton switch-sidebar-mini">
              <Switch
                onChange={props.handleMiniClick}
                value={props.sidebarMini}
                onColor="info"
                offColor="info"
              />
            </div>
          </li>
          <li className="header-title">DARK MODE</li>
          <li className="adjustments-line">
            <div className="togglebutton switch-change-color">
              <Switch
                onChange={handleDarkMode}
                value={darkMode}
                onColor="dark"
                offColor="light"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
    );
  }
  
  export default FixedPlugin;
    
