import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import localforage from 'localforage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

function CreateGroups() {
  const [groupName, setGroupName] = useState("");
  const [subgroupName, setSubgroupName] = useState("");
  const [groupList, setGroupList] = useState([]);
  const [subgroupList, setSubgroupList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);

  const fetchData = async () => {
    const access_token = await localforage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/product_groups/', {
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
    fetch('http://127.0.0.1:8000/api/create_product_group/', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + String(access_token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ group_name: groupName }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        setGroupName("");
        setGroupList([...groupList, data.group]);
        fetchData();  // Move the fetchData call here.
      } else {
        console.error(data.error);
      }
    })
    .catch(error => console.error(error));
  };
  

  const handleCreateSubgroup = async () => {
    if (selectedGroup && subgroupName) {
      const group_code = groupList.find(group => group[1] === selectedGroup)[0];

      const access_token = await localforage.getItem('access_token');
      fetch('http://127.0.0.1:8000/api/create_product_subgroup/', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + String(access_token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ group_code: group_code, subgroup_name: subgroupName })
      })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          setSubgroupName("");
          setSubgroupList([...subgroupList, subgroupName]);
        } else {
          console.error(data.error);
        }
      })
      .catch(error => console.error(error));
    }
  };

  const handleEditGroup = (groupCode) => {
    setEditingGroup(groupCode);
  };

  const handleSaveGroup = async (groupCode, newGroupName) => {
    const access_token = await localforage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/edit_product_group/', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + String(access_token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ group_code: groupCode, new_group_name: newGroupName }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        setEditingGroup(null);
        fetchData();
      } else {
        console.error(data.error);
      }
    })
    .catch(error => console.error(error));
  };

  const handleDeleteGroup = async (groupCode) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      const access_token = await localforage.getItem('access_token');
      fetch('http://127.0.0.1:8000/api/delete_product_group/', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + String(access_token),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ group_code: groupCode }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          fetchData();
        } else {
          console.error(data.error);
        }
      })
      .catch(error => console.error(error));
    }
  };

 

  return (
    <>
    <div className='content'>
    <Row>
      <Col xs="6">
        <Card body>
          <h4>Groups</h4>
          <Button onClick={handleCreateGroup}>Create Group</Button>
          <Form>
            <FormGroup>
              <Label>Group Name</Label>
              <Input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} />
            </FormGroup>
            <Button disabled={!groupName} onClick={handleCreateGroup}>OK</Button>
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
                              onClick={() => handleSaveGroup(group[0])}
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
                              onClick={() => handleDeleteGroup(group[0])}
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
                    <li>There's no current groups in list</li>
                }
              </ul>

        </Card>
      </Col>
      <Col xs="6">
        <Card body>
          <h4>Subgroups</h4>
          <Button onClick={handleCreateSubgroup}>Create Subgroup</Button>
          <Form>
            <FormGroup>
              <Label>Select Group</Label>
              <Input type="select" value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
    {groupList.map((group, index) => (
        group ? <option key={index} value={group[1]}>{group[1]}</option> : null
    ))}
</Input>


            </FormGroup>
            <FormGroup>
              <Label>Subgroup Name</Label>
              <Input type="text" value={subgroupName} onChange={e => setSubgroupName(e.target.value)} />
            </FormGroup>
            <Button disabled={!selectedGroup || !subgroupName} onClick={handleCreateSubgroup}>OK</Button>
          </Form>
          <ul>
          {subgroupList.length > 0 ? 
    subgroupList.map(subgroup => <li key={subgroup}>{subgroup}</li>) : 
    <li>There's no current subgroups in list</li>}
          </ul>
        </Card>
      </Col>
    </Row>
    </div>
    </>
  );
}

export default CreateGroups;
