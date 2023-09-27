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
  const word = "stockruct";
  const letters = word.split("").map((letter, index) => (
    <span key={index} style={{ animationDelay: `${index * 0.2}s` }} className="animated-letter">
      {letter}
    </span>
  ));

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(username)
    try {
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/login/`, {
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
          history.push('/auth/select');
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
    <div className="login-page"  >


<Row className="h-100">
<div className="stockruct-title">
        {letters}
      </div>
      
        <div className="vertical-line"></div>
    
     <Container>
  <Row>
  <Col className="ml-auto" lg="3" md="4">
    <Card className="card-login">
        <CardBody>
            <h4 className="text-center">Login</h4>
            <InputGroup className="mt-3">
                <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                        <i className="nc-icon nc-single-02"></i>
                    </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Username" type="text" value={username} onChange={handleEmailChange} />
            </InputGroup>
            <InputGroup className="mt-3">
                <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                        <i className="nc-icon nc-key-25"></i>
                    </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Password" type="password" value={password} onChange={handlePasswordChange} />
            </InputGroup>
            {error && <p className="mt-3 text-danger text-center">{error}</p>}
            <Button className="btn-block mt-4"  onClick={handleSubmit}>Log in</Button>
        </CardBody>
    </Card>
</Col>

  </Row>

  
</Container>
</Row>
{/* 
<div
  className="full-page-background"
  style={{
    backgroundImage: `url(${require("assets/img/bg/fabio-mangione.jpg")})`,
  }}
/>
*/}
    </div>
   
  );
}

export default withRouter(Login);


