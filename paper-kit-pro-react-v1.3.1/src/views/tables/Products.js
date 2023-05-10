import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col, Input,Form, FormGroup, Label,CardFooter} from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';
import '../../assets/css/Table.css';
import ReactBSAlert from "react-bootstrap-sweetalert";
import localforage from 'localforage';

const DataTable = () => {
  const [dataTable, setDataTable] = useState([]);
  const [file, setFile] = useState(null);
  const [showUploadDiv, setShowUploadDiv] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [renderEdit, setRenderEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //Edit Variables
  const [group, setGroup] = useState(null);
  const [subgroup, setSubgroup] = useState(null);
  const [feature, setFeature] = useState(null);
  const [productIR, setProductIR] = useState(null);
  const [productTR, setProductTR] = useState(null);
  const [descriptionTR, setDescriptionTR] = useState(null);
  const [descriptionIR, setDescriptionIR] = useState(null);
  const [unit, setUnit] = useState(null);
  const [secondaryUnit, setSecondaryUnit] = useState(null);
  const [weight, setWeight] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [price, setPrice] = useState(null);

  const [oldData, setOldData] = useState(null);

  React.useEffect(() => {
    return function cleanup() {
      var id = window.setTimeout(null, 0);
      while (id--) {
        window.clearTimeout(id);
      }
    };
  }, []);
  useEffect(() => {
    async function fetchData() {
      const access_token = await localforage.getItem('access_token');
      
      const response = await fetch('https://vividstockfish.com/api/products/',{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ String(access_token)
        },
      });
      const data = await response.json();
      setDataTable(data);
      setDataChanged(false);
      setRenderEdit(false)
    }
    fetchData();
  }, [dataChanged,renderEdit]);

  /*
  useEffect(() => {
    console.log(dataTable);
  }, [dataTable]);
*/

  const handleFileInputChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleAddFileClick = () => {
    clearTimeout(timeoutId); // Clear any existing timeout
    setTimeoutId(setTimeout(() => setShowUploadDiv(true), 500));
   
    
  }
  const handleUploadClick = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const access_token = await localforage.getItem('access_token');
    fetch('https://vividstockfish.com/api/add_products/', {
      method: 'POST',
      body: formData,
      
      headers: {
          
        'Authorization': 'Bearer '+ String(access_token)
      },
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(data => {
          console.log(data.error)
          setIsLoading(false);
          errorUpload(data.error);
        });
      }
     
      else{
        return response.json().then(data => {
      setIsLoading(false);
      successUpload(data.message);
      
      fetch('https://vividstockfish.com/api/products/',{
        headers: {
          'Authorization': 'Bearer '+ String(access_token)
        }
      })
        .then((response) => response.json())
        
        .then((data) => setDataTable(data));
        console.log(dataTable)
       
    })
    
    .finally(() => {
      setShowUploadDiv(false);
      
    });
  
  }
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
  const warningWithConfirmAndCancelMessage = () => {
    
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
    console.log(deleteConfirm)
  },[deleteConfirm]);

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
  const successEdit = (s) => {
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

  
    
    useEffect(() => {
      async function deleteFunc() {
      if (deleteConfirm) {
       
        const access_token =  await localforage.getItem('access_token'); 
        fetch(`https://vividstockfish.com/api/delete_products/`, {
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


    const handleClick = (row) => {
     
      setEditData(row);
      setOldData(row);
      
      setGroup(row.group);
  setSubgroup(row.subgroup);
  setFeature(row.feature);
  setProductIR(row.product_code_ir);
  setProductTR(row.product_code_tr);
  setDescriptionTR(row.description_tr);
  setDescriptionIR(row.description_ir);
  setUnit(row.unit);
  setSecondaryUnit(row.unit_secondary);
  setWeight(row.weight);
  setCurrency(row.currency);
  setPrice(row.price);
      setShowPopup(!showPopup);
      console.log(row)
    };


    const handleSubmit =async (e) => {
      const access_token =  await localforage.getItem('access_token'); 
      
      const updatedData = {
        new_group:group,
        new_subgroup:subgroup,
        new_feature:feature,
        new_product_code_ir:productIR,
        new_product_code_tr:productTR,
        new_description_tr:descriptionTR,
        new_description_ir:descriptionIR,
        new_unit:unit,
        new_unit_secondary:secondaryUnit,
        new_weight:weight,
        new_currency:currency,
        new_price:price,

        old_group:oldData[0],
        old_subgroup:oldData[1],
        old_feature:oldData[2],
        old_product_code_ir:oldData[3],
        old_product_code_tr:oldData[4],
        old_description_tr:oldData[5],
        old_description_ir:oldData[6],
        old_unit:oldData[7],
        old_unit_secondary:oldData[8],
        old_weight:oldData[9],
        old_currency:oldData[10],
        old_price:oldData[11],
      };
      console.log(updatedData)
      fetch('https://vividstockfish.com/api/edit_products/', {
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
          console.log(data.error)
          
          errorUpload(data.error);
        });
      }
     
      else{
        return response.json().then(data => {
          setEditData(updatedData);
          successEdit(data.message);
        })
    
        }
      })
      // Call your Django API to send the updated values here
    };

    const handleCancel = () => {
      setShowPopup(false);
      setEditData(null)
    };

    useEffect(() => {
      console.log("useEffect called")
      if(editData){
        
          setGroup(editData[0]);
          setSubgroup(editData[1]);
          setFeature(editData[2]);
          setProductIR(editData[3]);
          setProductTR(editData[4]);
          setDescriptionTR(editData[5]);
          setDescriptionIR(editData[6]);
          setUnit(editData[7]);
          setSecondaryUnit(editData[8]);
          setWeight(editData[9]);
          setCurrency(editData[10]);
          setPrice(editData[11]);
          setIsUpdated(true)
      }
    }, [editData])


    async function handleExportClick() {
      // Retrieve the access token from localForage
      const access_token = await localforage.getItem('access_token');
    
      // Make an AJAX request to the backend to download the CSV file
      const response = await fetch('https://vividstockfish.com/api/export_products/', {
        headers: {
          'Authorization': 'Bearer '+ String(access_token)
        },
      });
    
      // Parse the JSON response
      const data = await response.json();
    
      // Extract the filename and content from the JSON response
      const filename = data.filename;
      const base64Content = data.content;
    
      // Convert the base64 content to a Blob
      const binaryContent = atob(base64Content);
      const byteNumbers = new Array(binaryContent.length);
      for (let i = 0; i < binaryContent.length; i++) {
        byteNumbers[i] = binaryContent.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
      // Create a link to download the file and simulate a click to download it
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    }
    
  return (
    <>
      <div className='content'>
      {alert}

    {/* Pop Up */}
      {showPopup && isUpdated &&(
       <div className="popup">
      <Card>
            <CardHeader>
              <CardTitle tag="h4">Edit Product</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
              <div>
        <div className="form-group-col">
          <label>Group</label>
          <FormGroup>
            <Input
              name="group"
              type="text"
              defaultValue={group}
              onChange={(e) => setGroup(e.target.value)}
            />
          </FormGroup>

          <label>Subgroup</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={subgroup}
              onChange={(e) => setSubgroup(e.target.value)}
            />
          </FormGroup>

          <label>Feature</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={feature}
              onChange={(e) => setFeature(e.target.value)}
            />
          </FormGroup>

          <label>Product Number(IR)</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={productIR}
              onChange={(e) => setProductIR(e.target.value)}
            />
          </FormGroup>

          <label>Product Number(TR)</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={productTR}
              onChange={(e) => setProductTR(e.target.value)}
            />
          </FormGroup>

          <label>Currency</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </FormGroup>
        </div>

        <div className="form-group-col">
          <label>Description(TR)</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={descriptionTR}
              onChange={(e) => setDescriptionTR(e.target.value)}
            />
          </FormGroup>

          <label>Description(IR)</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={descriptionIR}
              onChange={(e) => setDescriptionIR(e.target.value)}
            />
          </FormGroup>

          <label>Unit</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </FormGroup>

          <label>Secondary Unit</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={secondaryUnit}
              onChange={(e) => setSecondaryUnit(e.target.value)}
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

          <label>Price</label>
          <FormGroup>
            <Input
              type="text"
              defaultValue={price}
              onChange={(e) => setPrice(e.target.value)}
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
<Card>
  <CardHeader>
    <CardTitle tag='h4'>PRODUCTS</CardTitle>
  </CardHeader>
  <CardBody>
    <div className="upload-container">
      {!showUploadDiv && (
        <div className="d-flex justify-content-between align-items-center">
          <Button className="my-button-class" color="primary" onClick={handleAddFileClick}>
            <i className="fa fa-plus-circle mr-1"></i>
            Add File
          </Button>
          <Button className="my-button-class" color="primary" onClick={handleExportClick}>
            <i className="fa fa-download mr-1"></i>
            Export
          </Button>
        </div>
      )}
      {showUploadDiv && (
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <Button className="my-button-class" color="primary" onClick={handleAddFileClick}>
              <i className="fa fa-plus-circle mr-1"></i>
              Add File
            </Button>
            <Button className="my-button-class" color="primary" onClick={handleExportClick}>
              <i className="fa fa-download mr-1"></i>
              Export
            </Button>
          </div>
          <div className="mt-3">
            <input type="file" className="custom-file-upload" onChange={handleFileInputChange} />
            <Button color="primary" className="btn-upload" onClick={handleUploadClick} disabled={!file} active={!file}>
              Upload
            </Button>
            <div className="spinner-container">
              {isLoading && <div className="loading-spinner"></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  </CardBody>
</Card>
        <Row>
          <Col
          >
            <Card >
              
              <CardBody >

            
                <ReactTable
                  data={dataTable.map((row,index) => ({
                    id: row.id,
                    group: row[0],
                    subgroup: row[1],
                    feature: row[2],
                    product_code_ir: row[3],
                    product_code_tr: row[4],
                    description_tr: row[5],
                    description_ir: row[6],
                    unit: row[7],
                    unit_secondary: row[8],
                    weight: row[9],
                    currency: row[10],
                    price:row[11],

                    actions: (
                      <div className='actions-left'>
                       
                         <Button
                          disabled={showPopup}
                          onClick={() => {
                            // Enable edit mode
                            
                           {handleClick(row)}
                           
                          
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
                                product_code_ir: rowToDelete[3],

                              };
                              setDeleteData(data);
                              console.log(deleteConfirm)
                              /*
                              if (deleteConfirm) {
                                const updatedDataTable = dataTable.find((o) => o.id == row.id);
                                //console.log(updatedDataTable[0]);
                                const data = {
                                  no: updatedDataTable[0],
                                  good_code: updatedDataTable[10],
                                  original_output_value: updatedDataTable[14],
                                };
                                setDeleteData(data);
                                //console.log(data);
                                fetch(`https://vividstockfish.com/api/delete_sales/`, {
                                  method: "POST",
                                  body: new URLSearchParams(data),
                                }).then(() => {
                                  //  console.log("row id:", row.id);
                                  //console.log("dataTable:", dataTable);
                                  const filteredDataTable = dataTable.filter(
                                    (o) => Number(o.id) !== Number(row.id)
                                  );
                                  //  console.log(filteredDataTable);
                                  setDataTable(filteredDataTable);
                                  setDataChanged(!dataChanged);
                                });

                              }
                              */

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
                    {
                      Header: 'Group',
                      accessor: 'group',


                    },
                    {
                      Header: 'Subgroup',
                      accessor:  'subgroup'
                    },
                    {
                      Header: 'Feature',
                      accessor: 'feature'
                    },
                  
                    {
                      Header: 'Product Number(IR)',
                      accessor: 'product_code_ir'
                    },
                    {
                      Header: 'Product Number(TR)',
                      accessor: 'product_code_tr'
                    },
                    {
                      Header: 'Description(TR)',
                      accessor: 'description_tr'
                    },
                    {
                      Header: 'Description(IR)',
                      accessor: 'description_ir'
                    },
                    {
                      Header: 'Unit',
                      accessor: 'unit'
                    },
                    {
                      Header: 'Secondary Unit',
                      accessor: 'unit_secondary'
                    },
                    {
                      Header: 'Weight',
                      accessor: 'weight'
                    },
                    
                    {
                      Header: 'Currency',
                      accessor: 'currency'
                    },
                    {
                      Header: 'Price',
                      accessor: 'price'
                    },
                    {
                      Header: 'Actions',
                      accessor: 'actions',
                      sortable: false,
                      filterable: false,
                     
                      
                    }
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
