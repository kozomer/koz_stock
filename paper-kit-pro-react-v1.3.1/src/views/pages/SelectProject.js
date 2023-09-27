import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Button, Row, Col, Container } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import project1Image from '../../assets/img/kozoran.png';
import project2Image from '../../assets/img/koz_logo.png';
import '../../assets/css/Table.css';
import localforage from 'localforage';

import ReactBSAlert from "react-bootstrap-sweetalert";


/*
const projects = [
  { project_id: 1, title:'', imageUrl: project1Image },
  { project_id: 2, title: '', imageUrl:  project2Image },
  
  // ...
];

*/
function SelectionPage() {
    const [selectedProject, setSelectedProject] = useState(null);
    const history = useHistory();

    const [alert, setAlert] = useState(null);
    const [projects, setProjects] = useState([]);


    
  useEffect(() => {
    async function fetchProjects() {
      const access_token = await localforage.getItem('access_token');
     
      fetch(`${process.env.REACT_APP_PUBLIC_URL}/projects/`, {
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

const errorUpload = (e) => {
  console.log("asdsad")
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
  
    async function handleSelectProject(project)  {
      setSelectedProject(project);
      const selectedData={project_id:project.id}
      console.log(selectedData)
      
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
                // Check if there's an error key in the data and call errorUpload
                if (data.error) {
                    errorUpload(data.error);
                }
            });
        } else {
            return response.json().then(data => {
              console.log(data)
              errorUpload(data);
                history.push('../admin/dashboard');
                
            });
        }
    })
    .catch(err => {
        // This will catch any network errors or JSON parsing errors
        errorUpload(err);
    });

       // replace '/next-page' with the path to the next page
    }
  
    return (
   
      <Container className="containers">
    <Row>
      {projects.map((project) => (
        <Col xs="12" sm="6" md={projects.length > 2 ? "4" : "6"} key={project.id} className="column"> 
          <Card className="cardStyle fixed-height"> 
            <CardHeader className="cardHeader">
              <h3 className="header text-center">{project.name}</h3>
            </CardHeader>
            <div className="buttonContainer">
              <Button className="btn-block mt-4" onClick={() => handleSelectProject(project)}>
                Seç
              </Button>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
</Container>

      
    );
  }

export default SelectionPage;
