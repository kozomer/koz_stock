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
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [productData, setProductData] = useState(null);
  const [updatedProductData, setUpdatedProductData] = useState(null);
  
  
  const [isUpdated, setIsUpdated] = useState(false);
  const [renderEdit, setRenderEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //Edit Variables
  const [productCode, setProductCode] = useState(null);
  const [barcode, setBarcode] = useState(null);
  const [groups, setGroups] = useState([]);
    const [subgroups, setSubgroups] = useState([]);
    const [id, setID] = useState('');
    const [brand, setBrand] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [model, setModel] = useState('');
    const [description, setDescription] = useState('');
    const [unit, setUnit] = useState('');
    const [group, setGroup] = useState('');
    const [subgroup, setSubgroup] = useState('');
  
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedSubgroup, setSelectedSubgroup] = useState(null);
  const [selectedEditGroup, setSelectedEditGroup] = useState(null);
  const [selectedEditSubgroup, setSelectedEditSubgroup] = useState(null);
  const [product, setProduct] = useState({
    brand: "",
    serial_number: "",
    model: "",
    description: "",
    unit: ""
});

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
      console.log("edit")
      const response = await fetch('http://127.0.0.1:8000/api/products/',{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ String(access_token)
        },
      });
      const data = await response.json();
      console.log(data)
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
    setTimeoutId(setTimeout(() =>  setShowPopup(true), 500));
   
    
  }

  useEffect(() => {
    async function fetchGroups() {
      const access_token = await localforage.getItem('access_token');
      
      const response = await fetch('http://127.0.0.1:8000/api/product_groups/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ String(access_token)
        },
      });

      const data = await response.json();
      console.log(data)
      setGroups(data);
    }
    fetchGroups();
}, []);

useEffect(() => {
  async function fetchSubgroups() {
      if (selectedGroup) {
          const access_token = await localforage.getItem('access_token');
          
          const response = await fetch(`http://127.0.0.1:8000/api/product_subgroups/`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + String(access_token)
              },
              body: JSON.stringify({group_code: selectedGroup})
          });

          const data = await response.json();
          console.log(data);
          setSubgroups(data);
          if (data.length > 0) {
            setSelectedSubgroup(data[0][0]);
          }
      }
  }
  fetchSubgroups();
}, [selectedGroup]);


useEffect(() => {
  async function fetchEditSubgroups() {
      if (selectedEditGroup) {
          const access_token = await localforage.getItem('access_token');
          
          const response = await fetch(`http://127.0.0.1:8000/api/product_subgroups/`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + String(access_token)
              },
              body: JSON.stringify({group_code: selectedEditGroup})
          });

          const data = await response.json();
          console.log(data);
          setSubgroups(data);
          
      }
  }
  fetchEditSubgroups();
}, [selectedEditGroup]);

useEffect(() => {
  console.log(selectedSubgroup);
}, [selectedEditSubgroup]);


useEffect(() => {
  console.log(selectedSubgroup);
}, [selectedSubgroup]);


