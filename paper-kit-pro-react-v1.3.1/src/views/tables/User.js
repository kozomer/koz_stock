import React, { useState, useEffect } from 'react';
import { Card,Label, CardHeader, CardBody, CardFooter, Form, Row, Col, FormGroup, CardTitle, ListGroupItem,Input, Button, Alert, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup } from 'reactstrap'; // Replace this line with your actual import if you're not using reactstrap
import localforage from 'localforage';
import ReactBSAlert from "react-bootstrap-sweetalert";
//import { PencilSquare, TrashFill, InfoCircleFill } from 'react-bootstrap-icons'; // Icons for buttons

function RegistrationForm() {
  
  const [formData, setFormData] = useState({});
  const [company, setCompany] = useState('');
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [alert, setAlert] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [passiveUsers, setPassiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetail, setUserDetail] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [editModal, setEditModal] = useState(false);
  const toggleModal = () => setEditModal(!editModal);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      const access_token = await localforage.getItem('access_token');
      console.log(formData)
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
  
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/create_user/`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + String(access_token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        errorUpload(data.error);
      } else {
        successUpload(data.message);
        fetchActiveAndPassiveUsers()
      }
    })
    .catch(error => {
      console.error('Error:', error);
      errorUpload('An unexpected error occurred');
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
  const isFormValid = formData.username && formData.first_name && formData.last_name && formData.password && formData.staff_role && selectedProjects.length > 0;


  useEffect(() => {
    fetchActiveAndPassiveUsers();
  }, []);
  
  const fetchActiveAndPassiveUsers = async () => {
    const access_token = await localforage.getItem('access_token');
    console.log(access_token)
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/collapsed_users/`, {
      headers: {
        'Authorization': 'Bearer ' + String(access_token),
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        setActiveUsers(data.active_users_list);
        setPassiveUsers(data.passive_users_list);
      })
      .catch(error => console.error(error));
  };
  
  // Add the method to fetch user details
  const fetchUserDetails = async (id) => {
    console.log(id)
    const access_token = await localforage.getItem('access_token');
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/user_detail/`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + String(access_token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          errorUpload(data.error);
        } else {
        setUserDetail(data)
        console.log(data)
        setEditMode(false);
        }
      })
      .catch(error => console.error(error));
  };
  
  // Method to handle user selection
  const handleUserSelection = (user) => {
    setSelectedUser(user);
    fetchUserDetails(user[0]); // assuming the first element of the user array is id
  };
  
  // Method to handle user deletion
  const deleteUser = async (id) => {
    const access_token = await localforage.getItem('access_token');
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/delete_user/`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + String(access_token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: id }),
    })
      .then(response => response.json())
      .then(data => {
        fetchActiveAndPassiveUsers(); // refresh the user lists
        if (selectedUser && selectedUser[0] === id) {
          // if the deleted user was the currently selected one
          setSelectedUser(null);
          setUserDetail(null);
        }
      })
      .catch(error => console.error(error));
  };
  
  // Add the methods to handle editing
  const handleEdit = (user) => {
    setSelectedUser(user);
    setUserDetail(user);
    setEditMode(true);
   
  };
  
  const handleEditSubmit = async (user) => {
    const projectIds = user.projects.map(project => project[0]);
    const userWithProjectIds = { ...user, projects: projectIds };
  
    const access_token = await localforage.getItem('access_token');
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/edit_user/`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + String(access_token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userWithProjectIds),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          errorUpload(data.error);
        } else {
          successUpload(data.message);
          fetchUserDetails(user.id);
          fetchActiveAndPassiveUsers()
        }
      })
      .catch(error => {
        console.error('Error:', error);
        errorUpload('An unexpected error occurred');
      });
  };
  
  
  // Add the method to handle edit cancellation
  const handleEditCancel = () => {
    fetchUserDetails(selectedUser[0]);
  };


  const warningWithConfirmAndCancelMessage = (data) => {
    
    setAlert(
      
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() =>{ 
        deleteUser(data);
        successDelete()}}
        onCancel={() => {
        
          cancelDelete()
        }}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
       Are you sure to delete this row?
      </ReactBSAlert>
    );
    
  };
  

  const successDelete = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Deleted!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        Your row has been deleted.
      </ReactBSAlert>
    );
  };

  const cancelDelete = () => {
    setAlert(
      <ReactBSAlert
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title="Cancelled"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        Your row is safe :)
      </ReactBSAlert>
    );
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

  return (
    <>
    
   


    <div className='content'>
    {alert}
    <Row>
    
    <Col  md="4" >
    <Card>
    <CardHeader>
        <Row className="align-items-center">
            <Col>
                <CardTitle tag="h5">Aktif Kullanıcılar</CardTitle>
            </Col>
            <Col className="text-right">
                <Button
                    className="btn-round"
                    color="success"
                    onClick={() => { setShowAddForm(!showAddForm); setSelectedUser(false);}}
                    outline
                >
                    <i className="nc-icon nc-simple-add" />Yeni Kullanıcı Ekle
                </Button>
            </Col>
        </Row>
    </CardHeader>
    <CardBody>
        <ListGroup>
            {activeUsers.map(user => (
                <ListGroupItem key={user[0]} style={{height: '40px', display: 'flex', alignItems: 'center'}}>
                    <div style={{flex: 1}}>
                        <strong>{capitalizeFirstLetter(user[1])} {capitalizeFirstLetter(user[2])}</strong>
                    </div>
                    <div>
                        <Button onClick={() =>  warningWithConfirmAndCancelMessage(user[0])  }
                                color="danger"
                                size="sm"
                                className="btn-icon btn-link remove"
                        >
                            <i className="fa fa-times" />
                        </Button>
                        <Button onClick={() =>  {handleUserSelection(user); setShowAddForm(false)}} 
                                color='warning'
                                size='sm'
                                className='btn-icon btn-link edit'
                        >
                            <i className="fa fa-edit" />
                        </Button>
                    </div>
                </ListGroupItem>
            ))}
        </ListGroup>
    </CardBody>
</Card>
</Col>


{/* 
{showUsers && (
   <Col  md="6">
    <Card>
      <CardHeader>
        <CardTitle tag="h5">Passive Users</CardTitle>
      </CardHeader>
      <CardBody>
        <ListGroup>
          {passiveUsers.map(user => (
            <ListGroupItem key={user[0]}>
              <div onClick={() => handleUserSelection(user)}>{user[1]} {user[2]}</div>
              <button onClick={() => deleteUser(user[0])}>Delete</button>
              <button onClick={() => handleEdit(user)}>Edit</button>
            </ListGroupItem>
          ))}
        </ListGroup>
      </CardBody>
    </Card>
    </Col>
)}
*/}

    {selectedUser && (
       <Col  md="8" >
  <Card>
  <CardHeader>
        <CardTitle tag="h5">Kullanıcı Düzenle</CardTitle>
      </CardHeader>
    <CardBody>
      {/* Editable form view of selected user */}
      <Form onSubmit={(e) => {e.preventDefault(); handleEditSubmit(userDetail);}}>
        <FormGroup>
          <Label for="username">Kullanıcı AdI</Label>
          <Input id="username" type="text" value={userDetail.username} onChange={(e) => setUserDetail({...userDetail, username: e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="first_name">Ad</Label>
          <Input id="first_name" type="text" value={userDetail.first_name} onChange={(e) => setUserDetail({...userDetail, first_name: e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="last_name">Soyad</Label>
          <Input id="last_name" type="text" value={userDetail.last_name} onChange={(e) => setUserDetail({...userDetail, last_name: e.target.value})} />
        </FormGroup>
       
        <Col md="4"></Col>
          <Col md="8">
        <FormGroup>
  <label>Projeler</label>
  {projects.map(project => (
    <div key={project.id}>
      <Input
        name="projects"
        type="checkbox"
        checked={userDetail && userDetail.projects ? userDetail.projects.some((userProject) => userProject[0] === project.id) : false}
        onChange={(e) => {
          let newProjects = [...userDetail.projects];
          if (e.target.checked) {
            newProjects.push([project.id, project.name]);
          } else {
            newProjects = newProjects.filter(userProject => userProject[0] !== project.id);
          }
          setUserDetail({...userDetail, projects: newProjects});
        }}
      />
      {project.name}
    </div>
  ))}
</FormGroup>
</Col>

<FormGroup>
  <Label for="staff_role"> Personel Rolü</Label>
  <Input type="select" id="staff_role" value={userDetail.staff_role} onChange={(e) => {
    const role = e.target.value;
    setUserDetail({
      ...userDetail, 
      staff_role: role
    });
  }}>
    <option value="super_staff">Super Staff</option>
    <option value="stock_staff">Stock Staff</option>
    <option value="accounting_staff">Accounting Staff</option>
  </Input>
</FormGroup>


        {/* Add additional form groups for other fields as needed */}
        <Button className="btn-round" color="success" type="submit">kAYDET</Button> {/* Submit Button */}
        <Button className="btn-round" color="danger" type="submit" onClick={() => setSelectedUser(false)}>
                            İptal ET
                          </Button>
      </Form>
    </CardBody>
  </Card>
  </Col>
)}



{showAddForm && (
   <Col  md="8">
    <Card >
      <CardHeader>
        <h5 className="title" style={{ textTransform: "uppercase" }}>
          Kayıt Formu
        </h5>
        <small className="text-muted" style={{ fontSize: "1.1em", fontWeight: "bold" }}>
          Lütfen Aşağıyı Doldurunuz
        </small>
      </CardHeader>
      <CardBody>
        <Form>
          <Row>
            <Col>
              <FormGroup>
                <label>Kullanıcı Adı</label>
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
                <label>Ad</label>
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
                <label>Soyad</label>
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
                <label>Şifre</label>
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
                <label>Rol</label>
                <Input
                  name="staff_role"
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
        <label>Projeler</label>
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
        <Button className="btn-round" color="success" type="submit" disabled={!isFormValid} onClick={handleSave}>Kaydet</Button>
      </CardFooter>
    </Card>

    </Col>
)}

</Row>
</div>


    </>
  );
}

export default RegistrationForm;
