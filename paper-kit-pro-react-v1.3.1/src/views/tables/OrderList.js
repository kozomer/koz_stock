import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col, Input,Form, FormGroup, Label,CardFooter} from 'reactstrap';
import  {Link} from 'react-router-dom';
import ReactTable from 'components/ReactTable/ReactTable.js';
import localforage from 'localforage';
import ReactBSAlert from "react-bootstrap-sweetalert";
const DataTable = () => {
  const [dataTable, setDataTable] = useState([]);
  const [file, setFile] = useState(null);
  const [showUploadDiv, setShowUploadDiv] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [date, setDate] = useState(null);
  const [productCode, setProductCode] = useState(null);
  const [productTitle, setProductTitle] = useState(null);
  const [weight, setWeight] = useState(null);
  const [avrgSale, setAvrgSale] = useState(null);
  const [stock, setStock] = useState(null);
  const [orderAvrg, setOrderAvrg] = useState(null);
  const [orderExp, setOrderExp] = useState(null);
  const [orderHolt, setOrderHolt] = useState(null);
  const [decidedOrder, setDecidedOrder] = useState(null);
  const [id, setID] = useState(null);

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

  const [serviceLevel, setServiceLevel] = useState('');
  
  useEffect(() => {
    async function fetchData() {
      const access_token = await localforage.getItem('access_token'); 
      
      const response = await fetch('http://127.0.0.1:8000/api/order_list/',{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ String(access_token)
        }});
      const data = await response.json();
      setDataTable(data);
      console.log(data)
    }
    fetchData();
  }, [dataChanged,renderEdit]);


  



