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
import React, { useState, useEffect } from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Label,


} from "reactstrap";
import Switch from "react-bootstrap-switch";
import '../../assets/css/Table.css';
import ReactBSAlert from "react-bootstrap-sweetalert";
import localforage from 'localforage';
import ReactTable from 'components/ReactTable/ReactTable.js';

function UserProfile() {

  const [salers, setSalers] = useState([]);
  const [salersWholeData, setSalersWholeData] = useState([]);
  const [selectedSaler, setSelectedSaler] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSalerName, setNewSalerName] = useState("");
  const [newSalerStatus, setNewSalerStatus] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});

  const [alert, setAlert] = useState(null);

  const [isActive, setIsActive] = useState("");
  const [activity, setActivity] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [newSalerType, setNewSalerType] = useState("active");
  const [salerTableData, setSalerTableData] = useState([]);

  const handleSelectMember = async (member) => {

    setSelectedSaler(member);
    const saler_id = {
      id: member
    };
    console.log(saler_id)

    const access_token = await localforage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/salers_card/', {
      method: 'POST',
      body: JSON.stringify(saler_id),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(access_token)
      },
    })
      .then(response => response.json())

      .then((data) => {

        console.log(data);

        setSalersWholeData(data)
        console.log(salersWholeData)
        setIsSelected(true)
      })


  };

  useEffect(() => {
    if (salersWholeData) {
      // Execute the code you want to run when salersWholeData is changed.
      console.log('salersWholeData has changed:', salersWholeData);
    }
  }, [salersWholeData]);

  const handleAddSaler = async () => {
    const access_token = await localforage.getItem('access_token');
    const newSaler = {
      name: newSalerName,
      job_start_date: newSalerStatus,
      saler_type: newSalerType,
    };
    console.log(newSaler)
    fetch("http://127.0.0.1:8000/api/add_salers/", {
      method: "POST",
      body: JSON.stringify(newSaler),

      headers: {
        'Authorization': 'Bearer ' + String(access_token)
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(data => {
            console.log(data.error)
            errorUpload(data.error);

          });
        } else {
          return response.json().then(data => {
            handleSalesDataChange();
            successAdd();
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };



  async function fetchSalersData() {

    const access_token = await localforage.getItem('access_token');
    console.log(access_token)
    fetch('http://127.0.0.1:8000/api/collapsed_salers/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(access_token)
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setSalers({
          active_salers_list: data.active_salers_list,
          passive_salers_list: data.passive_salers_list,
        });

      })
      .catch(error => console.log(error));
  }

  useEffect(() => {
    fetchSalersData();
  }, []);


  const fetchSalerTableData = async () => {
    const access_token = await localforage.getItem('access_token');
    try {
      const response = await fetch("http://127.0.0.1:8000/api/salers_table/", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(access_token)
        },
      });
      const data = await response.json();
      console.log(data)
      setSalerTableData(data);
    } catch (error) {
      console.error("Error fetching saler table data:", error);
    }
  };
  // Whenever sales data is updated, call the fetchSalersData function
  function handleSalesDataChange() {
    // update sales data
    fetchSalersData();
  }

  useEffect(() => {
    fetchSalerTableData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
  
    // Check if the field requires a float value
    const floatFields = [
      "experience_rating",
      "monthly_total_sales_rating",
      "receipment_rating",
      "manager_performance_rating",
    ];
  
    if (floatFields.includes(name)) {
      const newValue = parseFloat(value);
  
      // Update the formData state
      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
  
      // Update the salersWholeData state
      setSalersWholeData((prevSalersWholeData) => ({
        ...prevSalersWholeData,
        [name]: newValue,
      }));
    } else {
      // Update the formData state
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  
      // Update the salersWholeData state
      setSalersWholeData((prevSalersWholeData) => ({
        ...prevSalersWholeData,
        [name]: value,
      }));
    }
    console.log('Updated formData:', formData);
  };
  
  

  const handleSave = (staffId) => {
    // Create an object with the new data
    console.log(isActive)
    if (isActive === "") {
      setIsActive((prevIsActive) => {
        // If the previous value is empty, set it to salersWholeData["is_active"]
        return prevIsActive !== "" ? prevIsActive : salersWholeData["is_active"];
      });
    }
  
    // Use the current value of isActive state
    const currentIsActive = isActive !== "" ? isActive : salersWholeData["is_active"];
    // Update the formData with the latest values
    const newData = {
      ...salersWholeData,
      ...formData,
      is_active: currentIsActive,
    };

    

    
    editSalers()
    async function editSalers() {

      const all_data = {
        new_data: newData,
        old_data: salersWholeData
      }
      const access_token = await localforage.getItem('access_token');
      fetch('http://127.0.0.1:8000/api/edit_salers/', {
        method: "POST",
        body: JSON.stringify(all_data),

        headers: {
          'Authorization': 'Bearer ' + String(access_token)
        },
      })
      
      .then((response) => {
        if (!response.ok) {
          return response.json().then(data => {
            
            errorUpload(data.error);

          });
        } else {
          return response.json().then(data => {
           
            
            setSalersWholeData(newData);
          
            successAdd();
          });
        }
      })
      
      
    }

    
    console.log('New data:', newData);
    console.log('Old data:', salersWholeData);

  };

  //delete
  const warningWithConfirmAndCancelMessage = (id) => {

    setAlert(

      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => {
          handleDeleteSaler(id)
          successDelete()
        }}
        onCancel={() => {

          hideAlert()
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
  const handleDeleteSaler = async (id) => {
    // Delete the saler with the given id
    console.log(id)
    const delete_id = {
      id: id
    }
    const access_token = await localforage.getItem('access_token');
    fetch("http://127.0.0.1:8000/api/delete_saler/", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(access_token)
      },
      body: JSON.stringify(delete_id),


    })
      .then((response) => {
        response.json()

        successDelete();
        fetchSalersData();
      })





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


  useEffect(() => {
    // Create a copy of the original data to use as default values
    setOriginalData(salersWholeData);
    setActivity(salersWholeData["is_active"])
    console.log(activity)
    setFormData(salersWholeData);
  }, [salersWholeData]);

  const successAdd = () => {
    console.log("success")

    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Saved!"
        onConfirm={() => {

          hideAlert()
          setShowAddForm(false)
        }}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        Your saler has been successfully saved!
      </ReactBSAlert>
    );
  }


  const successDelete = () => {
    console.log("success")

    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Deleted!"
        onConfirm={() =>
          hideAlert()
        }
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        Your saler has been successfully deleted!
      </ReactBSAlert>
    );
  }

  const hideAlert = () => {
    setAlert(null);
  };

  const handleSwitchChange = (checked) => {
    setIsSwitchOn(checked);
  };

  return (
    <>
      <div className="content">
        {alert}
        <Row>
          <Col md="4">

            <Card>
              <CardHeader>
                <CardTitle tag="h4">Salers</CardTitle>
              </CardHeader>
              <CardBody>
                <ul className="list-unstyled team-members">

                  {salers && salers.active_salers_list && (
                    <>
                      <h6 className="subheader">Active</h6>
                      {salers.active_salers_list.map((saler) => (
                        <li key={saler[0]}>
                          <div className="mb-3">
                            <Row className="align-items-center" style={{ marginBottom: "10px" }}>
                              <Col md="1" xs="1" className="d-flex justify-content-center">
                                <div
                                  style={{
                                    backgroundColor: saler[2] ? "green" : "red",
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                  }}
                                />
                              </Col>
                              <Col md="7" xs="7" className="d-flex align-items-center" style={{ marginRight: "10px" }}>
                                <span style={{ fontWeight: "bold" }}>{saler[1].toUpperCase()}</span>{" "}
                                <br />
                                <span className="text-muted">
                                  {saler[2] ? (
                                    <small style={{ marginLeft: "15px" }}>active</small>
                                  ) : (
                                    <small style={{ marginLeft: "15px" }}>inactive</small>
                                  )}
                                </span>
                              </Col>
                              <Col
                                className="text-left d-flex justify-content-center"
                                md="3"
                                xs="3"
                                style={{ marginBottom: "3px", marginTop: "3px", paddingBottom: "5px" }}
                              >
                                <FormGroup check>
                                  <Label check>
                                    <Input
                                      type="checkbox"
                                      checked={selectedSaler === saler[0]}
                                      onChange={() => handleSelectMember(saler[0])}
                                    />
                                    <span className="form-check-sign" />
                                  </Label>
                                </FormGroup>
                                <Button
                                  className="btn-round btn-icon"
                                  color="danger"
                                  size="sm"
                                  style={{ top: "2.5px" }}
                                  onClick={() => warningWithConfirmAndCancelMessage(saler[0])}
                                  outline
                                >
                                  <i className="nc-icon nc-simple-remove" />
                                </Button>
                              </Col>
                            </Row>


                          </div>

                        </li>
                      ))}
                    </>
                  )}

                  {salers && salers.passive_salers_list && (
                    <>
                      <h6 className="subheader">Passive</h6>
                      {salers.passive_salers_list.map((saler) => (
                        <li key={saler[0]}>
                          <div className="mb-3">
                            <Row className="align-items-center" style={{ marginBottom: "10px" }}>
                              <Col md="1" xs="1" className="d-flex justify-content-center">
                                <div
                                  style={{
                                    backgroundColor: saler[2] ? "green" : "red",
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                  }}
                                />
                              </Col>
                              <Col md="7" xs="7" className="d-flex align-items-center" style={{ marginRight: "10px" }}>
                                <span style={{ fontWeight: "bold" }}>{saler[1].toUpperCase()}</span>{" "}
                                <br />
                                <span className="text-muted">
                                  {saler[2] ? (
                                    <small style={{ marginLeft: "15px" }}>active</small>
                                  ) : (
                                    <small style={{ marginLeft: "15px" }}>inactive</small>
                                  )}
                                </span>
                              </Col>
                              <Col
                                className="text-left d-flex justify-content-center"
                                md="3"
                                xs="3"
                                style={{ marginBottom: "3px", marginTop: "3px", paddingBottom: "5px" }}
                              >
                                <FormGroup check>
                                  <Label check>
                                    <Input
                                      type="checkbox"
                                      checked={selectedSaler === saler[0]}
                                      onChange={() => handleSelectMember(saler[0])}
                                    />
                                    <span className="form-check-sign" />
                                  </Label>
                                </FormGroup>
                                <Button
                                  className="btn-round btn-icon"
                                  color="danger"
                                  size="sm"
                                  style={{ top: "2.5px" }}
                                  onClick={() => warningWithConfirmAndCancelMessage(saler[0])}
                                  outline
                                >
                                  <i className="nc-icon nc-simple-remove" />
                                </Button>
                              </Col>
                            </Row>


                          </div>

                        </li>
                      ))}

                    </>
                  )}
                  <li>
                    <Row className="text-left align-items-center" >
                      <Col md="2" xs="2">

                        <Button
                          className="btn-round"
                          color="success"
                          onClick={() => setShowAddForm(true)}
                          outline
                        >
                          <i className="nc-icon nc-simple-add" />
                        </Button>

                      </Col>
                      <Col md="7" xs="7">
                        Add New Saler
                      </Col>
                    </Row>

                  </li>
                  {showAddForm && (
                    <li>
                      <Row>
                        <Col md="7" xs="7">
                          <FormGroup>
                            <Label for="newSalerName">Name</Label>
                            <Input
                              type="text"
                              id="newSalerName"
                              value={newSalerName}
                              onChange={(e) => setNewSalerName(e.target.value)}
                            />
                          </FormGroup>
                          <FormGroup>
                            <Label for="newSalerStatus">Job Start Date (YYYY-MM-DD)</Label>
                            <Input
                              type="text"
                              id="newSalerStatus"
                              
                              value={newSalerStatus}
                              onChange={(e) => setNewSalerStatus(e.target.value)}
                            />
                          </FormGroup>
                          {/* Add new FormGroup for the dropdown */}
                          <FormGroup>
                            <Label for="newSalerType">Saler Type</Label>
                            <Input
                              type="select"
                              id="newSalerType"
                              value={newSalerType}
                              onChange={(e) => setNewSalerType(e.target.value)}
                            >
                              <option value="active">Active</option>
                              <option value="passive">Passive</option>
                            </Input>
                          </FormGroup>
                          <Button className="btn-round" color="success" type="submit" onClick={handleAddSaler} disabled={!newSalerName || !newSalerStatus}>
                            Save
                          </Button>{" "}
                          <Button className="btn-round" color="danger" type="submit" onClick={() => setShowAddForm(false)}>
                            Cancel
                          </Button>
                        </Col>
                      </Row>
                    </li>
                  )}

                </ul>
              </CardBody>
            </Card>
          </Col>


          <Col md="8">
            <Card>
              <CardHeader >
                <h5 className="title" style={{ textTransform: "uppercase" }}>
                  {salersWholeData["name"]}
                </h5>
                <small className="text-muted" 
                 style={{ fontSize: "1.1em", fontWeight: "bold" }}>
    {salersWholeData["active_or_passive"] === "Active" ? "Active Saler" : "Passive Saler"}
  </small>

              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col>
                      <FormGroup>
                        <label>Job Start Date</label>
                        <Input
                          defaultValue={salersWholeData["job_start_date"]}
                          name="job_start_date"
                          onChange={handleInputChange}
                          placeholder="Date"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <label>Activity</label>
                        <br></br>
                        <Input
  name="activity"
  type="select"
  value={salersWholeData["is_active"] ? "Active" : "Inactive"}
  onChange={(e) => {
    const value = e.target.value === "Active";
    setIsActive(value);
    setSalersWholeData({ ...salersWholeData, is_active: value });
  }}
>
  <option value="Active">Active</option>
  <option value="Inactive">Inactive</option>
</Input>




                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Experience Rating</label>
                        <Input
                          name="experience_rating"
                          defaultValue={salersWholeData["experience_rating"]}
                          onChange={handleInputChange}
                          placeholder="Exp. Rating"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <label>Monthly Total Sales Rating</label>
                        <Input
                          name="monthly_total_sales_rating"
                          defaultValue={salersWholeData["monthly_total_sales_rating"]}
                          onChange={handleInputChange}
                          placeholder="Mont. Tot. Sales Rating"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Receipment Rating</label>
                        <Input
                          name="receipment_rating"
                          defaultValue={salersWholeData["receipment_rating"]}
                          onChange={handleInputChange}
                          placeholder="Receipment Rating"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>M. Performance Rating</label>
                        <Input
                          name="manager_performance_rating"
                          defaultValue={salersWholeData["manager_performance_rating"]}
                          onChange={handleInputChange}
                          placeholder="M.P.R"
                          type="number"
                          step="0.01"
                        />

                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button className="btn-round" color="success" type="submit"  disabled={!isSelected} onClick={() => handleSave(salersWholeData.id)}>Save</Button>
              </CardFooter>
            </Card>
          

        
          
            <Card>
              <CardHeader >
                <h5 className="title" >
                  SALERS
                </h5>

              </CardHeader>
              <CardBody>



                <ReactTable
                  data={salerTableData.map((row) => ({
                    id: row[0],
                    name: row[1],
                    job_start_date: row[2],
                    manager_performance_rating: row[3],
                    experience_rating: row[4],
                    monthly_total_sales_rating: row[5],
                    receipment_rating: row[6],
                    is_active: row[7],
                    is_active_saler: row[8],
                    is_passivee_saler: row[9],
                  }))}
                  columns={[
                    {
                      Header: "ID",
                      accessor: "id",
                    },
                    {
                      Header: "Name",
                      accessor: "name",
                    },
                    {
                      Header: "Job Start Date",
                      accessor: "job_start_date",
                    },
                    {
                      Header: "M. Performance Rating",
                      accessor: "manager_performance_rating",
                    },
                    {
                      Header: "Experience Rating",
                      accessor: "experience_rating",
                    },
                    {
                      Header: "Monthly Total Sales Rating",
                      accessor: "monthly_total_sales_rating",
                    },
                    {
                      Header: "Receipment Rating",
                      accessor: "receipment_rating",
                    },
                    {
                      Header: "Is Active",
                      accessor: "is_active",
                      Cell: ({ value }) => (value ? "Active" : "Inactive"),
                    },
                    {
                      Header: "Is Active Saler",
                      accessor: "is_active_saler",
                      Cell: ({ value }) => (value ? "Yes" : "No"),
                    },
                    {
                      Header: "Is Passive Saler",
                      accessor: "is_passivee_saler",
                      Cell: ({ value }) => (value ? "Yes" : "No"),
                    },
                  ]}
                  defaultPageSize={10}
                  className="-striped -highlight"
                />

              </CardBody>

            </Card>
            </Col>
        </Row>
        
      </div>
    </>
  );
}

export default UserProfile;
