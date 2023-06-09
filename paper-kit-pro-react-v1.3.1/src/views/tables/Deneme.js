import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Form, Row, Col, FormGroup, Input, Button } from 'reactstrap'; // Replace this line with your actual import if you're not using reactstrap
const dummyProjects = ['Project 1', 'Project 2', 'Project 3'];
function RegistrationForm() {
  const [formData, setFormData] = useState({});
  const [company, setCompany] = useState('');
  const [selectedProjects, setSelectedProjects] = useState([]);
  
  
  /*
  useEffect(() => {
    fetchYourCompanyAPI() // replace with your actual API fetch call
      .then(data => setCompany(data.name));
  }, []);
*/
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleProjectSelection = (project) => {
    if (selectedProjects.includes(project)) {
      setSelectedProjects(selectedProjects.filter(item => item !== project));
    } else {
      setSelectedProjects([...selectedProjects, project]);
    }
  }

  const handleSave = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  }

  const isFormValid = Object.values(formData).every(val => val) && selectedProjects.length > 0;
  return (
    <>
    <div className='content'>
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
            <Col>
              <FormGroup>
                <label>Projects</label>
                {dummyProjects.map(project => (
                  <div key={project}>
                    <Input
                      name="projects"
                      type="checkbox"
                      onChange={() => handleProjectSelection(project)}
                    />
                    {project}
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
