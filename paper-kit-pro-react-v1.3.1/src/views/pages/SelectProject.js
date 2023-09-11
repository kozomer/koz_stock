import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Button, Row, Col, Container } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import project1Image from '../../assets/img/kozoran.png';
import project2Image from '../../assets/img/koz_logo.png';
import '../../assets/css/Table.css';
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
      <Container className="containers">
        <Row>
          {projects.map((project) => (
            <Col xs="12" sm="6" md={projects.length > 2 ? "4" : "6"} key={project.project_id} className="column"> 
              <Card className="cardStyle"> 
              <div className="cardHeader">assa</div>
                <div className="backgroundImage" style={{ 
                  
                 
                  backgroundImage: `url(${project.imageUrl})`,
                 
                }} />
                <div className="cardInner">
                  <CardHeader>
                    <h3 className="header text-center">{project.title}</h3>
                  </CardHeader>
                  <CardBody>
                    {/* ... */}
                  </CardBody>
                  <div className="buttonContainer">
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