useEffect(() => {
  if ( leadTime && serviceLevel ) {
    
    setSaveDisabled(false);
  } else {
    setSaveDisabled(true);
  }
}, [ leadTime, serviceLevel]);
  
  
  const handleClick = (row,key) => {
     
    setEditData(row);
    
    setID(row.id)
    setDate(row.current_date)

    setProductCode(row.product_code);
    setWeight(row.weight);
    setAvrgSale(row.average_sale);
    setStock(row.current_stock);
    setOrderAvrg(row.order_avrg);
    setOrderExp(row.order_exp);
    setOrderHolt(row.orderHolt);
    setDecidedOrder(row.decided_order);
    setShowPopup(!showPopup);
   
  };
  const handleSubmit = async (e) => {
    const access_token = await localforage.getItem('access_token'); 
   
    const updatedData = {
      id:id,
      current_date:date,
      product_code:productCode,
      weight:weight,
      average_sale:avrgSale,
      current_stock: stock,
      order_avrg: orderAvrg,
      order_exp: orderExp,
      order_holt: orderHolt,
      decided_order: decidedOrder
     
      

      
      
      
    };
   
    fetch('http://127.0.0.1:8000/api/edit_order_list/', {
    method: 'POST',
    body: JSON.stringify(updatedData),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ String(access_token)
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
        successEdit(data.message)
      })

    }
  })

  
  

    // Call your Django API to send the updated values here
  };
  const successEdit = (s) => {
    console.log("edit success")
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Saved!"
        onConfirm={() => {
          hideAlert()
          setShowPopup(false)}
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
  const successUpload = (s) => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Uploaded!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        {s}
      </ReactBSAlert>
    );
  };


  const handleCancel = () => {
    setShowPopup(false);
    setEditData(null)
  };
  
  
  useEffect(() => {
    console.log("useEffect called")
    if(editData){
      setID(editData[0])
      setDate(editData[1]);
      setProductCode(editData[2]);
      setWeight(editData[3]);
      setAvrgSale(editData[4]);
      setStock(editData[5]);
      setOrderAvrg(editData[6]);
      setOrderExp(editData[7]);
      setOrderHolt(editData[8]);
      setDecidedOrder(editData[9])
       
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
  


  const warningWithConfirmAndCancelMessage = () => {
    console.log("sadsads"),
    setAlert(
      
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() =>{ 
        setDeleteConfirm(true);
        successDelete()}}
        onCancel={() => {
          setDeleteConfirm(false);
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

      useEffect(() => {
        async function deleteFunc() {
        if (deleteConfirm) {
         console.log("delete")
         const access_token =  await localforage.getItem('access_token'); 
          fetch(`http://127.0.0.1:8000/delete_warehouse/`, {
            method: "POST",
            body: new URLSearchParams(deleteData),
            headers: {
             
              'Authorization': 'Bearer '+ String(access_token)
            }
          })
            setDataChanged(!dataChanged);
         
          setDeleteConfirm(false);
        }
     
    }
    deleteFunc()
    }, [deleteConfirm]);

    
    
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
          <label>Date</label>
          <FormGroup>
            <Input
              
              type="text"
              defaultValue={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormGroup>

          <label>Product Code</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={productCode}
              onChange={(e) => setProductCode(e.target.value)}
            />
          </FormGroup>

          <label>Weight</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </FormGroup>

          <label>Average Sale</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={avrgSale}
              onChange={(e) => setAvrgSale(e.target.value)}
            />
          </FormGroup>

          <label>Current Stock</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </FormGroup>

          <label>Order by Avrg.</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={orderAvrg}
              onChange={(e) => setOrderAvrg(e.target.value)}
            />
          </FormGroup>

          <label>Order by Exp.</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={orderExp}
              onChange={(e) => setOrderExp(e.target.value)}
            />
          </FormGroup>

          <label>Order by Holt</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={orderHolt}
              onChange={(e) => setOrderHolt(e.target.value)}
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
          
          </div>
         
        
          
        
        </div>
              </Form>
            </CardBody>
              <CardFooter>
                <Button className="btn-round" color="success" type="submit" onClick={handleSubmit}>
                  Submit
                </Button>
                <Button className="btn-round" color="danger" type="submit"  onClick={handleCancel}>
                  Cancel
                </Button>
              </CardFooter>
            </Card>
            </div>
)}


{/* 
  <CardHeader>
    <CardTitle tag='h4'>ORDER LIST</CardTitle>
  </CardHeader>
  <CardBody>
    <Row>
  <Col md="4">
            <Label for="leadTime">Lead Time:</Label>
            <Input
              type="number"
              name="leadTime"
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
            />
          </Col>
          <Col md="4">
            <Label for="serviceLevel">Service Level(must 0.00 - 1.00):</Label>
            <Input
              type="number"
              name="serviceLevel"
              value={serviceLevel}
              min="0"
              max="1"
              step="0.01"
              onChange={(e) => setServiceLevel(e.target.value)}
            />
          </Col>
          <Col md="4" className="text-center">
            <Button color="primary" className="btn-upload" onClick={handleSave} disabled={saveDisabled}>
              SHOW RESULTS
            </Button>
          </Col>
          </Row>
  </CardBody>
</Card>
*/}

        <Row>
          <Col md='12'>
            <Card>
            <CardHeader>
    <CardTitle tag='h4'>ORDER LIST</CardTitle>
  </CardHeader>
              <CardBody>
             
                <ReactTable
                  data={dataTable.map((row, key) => ({
                    id: row[0],
                    current_date: row[1],
                    product_code: row[2],
                    weight: row[3],
                    average_sale: row[4],
                    current_stock: row[5],
                    order_avrg: row[6],
                    order_exp: row[7],
                    order_holt: row[8],

                    decided_order: row[9],
                    actions: (
                      <div className='actions-left'>
                         <Button
                          disabled={showPopup}
                          onClick={() => {
                            // Enable edit mode
                            
                           {handleClick(row,key)}
                           
                          
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
                               const rowToDelete = {...row};
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
                    { Header: 'Order Date', accessor: 'current_date' },
                    { Header: 'Product Code', accessor: 'product_code',
                    Cell: ({ value }) => (
                      <Link to={`rop/${value}`}>{value}</Link>
                    ), },
                    { Header: 'Weight', accessor: 'weight' },
                    { Header: 'Average Sale', accessor: 'average_sale' },
                    { Header: 'Current Stock', accessor: 'current_stock' },
                    { Header: 'Order by Avrg.', accessor: 'order_avrg' },
                    { Header: 'Order by Exp.', accessor: 'order_exp' },
                    { Header: 'Order by Holt', accessor: 'order_holt' },
                    
                   
                    { Header: 'Decided Order', accessor: 'decided_order' },
                    
                    { Header: 'Actions', accessor: 'actions' ,sortable: false,
                    filterable: false },
                  ]}
                  defaultPageSize={10}
                  className='-striped -highlight'
                  />
                  </CardBody>
                  </Card>
                  </Col>
                  </Row>
                  </div>
                  </>
                  );
                  };
                  
                  export default DataTable;
