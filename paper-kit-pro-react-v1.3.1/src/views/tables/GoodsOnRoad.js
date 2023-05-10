import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader,Modal, ModalHeader, ModalBody, ModalFooter, CardBody, CardTitle, Row, Col, Input, Form, FormGroup, Label, CardFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import ReactTable from 'components/ReactTable/ReactTable.js';
import localforage from 'localforage';
import ReactBSAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCheck, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
const DataTable = () => {
  const [dataTable, setDataTable] = useState([]);
  const [edit, setEdit] = useState({ row: -1, column: '' });
  const [showUploadDiv, setShowUploadDiv] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [date, setDate] = useState(null);
  const [productCode, setProductCode] = useState(null);
  const [productNameTR, setProductNameTR] = useState(null);
  const [productNameIR, setProductNameIR] = useState(null);
  const [weight, setWeight] = useState(null);
  const [truckName, setTruckName] = useState(null);
  const [stock, setStock] = useState(null);
  const [orderAvrg, setOrderAvrg] = useState(null);
  const [orderExp, setOrderExp] = useState(null);
  const [orderHolt, setOrderHolt] = useState(null);
  const [decidedOrder, setDecidedOrder] = useState(null);
  const [goodsOnRoadData, setGoodsOnRoadData] = useState([]);

  const [alert, setAlert] = useState(null);
  const [renderEdit, setRenderEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [dataChanged, setDataChanged] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [editData, setEditData] = useState(null);
  const [oldData, setOldData] = useState(null);

  const [leadTime, setLeadTime] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newTruck, setNewTruck] = useState({
    truck_name: '',
    estimated_order_date: '',
    estimated_arrival_date: '',
  });

  const [waitingTrucksData, setWaitingTrucksData] = useState([]);
 
const [data, setData] = useState(goodsOnRoadData);
const [shouldFetchData, setShouldFetchData] = useState(true);
const [fetchGoodData, setFetchGoodData] = useState(true);
const [editingRow, setEditingRow] = useState(null);
  const [updatedOrder, setUpdatedOrder] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const access_token = await localforage.getItem('access_token');

      const response = await fetch('https://vividstockfish.com/api/goods_on_road/', {
        method: 'GET',
        headers: {

          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(access_token)
        }
      });
      const data = await response.json();
      setDataTable(data);
      console.log(data)
    }
    fetchData();
  }, [dataChanged, renderEdit]);



  const handleEditClick = (row) => {
    console.log(row.values["Product Code"])
    setEditingRow(row.index);
    setProductCode(row.values["Product Code"])
  };

  const handleSaveClick = async () => {
    // Save the updated order value
    console.log(productCode)
    const updatedData = {
      product_code: productCode,
      new_decided_order: updatedOrder,
    };
    const access_token = await localforage.getItem('access_token');
    const response = await fetch('https://vividstockfish.com/api/edit_goods_on_road/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(access_token)
        // Add the appropriate headers for your API (e.g., Authorization)
      },
      body: JSON.stringify(updatedData),
    })


      .then((response) => {
        if (!response.ok) {
          return response.json().then(data => {
            

            errorUpload(data.error);
          });
        }

        else {
          return response.json().then(data => {

            successEdit(data.message);
            setFetchGoodData(true)
            setEditingRow(null);
            setUpdatedOrder(null);
          })

        }
      })
    // Reset the states
    
  };
  
  const handleNewTruckInputChange = (e) => {
    setNewTruck({ ...newTruck, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleNewTruckSubmit = async () => {
    const access_token = await localforage.getItem('access_token');
    const response = await fetch('https://vividstockfish.com/api/add_truck/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(access_token)
        // Add the appropriate headers for your API (e.g., Authorization)
      },
      body: JSON.stringify(newTruck),
    })


      .then((response) => {
        if (!response.ok) {
          return response.json().then(data => {
            console.log(data.error)

            errorUpload(data.error);
          });
        }

        else {
          return response.json().then(data => {

            successEdit(data.message);
            handleShowForm()
          })

        }
      })
  }


  // Y
  const handleShowForm = () => {
    setShowForm((prevState) => !prevState);

  };

  // Function to hide the form
  const handleCancelForm = () => {
    setShowForm(false);
  };
  useEffect(() => {
    const fetchWaitingTrucksData = async () => {
      const access_token = await localforage.getItem('access_token');
      const response = await fetch('https://vividstockfish.com/api/waiting_trucks/', {
        method: 'GET',
        headers: {

          'Authorization': 'Bearer ' + String(access_token)
        },
      });

      const responseData = await response.json();

      console.log(responseData)

      const formattedData = Object.keys(responseData).map((key) => ({
        truck_name: key,
        data: responseData[key],
      }));
      setWaitingTrucksData(formattedData);

    }
    if (shouldFetchData) {
      fetchWaitingTrucksData();
      setShouldFetchData(false);
    

    }
  }, [shouldFetchData]);


  const handleSubmit = async (e) => {
    const access_token = await localforage.getItem('access_token');

    const updatedData = {

      product_code: productCode,

      product_name_tr: productNameTR,
      product_name_ir: productNameIR,
      decided_order: decidedOrder,
      weight: weight,
      truck_name: truckName,







    };
    console.log(updatedData)
    fetch('https://vividstockfish.com/api/approve_products/', {
      method: 'POST',
      body: JSON.stringify(updatedData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(access_token)
      },

    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(data => {


            errorUpload(data.error);
          });
        }

        else {
          return response.json().then(data => {
            setEditData(updatedData);
            successEdit(data.message);
            setShouldFetchData(true); // Add this line
          })

        }
      })

    // Call your Django API to send the updated values here
  };


  const handleMoveToGoodsOnRoad = async (truckData) => {
    try {
      const access_token = await localforage.getItem('access_token');
      const response = await fetch("https://vividstockfish.com/api/approve_waiting/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + String(access_token)
        },
        body: JSON.stringify({ truck_name: truckData.truck_name }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Approved waiting truck:", responseData);

        // Remove the truck from the waitingTrucksData state
        setWaitingTrucksData((prevData) => {
          return prevData.filter((data) => data.truck_name !== truckData.truck_name);
        });

        // Add the approved truck to the goodsOnRoadData state
        setGoodsOnRoadData((prevData) => {
          const newTruckData = {
            truck_name: truckData.truck_name,
            data: truckData.data,
          };
          return [...prevData, newTruckData];
        });

        hideAlert();
        fetchGoodsOnRoadData();
      } else {
        console.error("Failed to approve waiting truck");
      }
    } catch (error) {
      console.error("Error approving waiting truck:", error);
    }
  };


  useEffect(() => {
    const fetchGoodsOnRoadData = async () => {
      const access_token = await localforage.getItem('access_token');
      const response = await fetch('https://vividstockfish.com/api/trucks_on_road/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(access_token),
        },
      });

      const responseData = await response.json();

      const formattedData = Object.keys(responseData).map((key) => ({
        truck_name: key,
        data: responseData[key],
      }));
      setGoodsOnRoadData(formattedData);
    };
    if (fetchGoodData) {
    fetchGoodsOnRoadData();
    setFetchGoodData(false);
    }
  }, [fetchGoodData]);

  const approveTruck = async (truckName) => {
    
       const access_token = await localforage.getItem('access_token');
      const response = await fetch('https://vividstockfish.com/api/approve_arrived_truck/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(access_token),
        },
        body: JSON.stringify({ truck_name: truckName }),
      })
  
      .then((response) => {
        if (!response.ok) {
          return response.json().then(data => {


            errorUpload(data.error);
          });
        }

        else {
          return response.json().then(data => {
            setGoodsOnRoadData((prevData) =>
            prevData.filter((item) => item.truck_name !== truckName)
          );
            successEdit(data.message);
          })

        }
      })
    }

  const handleClick = (row) => {

    setEditData(row);


    setProductCode(row.product_code);
    setProductNameTR(row.product_name_tr);
    setProductNameIR(row.product_name_ir);
    setDecidedOrder(row.decided_order);
    setWeight(row.weight);
    setTruckName(row.truck_name);

    setShowPopup(!showPopup);

  };



  const successEdit = (s) => {

    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Saved!"
        onConfirm={() => {
          hideAlert()
          setShowPopup(false)
        }
        }
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        {s}
      </ReactBSAlert>
    );
    setRenderEdit(true)
  };


  const handleCancel = () => {
    setShowPopup(false);
    setEditData(null)
  };


  useEffect(() => {
    console.log("useEffect called")
    if (editData) {


      setProductCode(editData[0]);
      setProductNameTR(editData[1]);
      setProductNameIR(editData[2]);
      setDecidedOrder(editData[3]);
      setWeight(editData[4]);
      setTruckName(editData[5]);


      setIsUpdated(true)
    }
  }, [editData])

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

  //delete

  const updateMyData = (rowIndex, columnId, value) => {
    setData((oldData) =>
      oldData.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...oldData[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const approve = (truck) => {

    setAlert(

      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => {
          handleMoveToGoodsOnRoad(truck)
        }}
        onCancel={() => {
          hideAlert()
        }}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes!"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
        Are you sure to approve this truck?
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

  const hideAlert = () => {
    setAlert(null);
  };




  return (
    <>
      <div className='content'>
        {alert}
        {showPopup && (
          <div className="popup">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Edit/Decide Order</CardTitle>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <div>

                    <div className="form-group-col">
                      <label>Product Code</label>
                      <FormGroup>
                        <Input
                          disabled
                          type="text"
                          defaultValue={productCode}
                          onChange={(e) => setProductCode(e.target.value)}
                        />
                      </FormGroup>

                      <label>Product Name-TR</label>
                      <FormGroup>
                        <Input
                          disabled
                          type="text"
                          defaultValue={productNameTR}
                          onChange={(e) => setProductNameTR(e.target.value)}
                        />
                      </FormGroup>

                      <label>Product Name-IR</label>
                      <FormGroup>
                        <Input
                          disabled
                          type="text"
                          defaultValue={setProductNameIR}
                          onChange={(e) => setProductNameIR(e.target.value)}
                        />
                      </FormGroup>

                      <label>Decided Order</label>
                      <FormGroup>
                        <Input

                          type="text"
                          defaultValue={decidedOrder}
                          onChange={(e) => setDecidedOrder(e.target.value)}
                        />
                      </FormGroup>

                      <label>Weight</label>
                      <FormGroup>
                        <Input
                          disabled
                          type="text"
                          defaultValue={weight}
                          onChange={(e) => setWeight(e.target.value)}
                        />
                      </FormGroup>

                      <label>Truck</label>
                      <FormGroup>
                        <Input
                          type="text"
                          defaultValue={truckName}
                          onChange={(e) => setTruckName(e.target.value)}
                        />
                      </FormGroup>



                    </div>




                  </div>
                </Form>
              </CardBody>
              <CardFooter>
                <Button className="btn-round" color="success" type="submit" onClick={handleSubmit}>
                  Submit
                </Button>
                <Button className="btn-round" color="danger" type="submit" onClick={handleCancel}>
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        <Card>
          <CardHeader>
            <CardTitle tag="h4">
              Add Truck

              <Button onClick={handleShowForm} color="success" size="sm" className="btn-icon btn-link">
                <i className="fa fa-plus" />
              </Button>

            </CardTitle>
          </CardHeader>
          <CardBody>
            {showForm && (
              <Form>
                <FormGroup>
                  <Label for="truck_name">Truck Name</Label>
                  <Input
                    type="text"
                    name="truck_name"
                    id="truck_name"
                    value={newTruck.truck_name}
                    onChange={handleNewTruckInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="estimated_order_date">Estimated Order Date(YYYY-MM-DD)</Label>
                  <Input
                    type="text"
                    name="estimated_order_date"
                    id="estimated_order_date"
                    value={newTruck.estimated_order_date}
                    onChange={handleNewTruckInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="estimated_arrival_date">Estimated Arrival Date(YYYY-MM-DD)</Label>
                  <Input
                    type="text"
                    name="estimated_arrival_date"
                    id="estimated_arrival_date"
                    value={newTruck.estimated_arrival_date}
                    onChange={handleNewTruckInputChange}
                  />
                </FormGroup>
                <Button  className="btn-round" color="success" type="submit" onClick={handleNewTruckSubmit} >
                  Submit
                </Button>
                <Button className="btn-round" color="danger" type="submit" onClick={handleCancelForm} >
                  Cancel
                </Button>
              </Form>
            )}
          </CardBody>
        </Card>



        <Row>
          <Col md='12'>
            <Card style={{
              borderColor: '#1E90FF',
              borderWidth: '3px',
              borderStyle: 'solid',
              boxShadow: '0 6px 6px rgba(30, 144, 255, 0.2)',
            }}>
              <CardHeader>
                <CardTitle tag="h4" style={{ color: '#1E90FF' }}>Products to Order</CardTitle>
              </CardHeader>
              <CardBody >

                <ReactTable

                  data={dataTable.map((row, key) => ({
                    id: key,
                    product_code: row[0],
                    product_name_tr: row[1],
                    product_name_ir: row[2],
                    decided_order: row[3],
                    weight: row[4],
                    truck_name: row[5],

                    actions: (
                      <div className='actions-left'>
                        <Button
                          disabled={showPopup}
                          onClick={() => {
                            // Enable edit mode

                            { handleClick(row) }


                          }}

                          color='warning'
                          size='sm'
                          className='btn-icon btn-link edit'
                        >
                          <i className='fa fa-edit' />
                        </Button>{' '}

                        <>


                          <Button
                            disabled={showPopup}
                            onClick={() => {

                              warningWithConfirmAndCancelMessage()
                              const rowToDelete = { ...row };
                              const data = {
                                product_code: rowToDelete[0],

                              };
                              setDeleteData(data);
                              console.log(deleteConfirm)


                            }
                            }
                            color="danger"
                            size="sm"
                            className="btn-icon btn-link remove"
                          >
                            <i className="fa fa-times" />
                          </Button>
                        </>
                      </div>
                    ),
                  }))}
                  columns={[

                    { Header: 'Product Code', accessor: 'product_code' },
                    { Header: 'Product Name-TR', accessor: 'product_name_tr' },
                    { Header: 'Product Name-IR', accessor: 'product_name_ir' },
                    { Header: 'Decided Order', accessor: 'decided_order' },
                    { Header: 'Weight', accessor: 'weight' },
                    { Header: 'Truck', accessor: 'truck_name' },




                    {
                      Header: 'Actions', accessor: 'actions', sortable: false,
                      filterable: false
                    },
                  ]}
                  defaultPageSize={10}
                  className='-striped -highlight'
                />
              </CardBody>
            </Card>
          </Col>
        </Row>



        <Card style={{
          borderColor: '#DAA520',
          borderWidth: '3px',
          borderStyle: 'solid',
          boxShadow: '0 6px 6px rgba(255, 215, 0, 0.2)',
        }}>
          <CardHeader>
            <CardTitle tag="h4" style={{ color: '#DAA520' }}>Waiting Trucks</CardTitle>
          </CardHeader>
          <CardBody>

            {waitingTrucksData.length === 0 ? (
              <p>There's no active waiting trucks</p>
            ) : (
              waitingTrucksData.map((truckData, index) => (
                <div
                  className="truck-table-container"
                  key={index}
                  style={{
                    marginBottom: index < waitingTrucksData.length - 1 ? '2rem' : 0,
                    borderBottom:
                      index < waitingTrucksData.length - 1
                        ? '1px solid #dee2e6'
                        : 'none',
                    paddingBottom: index < waitingTrucksData.length - 1 ? '2rem' : 0,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5>{truckData.truck_name}</h5>
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-success cursor-pointer"
                      onClick={() => approve(truckData)}
                    />
                  </div>
                  <ReactTable
                    data={truckData.data.map((row, key) => {
                      const newRow = {};
                      Object.keys(row).forEach((column) => {
                        if (
                          ![
                            'is_ordered',
                            'is_terminated',
                            'is_on_truck',
                            'is_on_road',
                            'is_arrived',
                          ].includes(column)
                        ) {
                          const formattedKey = column
                            .split('_')
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(' ');
                          newRow[formattedKey] = row[column];
                        }
                      });
                      return newRow;
                    })}
                    columns={Object.keys(truckData.data[0] || {})
                      .filter(
                        (key) =>
                          ![
                            'is_ordered',
                            'is_terminated',
                            'is_on_truck',
                            'is_on_road',
                            'is_arrived',
                          ].includes(key),
                      )
                      .map((key) => {
                        const formattedKey = key
                          .split('_')
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(' ');
                        return { Header: formattedKey, accessor: formattedKey };
                      })}
                    defaultPageSize={10}
                    className="-striped -highlight"
                  />
                </div>
              ))

            )}
          </CardBody>
        </Card>

      </div>
      <Row>
        <Col >
        <Card
      style={{
        borderColor: "#32CD32",
        borderWidth: "3px",
        borderStyle: "solid",
        boxShadow: "0 6px 6px rgba(50, 205, 50, 0.2)",
        maxWidth: "97%", // Add a maxWidth property here
    marginLeft: "auto",
    marginRight: "auto",
      }}
    >
      <CardHeader>
        <CardTitle tag="h4" style={{ color: "#32CD32" }}>
          Goods on the Road
        </CardTitle>
      </CardHeader>
      <CardBody>
      {goodsOnRoadData.length === 0 ? (
      <p>There's no truck on the road</p>
    ) : (
      goodsOnRoadData.map((goodsOnRoadTruck, index) => (
        <div
          className="truck-table-container"
          key={index}
          style={{
            marginBottom: index < goodsOnRoadData.length - 1 ? "2rem" : 0,
            borderBottom:
              index < goodsOnRoadData.length - 1
                ? "1px solid #dee2e6"
                : "none",
            paddingBottom: index < goodsOnRoadData.length - 1 ? "2rem" : 0,
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5>{goodsOnRoadTruck.truck_name}</h5>
            <div>
              <FontAwesomeIcon
                icon={faCheck}
                className="text-success cursor-pointer mr-3"
                onClick={() => approveTruck(goodsOnRoadTruck.truck_name)}
              />
            </div>
          </div>
          <ReactTable
            data={goodsOnRoadTruck.data.map((row, key) => {
              const newRow = {};
              Object.keys(row).forEach((column) => {
                if (
                  ![
                    "is_ordered",
                    "is_terminated",
                    "is_on_truck",
                    "is_on_road",
                    "is_arrived",
                  ].includes(column)
                ) {
                  const formattedKey = column
                    .split("_")
                    .map(
                      (word) => word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(" ");
                  newRow[formattedKey] = row[column];
                }
              });
              return newRow;
            })}
            columns={[
              ...Object.keys(goodsOnRoadTruck.data[0] || {})
                .filter(
                  (key) =>
                    ![
                      "is_ordered",
                      "is_terminated",
                      "is_on_truck",
                      "is_on_road",
                      "is_arrived",
                      "decided_order",
                    ].includes(key)
                )
                .map((key) => {
                  const formattedKey = key
                    .split("_")
                    .map(
                      (word) => word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(" ");
                  return { Header: formattedKey, accessor: formattedKey };
                }),
                {
                  Header: "Decided Order",
                  id: "decidedOrder",
                  Cell: ({ row }) =>
                    editingRow === row.index ? (
                      <div>
                        <input
                          type="text"
                          defaultValue={row.original["Decided Order"]}
                          onChange={(e) => setUpdatedOrder(e.target.value)}
                        />
                        <FontAwesomeIcon
                          icon={faSave}
                          className="text-success cursor-pointer ml-2"
                          onClick={handleSaveClick}
                        />
                      </div>
                    ) : (
                      row.original["Decided Order"]
                    ),
                },
                {
                  Header: "",
                  id: "edit",
                  Cell: ({ row }) => (
                    <div>
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="text-warning cursor-pointer"
                        onClick={() => handleEditClick(row)}
                      />
                    </div>
                  ),
                },
              ]}
            defaultPageSize={10}
            className="-striped -highlight"
          />
        </div>
      ))
    )}
    </CardBody>
  </Card>
        </Col>
      </Row>

    </>
  );
};

export default DataTable;