const handleInputChange = (event) => {
    setProduct({
        ...product,
        [event.target.name]: event.target.value
    });
};

  const handleUploadClick = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const access_token = await localforage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/add_products/', {
      method: 'POST',
      
      
      headers: {
          
        'Authorization': 'Bearer '+ String(access_token),
        'Content-Type': 'application/json',
      },
      body:  JSON.stringify(formData),
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
        onConfirm={() => { 
          hideAlert()
        setShowPopup(false)
      setShowEditPopup(false)}}
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
        const access_token = await localforage.getItem('access_token');
        
        console.log(deleteData)
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/delete_products/`, {
            method: "POST",
            body: JSON.stringify(deleteData),
            headers: {
              'Authorization': 'Bearer ' + String(access_token),
              'Content-Type': 'application/json',
            }
          });
  
          const responseData = await response.json();  // Parse the response data
  
          if (!response.ok) {
            errorUpload(responseData.error);
          } else {
            successUpload(responseData.message);
          }
        } catch (e) {
          // If the fetch itself fails, for example due to network errors
          errorUpload(e.toString());
        }
        
        setDataChanged(!dataChanged);
        setDeleteConfirm(false);
      }
    }
  
    deleteFunc();
  }, [deleteConfirm]);
  

  useEffect(() => {
    if (productData) {
      setSelectedEditGroup(productData[2][0])
      setSelectedEditSubgroup(productData[3][0])
      setID(productData[0]);
      setGroup(productData[2]);
      setSubgroup(productData[3])
      console.log(productData[2][0])
      setBrand(productData[4]);
      setSerialNumber(productData[5]);
      setModel(productData[6]);
      setDescription(productData[7]);
      setUnit(productData[8]);
    }
  }, [productData]);

  const handleClick = (row) => {
    setProductData(row);
    setShowEditPopup(true);
  };

  const handleEdit = async (event) => {
    event.preventDefault();
  
    const access_token = await localforage.getItem('access_token'); 
    const updatedData = {
      id,
      brand,
      serial_number:serialNumber,
      model,
      description,
      unit,
      group:selectedEditGroup,
      subgroup:selectedEditSubgroup,
    };
  
    fetch(`http://127.0.0.1:8000/api/edit_products/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + String(access_token)
      },
      body: JSON.stringify(updatedData)
    })
    .then(response => response.json().then(data => ({status: response.status, body: data})))
    .then(({status, body}) => {
      if (status === 200) { // Assuming 200 is the success status code
        console.log("Product edited successfully");
        successUpload(body.message);
        setUpdatedProductData(updatedData);

        setDataChanged(true);
        setShowEditPopup(false);
       
         
      } else {
        console.log("Failed to edit product", body.error);
        errorUpload(body.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      errorUpload(error.message);
    });
  };

    const handleSubmit = async (event) => {
      const access_token = await localforage.getItem('access_token'); 
      event.preventDefault();
      console.log(selectedSubgroup);
      fetch(`http://127.0.0.1:8000/api/add_products/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + String(access_token)
        },
        body: JSON.stringify({
          group_code: selectedGroup,
          subgroup_code: selectedSubgroup,
          ...product
        })
      })
      .then(response => response.json().then(data => ({status: response.status, body: data})))
      .then(({status, body}) => {
        if (status === 201) { // Assuming 201 is the success status code
          console.log("Product added successfully");
          successUpload(body.message);
          setDataChanged(true);
           
        } else {
          console.log("Failed to add product", body.error);
          errorUpload(body.error);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        errorUpload(error.message);
      });
    };
    

    

    const handleCancel = () => {
      setShowPopup(false);
      setShowEditPopup(false)
      
    };


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
      {showPopup &&(
       <div className="popup">
              <Card>
          <CardHeader>
            <CardTitle tag="h4">Malzeme Ekle</CardTitle>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <div>
                <div className="form-group-col">
                <FormGroup>
                <Label for="groupSelect">Grup</Label>
                <Input type="select" name="groupSelect" id="groupSelect" onChange={(event) => setSelectedGroup(event.target.value)}>
                {groups?.map(group => <option value={group[0]}>{group[1]}</option>)}


                </Input>
              </FormGroup>

              <FormGroup>
    <Label for="subgroupSelect">Alt Grup</Label>
    <Input type="select" name="subgroupSelect" id="subgroupSelect" onChange={(event) => setSelectedSubgroup(event.target.value)}>
    {subgroups?.map((subgroup, index) => <option key={index} value={subgroup[0]}>{subgroup[1]}</option>)}
</Input>


</FormGroup>

                
                

                  <label>Marka</label>
                  <FormGroup>
                    <Input
                      name="brand"
                      type="text"
                      value={product.brand}
                      onChange={handleInputChange}
                      placeholder="Brand"
                    />
                  </FormGroup>

                  <label>Seri Numarası</label>
                  <FormGroup>
                    <Input
                      type="text"
                      name="serial_number" 
                      value={product.serial_number}
                       onChange={handleInputChange} 
                       placeholder="Serial Number"
                    />
                  </FormGroup>
                </div>

                <div className="form-group-col">
                  <label>Model</label>
                  <FormGroup>
                    <Input
                      type="text"
                      name="model" value={product.model}
                       onChange={handleInputChange} 
                       placeholder="Model" 
                    />
                  </FormGroup>

                  <label>Açıklama</label>
                  <FormGroup>
                    <Input
                      type="text"
                      name="description"
                       value={product.description}
                        onChange={handleInputChange}
                         placeholder="Description"
                    />
                  </FormGroup>

                  <label>Birim</label>
                  <FormGroup>
                    <Input
                      type="text"
                      name="unit"
                       value={product.unit}
                        onChange={handleInputChange}
                         placeholder="Unit"
                    />
                  </FormGroup>

                </div>
              </div>
            </Form>
          </CardBody>
          <CardFooter>
            <Button className="btn-round" color="success" type="submit" onClick={handleSubmit}>
              Onayla
            </Button>
            <Button className="btn-round" color="danger" type="submit" onClick={handleCancel}>
              İptal Et
            </Button>
          </CardFooter>
        </Card>

            </div>
)}


{showEditPopup && (
       <div className="popup">
              <Card>
          <CardHeader>
            <CardTitle tag="h4">Malzeme Düzenle</CardTitle>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleEdit}>
              <div>
                <div className="form-group-col">
                

                
                <FormGroup>
    <Label for="groupSelect">Grup</Label>
    <Input type="select" name="groupSelect" id="groupSelect" value={selectedEditGroup} onChange={(event) => setSelectedEditGroup(event.target.value)}>
        {groups?.map(group => <option key={group[0]} value={group[0]}>{group[1]}</option>)}
    </Input>
</FormGroup>

<FormGroup>
    <Label for="subgroupSelect">Alt Grup</Label>
    <Input type="select" name="subgroupSelect" id="subgroupSelect" value={selectedEditSubgroup}  onChange={(event) => setSelectedEditSubgroup(event.target.value)}>
        {subgroups?.map((subgroup, index) => <option key={index} value={subgroup[0]}>{subgroup[1]}</option>)}
    </Input>
</FormGroup>


                  <label>Marka</label>
                  <FormGroup>
                    <Input
                      name="brand"
                      type="text"
                      defaultValue={brand}
                      onChange={(e) => setBrand(e.target.value)}
                     
                    
                      placeholder="Brand"
                    />
                  </FormGroup>

                  <label>Seri Numarası</label>
                  <FormGroup>
                    <Input
                      type="text"
                      name="serial_number" 
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      
                       placeholder="Serial Number"
                    />
                  </FormGroup>
                </div>

                <div className="form-group-col">
                  <label>Model</label>
                  <FormGroup>
                    <Input
                      type="text"
                      name="model" 
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                       placeholder="Model" 
                    />
                  </FormGroup>

                  <label>Açıklama</label>
                  <FormGroup>
                    <Input
                      type="text"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                         placeholder="Description"
                    />
                  </FormGroup>

                  <label>Birim</label>
                  <FormGroup>
                    <Input
                      type="text"
                      name="unit"
                      value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                       
                         placeholder="Unit"
                    />
                  </FormGroup>

                </div>
              </div>
            </Form>
          </CardBody>
          <CardFooter>
            <Button className="btn-round" color="success" type="submit" onClick={handleEdit}>
              Onayla
            </Button>
            <Button className="btn-round" color="danger" type="submit" onClick={handleCancel}>
              İptal Et
            </Button>
          </CardFooter>
        </Card>

            </div>
)}
<Card>
  <CardHeader>
    <CardTitle tag='h4'>MALZEMELER</CardTitle>
  </CardHeader>
  <CardBody>
    <div className="upload-container">
      {!showUploadDiv && (
        <div className="d-flex justify-content-between align-items-center">
          <Button className="my-button-class" color="primary" onClick={handleAddFileClick}>
            <i className="fa fa-plus-circle mr-1"></i>
            Yeni Malzeme Ekle
          </Button>
          <Button className="my-button-class" color="primary" onClick={handleExportClick}>
            <i className="fa fa-download mr-1"></i>
            Dışa Aktar
          </Button>
        </div>
      )}
      {showUploadDiv && (
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <Button className="my-button-class" color="primary" onClick={handleAddFileClick}>
              <i className="fa fa-plus-circle mr-1"></i>
              Dosya Yükle
            </Button>
            <Button className="my-button-class" color="primary" onClick={handleExportClick}>
              <i className="fa fa-download mr-1"></i>
              Dışa Aktar
            </Button>
          </div>
          <div className="mt-3">
            <input type="file" className="custom-file-upload" onChange={handleFileInputChange} />
            <Button color="primary" className="btn-upload" onClick={handleUploadClick} disabled={!file} active={!file}>
              Yükle
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
  data={(dataTable || []).map((row,index) => ({
    id: row.id,
    product_code: row[1],
    group: row[2][1],
    subgroup: row[3][1],
    brand: row[4],
    serial_number: row[5],
    model: row[6],
    description: row[7],
    unit: row[8],
  
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
               console.log(rowToDelete[0])
               const data = {
               id: rowToDelete[0],

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
      Header: 'Malzeme Kodu',
      accessor: 'product_code',
    },
    {
      Header: 'Grup',
      accessor: 'group',
    },
    {
      Header: 'Alt Grup',
      accessor: 'subgroup',
    },
    {
      Header: 'Marka',
      accessor: 'brand',
    },
    {
      Header: 'Seri Numarası',
      accessor: 'serial_number',
    },
    {
      Header: 'Model',
      accessor: 'model',
    },
    {
      Header: 'Açıklama',
      accessor: 'description',
    },
    {
      Header: 'Birim',
      accessor: 'unit',
    },
    
    {
      Header: 'İşlem',
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
