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
  const [productCode, setProductCode] = useState(null);
  const [barcode, setBarcode] = useState(null);
  const [group, setGroup] = useState(null);
  const [subgroup, setSubgroup] = useState(null);
  const [brand, setBrand] = useState(null);
  const [serialNumber, setSerialNumber] = useState(null);
  const [model, setModel] = useState(null);
  const [description, setDescription] = useState(null);
  const [unit, setUnit] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [supplierContact, setSupplierContact] = useState(null);

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
      
      const response = await fetch('http://127.0.0.1:8000/api/products/',{
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
    fetch('http://127.0.0.1:8000/api/add_products/', {
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
      
      fetch('http://127.0.0.1:8000/api/products/',{
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
        fetch(`http://127.0.0.1:8000/api/delete_products/`, {
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
      setProductCode(row.product_code);
      setBarcode(row.barcode);
      setGroup(row.group);
      setSubgroup(row.subgroup);
      setBrand(row.brand);
      setSerialNumber(row.serial_number);
      setModel(row.model);
      setDescription(row.description);
      setUnit(row.unit);
      setSupplier(row.supplier);
      setSupplierContact(row.supplier_contact);
      setShowPopup(!showPopup);
      console.log(row)
    };


    const handleSubmit =async (e) => {
      const access_token =  await localforage.getItem('access_token'); 
      
      const updatedData = {
        new_product_code: product_code,
        new_barcode: barcode,
        new_group: group,
        new_subgroup: subgroup,
        new_brand: brand,
        new_serial_number: serial_number,
        new_model: model,
        new_description: description,
        new_unit: unit,
        new_supplier: supplier,
        new_supplier_contact: supplier_contact,
    
        old_product_code: oldData[0],
        old_barcode: oldData[1],
        old_group: oldData[2],
        old_subgroup: oldData[3],
        old_brand: oldData[4],
        old_serial_number: oldData[5],
        old_model: oldData[6],
        old_description: oldData[7],
        old_unit: oldData[8],
        old_supplier: oldData[9],
        old_supplier_contact: oldData[10],
    };
    
      console.log(updatedData)
      fetch('http://127.0.0.1:8000/api/edit_products/', {
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
      if (editData) {
        setProductCode(editData[0]);
        setBarcode(editData[1]);
        setGroup(editData[2]);
        setSubgroup(editData[3]);
        setBrand(editData[4]);
        setSerialNumber(editData[5]);
        setModel(editData[6]);
        setDescription(editData[7]);
        setUnit(editData[8]);
        setSupplier(editData[9]);
        setSupplierContact(editData[10]);
        setIsUpdated(true);
    }
    
    }, [editData])


    async function handleExportClick() {
      // Retrieve the access token from localForage
      const access_token = await localforage.getItem('access_token');
    
      // Make an AJAX request to the backend to download the CSV file
      const response = await fetch('http://127.0.0.1:8000/api/export_products/', {
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
                  <label>Malzeme Kodu</label>
                  <FormGroup>
                    <Input
                      name="product_code"
                      type="number"
                      defaultValue={productCode}
                      onChange={(e) => setProductCode(e.target.value)}
                    />
                  </FormGroup>

                  <label>Barkod</label>
                  <FormGroup>
                    <Input
                      type="text"
                      defaultValue={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                    />
                  </FormGroup>

                  <label>Grup</label>
                  <FormGroup>
                    <Input
                      type="text"
                      defaultValue={group}
                      onChange={(e) => setGroup(e.target.value)}
                    />
                  </FormGroup>

                  <label>Alt Grup</label>
                  <FormGroup>
                    <Input
                      type="text"
                      defaultValue={subgroup}
                      onChange={(e) => setSubgroup(e.target.value)}
                    />
                  </FormGroup>

                  <label>Marka</label>
                  <FormGroup>
                    <Input
                      type="text"
                      defaultValue={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </FormGroup>

                  <label>Seri Numarası</label>
                  <FormGroup>
                    <Input
                      type="text"
                      defaultValue={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                    />
                  </FormGroup>
                </div>

                <div className="form-group-col">
                  <label>Model</label>
                  <FormGroup>
                    <Input
                      type="text"
                      defaultValue={model}
                      onChange={(e) => setModel(e.target.value)}
                    />
                  </FormGroup>

                  <label>Açıklama</label>
                  <FormGroup>
                    <Input
                      type="text"
                      defaultValue={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </FormGroup>

                  <label>Birim</label>
                  <FormGroup>
                    <Input
                      type="text"
                      defaultValue={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    />
                  </FormGroup>

                  <label>Satıcı</label>
                  <FormGroup>
                    <Input
                      type="text"
                      defaultValue={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                    />
                  </FormGroup>

                  <label>Satıcı İletişim</label>
                  <FormGroup>
                    <Input
                      type="text"
                      defaultValue={supplierContact}
                      onChange={(e) => setSupplierContact(e.target.value)}
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
                    product_code: row[0],
                    barcode: row[1],
                    group: row[2],
                    subgroup: row[3],
                    brand: row[4],
                    serial_number: row[5],
                    model: row[6],
                    description: row[7],
                    unit: row[8],
                    supplier: row[9],
                    supplier_contact: row[10],

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
                      Header: 'Product Code',
                      accessor: 'product_code',
                    },
                    {
                      Header: 'Barcode',
                      accessor: 'barcode',
                    },
                    {
                      Header: 'Group',
                      accessor: 'group',
                    },
                    {
                      Header: 'Subgroup',
                      accessor: 'subgroup',
                    },
                    {
                      Header: 'Brand',
                      accessor: 'brand',
                    },
                    {
                      Header: 'Serial Number',
                      accessor: 'serial_number',
                    },
                    {
                      Header: 'Model',
                      accessor: 'model',
                    },
                    {
                      Header: 'Description',
                      accessor: 'description',
                    },
                    {
                      Header: 'Unit',
                      accessor: 'unit',
                    },
                    {
                      Header: 'Supplier',
                      accessor: 'supplier',
                    },
                    {
                      Header: 'Supplier Contact',
                      accessor: 'supplier_contact',
                    },
                    {
                      Header: 'Actions',
                      accessor: 'actions',
                      sortable: false,
                      filterable: false,
                    },
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
