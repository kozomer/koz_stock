import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Form, Row, Col, FormGroup, Input, Button } from 'reactstrap'; // Replace this line with your actual import if you're not using reactstrap
import localforage from 'localforage';
import ReactBSAlert from "react-bootstrap-sweetalert";
function RegistrationForm() {
  const [formData, setFormData] = useState({});
  const [company, setCompany] = useState('');
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [alert, setAlert] = useState(null);


  useEffect(() => {
    async function fetchProjects() {
      const access_token = await localforage.getItem('access_token');
      console.log(formData)
      fetch('http://127.0.0.1:8000/api/projects/', {
        headers: {
          'Authorization': 'Bearer ' + String(access_token),
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          setProjects(data);
        })
        .catch(error => {
          console.error(error);
          errorUpload(error); // Call the errorUpload function here
        });
    }
    fetchProjects();
  }, []);
  // passing an empty array as the second parameter to useEffect makes it run only on mount and unmount
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleProjectSelection = (project) => {
    if (selectedProjects.includes(project.id)) {
      setSelectedProjects(selectedProjects.filter(item => item !== project.id));
    } else {
      setSelectedProjects([...selectedProjects, project.id]);
    }
  }


  const hideAlert = () => {
    setAlert(null);
  };


  useEffect(() => {
    console.log(selectedProjects)
    setFormData(currentFormData => ({
      ...currentFormData,
      projects: selectedProjects,
    }));
  }, [selectedProjects]);

   const handleSave = async (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);

    const access_token = await localforage.getItem('access_token');

    fetch('http://127.0.0.1:8000/api/create_user/', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + String(access_token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      successUpload(data.message);
    })
    .catch(error => {
      console.error(error);
      errorUpload(error);
    });
  }
  const errorUpload = (e) => {
    setAlert(
      <ReactBSAlert
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title="Error"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
       {e}
      </ReactBSAlert>
    );
  };


  const successUpload = (s) => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Uploaded!"
        onConfirm={() =>{
          hideAlert();
          setFormData({});
          setSelectedProjects([]); // reset selectedProjects
         }}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        {s}
      </ReactBSAlert>
    );
  };
  const isFormValid = formData.username && formData.first_name && formData.last_name && formData.password && formData.role && selectedProjects.length > 0;


  return (
    <>
    <div className='content'>
    {alert}
    <Card>
      <CardHeader>
        <h5 className="title" style={{ textTransform: "uppercase" }}>
          Registration Form
        </h5>
        <small className="text-muted" style={{ fontSize: "1.1em", fontWeight: "bold" }}>
          Please Fill the Information Below
        </small>
      </CardHeader>
      <CardBody>
        <Form>
          <Row>
            <Col>
              <FormGroup>
                <label>Username</label>
                <Input
                  name="username"
                  onChange={handleInputChange}
                  placeholder="Username"
                  type="text"
                  value={formData.username || ''} // value attribute added here
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <label>First Name</label>
                <Input
                  name="first_name"
                  onChange={handleInputChange}
                  placeholder="First Name"
                  type="text"
                  value={formData.first_name || ''} // value attribute added here
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <label>Last Name</label>
                <Input
                  name="last_name"
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  type="text"
                  value={formData.last_name|| ''} // value attribute added here
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col>
              <FormGroup>
                <label>Password</label>
                <Input
                  name="password"
                  type="password"
                  onChange={handleInputChange}
                  placeholder="Password"
                  value={formData.password || ''} // value attribute added here
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col>
              <FormGroup>
                <label>Role</label>
                <Input
                  name="role"
                  type="select"
                  onChange={handleInputChange}
                >
                  <option value="">Select Role</option>
                  <option value="super_staff">Super Staff</option>
                  <option value="stock_staff">Stock Staff</option>
                  <option value="accounting_staff">Accounting Staff</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
        
          <Row>
          <Col md="1"></Col>
          <Col md="11">
          <FormGroup>
        <label>Projects</label>
        {projects.map(project => ( // use the fetched projects here
          <div key={project.id}>
            <Input
              name="projects"
              type="checkbox"
              onChange={() => handleProjectSelection(project)}
              checked={selectedProjects.includes(project.id)} // checked attribute added here
              
            />
            {project.name}
          </div>
        ))}
      </FormGroup>
            </Col>
          </Row>
        </Form>
      </CardBody>
      <CardFooter>
        <Button className="btn-round" color="success" type="submit" disabled={!isFormValid} onClick={handleSave}>Save</Button>
      </CardFooter>
    </Card>
    </div>
    </>
  );
}

export default RegistrationForm;
