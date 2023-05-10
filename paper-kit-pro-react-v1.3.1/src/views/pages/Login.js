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
import { withRouter } from 'react-router-dom';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Label,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
  Row
} from "reactstrap";

import localforage from 'localforage';
import '../../assets/css/Table.css';
import { FaFirstAid } from "react-icons/fa";
import "../../assets/css/paper-dashboard.css";


function Login({ history }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(username)
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
      
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        
      });

      if (!response.ok) {
        
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      console.log(data)
      const { access, refresh,first_name,last_name } = data;
      console.log(first_name,last_name)
      if (response.ok) {
        // if login is successful, store the token in local storage
        console.log("sadasd"),
        
        setTimeout(() => {
          history.push('/admin/dashboard');
        }, 500); // wait for 2 seconds before navigating to home page
        await localforage.setItem("access_token", access);
        await localforage.setItem("refresh_token", refresh);
        await localforage.setItem("first_name", first_name);
        await localforage.setItem("last_name", last_name);
      }
    } catch (error) {
      console.log(error.message);
      setError("Invalid email or password");
      setPassword("");
    }
  };

  return (
    <div className="login-page">
     <Container>
  <Row>
    <Col className="ml-auto mr-auto" lg="4" md="6">
      <Form
        action=""
        className="form"
        method=""
        
        
      >
        <Card className="card-login">
          <CardHeader>
            <CardHeader>
              <h3 className="header text-center">Login</h3>
            </CardHeader>
          </CardHeader>
          <CardBody style={{ marginLeft: "10px", marginRight: "10px" }}>
            <InputGroup>
              <Input
                placeholder="Username"
                type="suername"
                value={username}
                onChange={handleEmailChange}
                style={{
                  borderLeft: "1px solid #dedede",
                  borderRight: "1px solid #dedede",
                }}
              />
            </InputGroup>
            <InputGroup>
              <Input
                placeholder="Password"
                type="password"
                autoComplete="off"
                value={password}
                onChange={handlePasswordChange}
                style={{
                  border: error ? "0.5px solid #D32F2F" : "",
                  boxShadow: error ? "0 0 10px rgba(255, 0, 0, 0.5)" : "",
                  borderLeft: "1px solid #dedede",
                  borderRight: "1px solid #dedede",
                }}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    handleSubmit(event);
                    
                  }
                }}
              />
            </InputGroup>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <br />
          </CardBody>
          <CardFooter className="d-flex justify-content-center">
            <Button type="submit" className="my-button-class" color="primary" onClick={handleSubmit}>
              LOGIN
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </Col>
  </Row>
</Container>
<div
  className="full-page-background"
  style={{
    backgroundImage: `url(${require("assets/img/bg/fabio-mangione.jpg")})`,
  }}
/>

    </div>
  );
}

export default withRouter(Login);


