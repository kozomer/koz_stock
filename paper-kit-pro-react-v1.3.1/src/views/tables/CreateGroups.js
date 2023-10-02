import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import localforage from 'localforage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactBSAlert from "react-bootstrap-sweetalert";

function CreateGroups() {
  const [groupName, setGroupName] = useState("");
  const [subgroupName, setSubgroupName] = useState("");
  const [groupList, setGroupList] = useState([]);
  const [subgroupList, setSubgroupList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [editingSubgroup, setEditingSubgroup] = useState(null);
  const [alert, setAlert] = useState(null);
  const fetchData = async () => {
    const access_token = await localforage.getItem('access_token');
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/product_groups/`, {
      headers: {
        'Authorization': 'Bearer ' + String(access_token),
      }
    })
    .then(response => response.json())
    .then(data => setGroupList(data))
    .catch(error => console.error(error));
  };

 
  useEffect(() => {
    fetchData();
  }, []); // Fetch data on initial render.

  const handleCreateGroup = async () => {
    const access_token = await localforage.getItem('access_token');
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/create_product_group/`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + String(access_token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ group_name: groupName }),
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {throw err});
      }
      return response.json();
    })
    .then(data => {
      if (data.message) {
        setGroupName("");
        setGroupList([...groupList, data.group]);
        fetchData();  // Move the fetchData call here.
        successUpload(data.message);
        setSelectedGroup(groupName)
      } else if (data.error) {
        errorUpload(data.error);
      }
    })
    .catch(error => {
      errorUpload(error.error);
    });
  };
  
  
  const fetchSubgroups = async (groupCode) => {
    const access_token = await localforage.getItem('access_token');
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/product_subgroups/`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + String(access_token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ group_code: groupCode }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setSubgroupList(data);
    })
    .catch(error => console.error(error));
  };

  useEffect(() => {
    console.log("subgroupList has changed!", subgroupList);
    // Any additional logic if required
}, [subgroupList]);

useEffect(() => {
  if (selectedGroup && Array.isArray(groupList)) {
    const matchedGroup = groupList.find(group => group && group[1] === selectedGroup);
    
    if (matchedGroup && matchedGroup.length > 0) {
      const groupCode = matchedGroup[0];
      fetchSubgroups(groupCode);
    }
  }
}, [selectedGroup]);

  
  

  const handleCreateSubgroup = async () => {
    if (selectedGroup && subgroupName) {
      const group_code = groupList.find(group => group[1] === selectedGroup)[0];
  
      const access_token = await localforage.getItem('access_token');
      fetch(`${process.env.REACT_APP_PUBLIC_URL}/create_product_subgroup/`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + String(access_token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ group_code: group_code, subgroup_name: subgroupName })
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {throw err});
        }
        return response.json();
      })
      .then(data => {
        if (data.message) {
          fetchSubgroups(group_code)
         
          console.log("After setting the new list",subgroupList)
          successUpload(data.message);
        } else if (data.error) {
          errorUpload(data.error);
        }
      })
      .catch(error => {
        errorUpload(error.error);
      });
    }
  };
 

  const handleEditSubgroup = async (subgroupCode, newSubgroupName) => {
    console.log("subgroupCode:",subgroupCode[1])
    console.log("newSubgroupName:",newSubgroupName)
    const access_token = await localforage.getItem('access_token');
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/edit_product_subgroup/`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + String(access_token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subgroup_code: subgroupCode[0],
        new_subgroup_name: newSubgroupName,
        group_code: groupList.find(group => group[1] === selectedGroup)[0]
      }),
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {throw err});
      }
      return response.json();
    })
    .then(data => {
      if(data.message) {
        successUpload(data.message);
        fetchSubgroups(groupList.find(group => group[1] === selectedGroup)[0]);
      } else if(data.error) {
        errorUpload(data.error);
      } else {
        fetchSubgroups(groupList.find(group => group[1] === selectedGroup)[0]);
      }
    })
    .catch(error => {
      errorUpload(error.error);
    });
  }
  

  
  // Function to handle subgroup deleting
  const handleDeleteSubgroup = async (subgroupCode) => {
    console.log("subgroupCode:", subgroupCode[0]);
    const access_token = await localforage.getItem('access_token');
    
    // Optimistically remove the subgroup from state
    const updatedSubgroups = subgroupList.filter(subgroup => subgroup[0] !== subgroupCode[0]);
    setSubgroupList(updatedSubgroups);

    fetch(`${process.env.REACT_APP_PUBLIC_URL}/delete_product_subgroup/`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + String(access_token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subgroup_code: subgroupCode[0],
        group_code: groupList.find(group => group[1] === selectedGroup)[0]
      }),
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {throw err});
      }
      return response.json();
    })
    .then(data => {
      if (data.message) {
        successUpload(data.message);
      } else if (data.error) {
        errorUpload(data.error);

        // Since there was an error, revert the change by adding the subgroup back to the list
        setSubgroupList(prevSubgroups => [...prevSubgroups, subgroupCode]);
      }
    })
    .catch(error => {
      errorUpload(error.error);

      // If there's an error, revert the change by adding the subgroup back to the list
      setSubgroupList(prevSubgroups => [...prevSubgroups, subgroupCode]);
    });
}

  

  const handleEditGroup = (groupCode) => {
    setEditingGroup(groupCode);
  };

  const handleSaveGroup = async (groupCode, newGroupName) => {
    const access_token = await localforage.getItem('access_token');
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/edit_product_group/`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + String(access_token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ group_code: groupCode, new_group_name: newGroupName }),
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {throw err});
      }
      return response.json();
    })
    .then(data => {
      if (data.message) {
        setEditingGroup(null);
        fetchData();
        successUpload(data.message);
      } else if (data.error) {
        errorUpload(data.error);
      }
    })
    .catch(error => {
      errorUpload(error.error);
    });
  };

  const handleDeleteGroup = async (groupCode) => {
   
      const access_token = await localforage.getItem('access_token');
      fetch(`${process.env.REACT_APP_PUBLIC_URL}/delete_product_group/`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + String(access_token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ group_code: groupCode }),
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {throw err});
        }
        return response.json();
      })
      .then(data => {
        if (data.message) {
          fetchData();
          successUpload(data.message);
        } else if (data.error) {
          errorUpload(data.error);
        }
      })
      .catch(error => {
        errorUpload(error.error);
      });
    
  };

 
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
        onConfirm={() => { hideAlert()
       }}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        {s}
      </ReactBSAlert>
    );
  };


  const hideAlert = () => {
    setAlert(null);
  };


  const deleteSubgroupPopup = (subgroup) => {
    
    setAlert(
      
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Emin misin?"
        onConfirm={() =>{ 
        handleDeleteSubgroup(subgroup)
       }}
        onCancel={() => {
        
          cancelDelete()
        }}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Evet, sil!"
        cancelBtnText="İptal et"
        showCancel
        btnSize=""
      >
       Bu altgrubu silmek istediğine emin misin?
      </ReactBSAlert>
    );
    
  };

  const deleteGroupPopup = (group) => {
    
    setAlert(
      
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Emin misin?"
        onConfirm={() =>{ 
        handleDeleteGroup(group)
       }}
        onCancel={() => {
        
          cancelDelete()
        }}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Evet, sil"
        cancelBtnText="İptal et"
        showCancel
        btnSize=""
      >
       Bu altgrubu silmek istediğine emin misin?
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

  return (
    <>
    <div className='content'>
    {alert}
    <Row>
      <Col xs="6">
        <Card body>
          <h4>Gruplar</h4>
         
          <Form>
            <FormGroup>
              <Label>Grup Adı</Label>
              <Input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} />
            </FormGroup>
            <Button disabled={!groupName} className="my-button-class"  onClick={handleCreateGroup}>OLUSTUR</Button>
          </Form>
          <ul>
                {groupList.length > 0 ? 
                 groupList.map(group => {
                    if (group) {
                      if (editingGroup === group[0]) {
                        return (
                            <li key={group[0]} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '10px', height: '50px', alignItems: 'center' }}>
                             <input 
                                type="text" 
                                defaultValue={group[1]} 
                                onBlur={e => handleSaveGroup(group[0], e.target.value)} 
                                style={{ height: '20px', padding: '5px' }} // Set a fixed height and add some padding.
                            />
                            <Button
                              className="btn-round btn-icon"
                              color="success"
                              size="sm"
                              style={{ top: "2.5px" }}
                              onClick={(e) => handleSaveGroup(group[0], e.currentTarget.previousSibling.value)}

                              outline
                            >
                              <i className="nc-icon nc-check-2" />
                            </Button>
                          </li>
                        );
                      } else {
                        return (
                          <li key={group[0]} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '10px' }}>
                            <span>{group[1]}</span>
                            <Button
                              className="btn-round btn-icon"
                              color="warning"
                              size="sm"
                              style={{ top: "2.5px" }}
                              onClick={() => handleEditGroup(group[0])}
                              outline
                            >
                              <i className="nc-icon nc-ruler-pencil" />
                            </Button>
                            <Button
                              className="btn-round btn-icon"
                              color="danger"
                              size="sm"
                              style={{ top: "2.5px" }}
                              onClick={() => deleteGroupPopup(group[0])}
                              outline
                            >
                              <i className="nc-icon nc-simple-remove" />
                            </Button>
                          </li>
                        );
                      }
                    } else {
                      return null;
                    }
                  })
                  
                    : 
                    <li>Listede şu anda kayıtlı grup yok</li>
                }
              </ul>

        </Card>
      </Col>
      <Col xs="6">
        <Card body>
          <h4>Alt Gruplar</h4>
          
          <Form>
            <FormGroup>
              <Label>Grup Seç</Label>
              <Input type="select" value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
    {groupList.map((group, index) => (
        group ? <option key={index} value={group[1]}>{group[1]}</option> : null
    ))}
</Input>


            </FormGroup>
            <FormGroup>
              <Label>Alt Grup Adı</Label>
              <Input type="text" value={subgroupName} onChange={e => setSubgroupName(e.target.value)} />
            </FormGroup>
            <Button disabled={!selectedGroup || !subgroupName} className="my-button-class"  onClick={handleCreateSubgroup}>OLUSTUR</Button>
          </Form>
          <ul>
  {subgroupList.length > 0 ? 
   subgroupList.map(subgroup => {
    if (editingSubgroup === subgroup) {
      return (
        <li key={subgroup[0]} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '10px', height: '50px', alignItems: 'center' }}>
          <input 
            type="text" 
            defaultValue={subgroup[1]} 
            onBlur={e => handleEditSubgroup(subgroup, e.target.value)}
            style={{ height: '20px', padding: '5px' }}
          />
          <Button
            className="btn-round btn-icon"
            color="success"
            size="sm"
            style={{ top: "2.5px" }}
            onClick={() => setEditingSubgroup(null)}
            outline
          >
            <i className="nc-icon nc-check-2" />
          </Button>
        </li>
      );
    } else {
      return (
        <li key={subgroup[0]} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '10px' }}>
          <span>{subgroup[1]}</span>
          <Button
            className="btn-round btn-icon"
            color="warning"
            size="sm"
            style={{ top: "2.5px" }}
            onClick={() => setEditingSubgroup(subgroup)}
            outline
          >
            <i className="nc-icon nc-ruler-pencil" />
          </Button>
          <Button
            className="btn-round btn-icon"
            color="danger"
            size="sm"
            style={{ top: "2.5px" }}
            onClick={() => deleteSubgroupPopup(subgroup)}
            outline
          >
            <i className="nc-icon nc-simple-remove" />
          </Button>
        </li>
      );
    }
  }) 
   : 
    <li>Listede şu anda kayıtlı alt grup yok</li>}
</ul>

        </Card>
      </Col>
    </Row>
    </div>
    </>
  );
}

export default CreateGroups;
