import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button, Row, Col, Container } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import project1Image from '../../assets/img/kozoran.png';
import project2Image from '../../assets/img/koz_logo.png';

import localforage from 'localforage';
const projects = [
  { project_id: 1, title:'', imageUrl: project1Image },
  { project_id: 2, title: '', imageUrl:  project2Image },
  
  // ...
];

function SelectionPage() {
    const [selectedProject, setSelectedProject] = useState(null);
    const history = useHistory();
  
    async function handleSelectProject(project)  {
      setSelectedProject(project);
      const selectedData={project_id:project.project_id}
      
      const access_token = await localforage.getItem('access_token'); 
       fetch(`${process.env.REACT_APP_PUBLIC_URL}/set_current_project/`,{
        method: 'POST',
        body: JSON.stringify(selectedData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ String(access_token)
        }
      })
        .then((response) => {
      if (!response.ok) {
        return response.json().then(data => {
            console.log(data)
            
        });
      }
      else{
        return response.json().then(data => {
          
            history.push('../admin/dashboard');
          console.log("Error")
        });
      }
    })
       // replace '/next-page' with the path to the next page
    }
  
    return (
      <Container style={{ display: 'flex', justifyContent: 'center' }}>
        <Row>
          {projects.map((project) => (
            <Col xs="12" sm="6" md={projects.length > 2 ? "4" : "6"} key={project.project_id} style={{ marginBottom: '30px' }}> 
              <Card style={{ width: '100%', position: 'relative' }}> 
                <div style={{ 
                  position: 'absolute', 
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: '100%',
                  backgroundImage: `url(${project.imageUrl})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  filter: 'blur(1px)',
                }} />
                <div style={{ position: 'relative', backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '30px' }}>
                  <CardHeader>
                    <h3 className="header text-center">{project.title}</h3>
                  </CardHeader>
                  <CardBody>
                    {/* ... */}
                  </CardBody>
                  <div className="d-flex justify-content-center" style={{ marginTop: '20px' }}>
                    <Button color="primary" onClick={() => handleSelectProject(project)}>
                      Select
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

export default SelectionPage;
