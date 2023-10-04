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
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [productData, setProductData] = useState(null);
  //Edit Variables
  const [id, setId] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [mail, setMail] = useState('');
  const [adress, setAdress] = useState('');
  const [explanation, setExplanation] = useState('');
  const [company, setCompany] = useState(null);
  const [project, setProject] = useState(null);
  const [products, setProducts] = useState(null);
 
  const [oldData, setOldData] = useState(null);

  React.useEffect(() => {
    return function cleanup() {
      var id = window.setTimeout(null, 0);
      while (id--) {
        window.clearTimeout(id);
      }
    };
  }, []);

  //API CALL degisecek
  useEffect(() => {
    async function fetchData() {
      const access_token = await localforage.getItem('access_token');
      
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/consumers/`,{
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
    setTimeoutId(setTimeout(() => setShowPopup(true), 500));
   
    
  }

  //API CALL DEGISECEK
  const handleUploadClick = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const access_token = await localforage.getItem('access_token');
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/add_products/`, {
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
      
      fetch(`${process.env.REACT_APP_PUBLIC_URL}/products/`,{
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
        onConfirm={() => { hideAlert()
        setShowPopup(false)}}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        {s}
      </ReactBSAlert>
    );
  };

  //API CALL
    
  useEffect(() => {
    async function deleteFunc() {
      if (deleteConfirm) {
        const access_token = await localforage.getItem('access_token');
        
        console.log(deleteData)
        try {
          const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/delete_consumer/`, {
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
     
      setId(productData[0])
      setTaxCode(productData[1]);
      setName(productData[2]);
      setContactName(productData[3])
     
      setContactNo(productData[4]);
      setMail(productData[5]);
      setAdress(productData[6]);
      setExplanation(productData[7]);
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
      name,
      contact_name: contactName,
      contact_no:contactNo,
      tax_code:taxCode,
      mail:mail,
      adress:adress,
      explanation:explanation,
    };
  
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/edit_consumer/`, {
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


    const handleAdd = async (event) => {
      const access_token = await localforage.getItem('access_token');
      event.preventDefault();
    
      fetch(`${process.env.REACT_APP_PUBLIC_URL}/add_consumer/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + String(access_token)
        },
        body: JSON.stringify({
          tax_code: taxCode,
          name: name,
         
          contact_name: contactName,
          contact_no: contactNo,
          mail:mail,
          adress:adress,
          explanation:explanation,
        })
      })
      .then(response => response.json().then(data => ({status: response.status, body: data})))
      .then(({status, body}) => {
        if (status === 201) { // Assuming 201 is the success status code
          console.log("Supplier added successfully");
          successUpload(body.message);
          setDataChanged(true);
        } else {
          console.log("Failed to adda supplier", body.error);
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
      setProductData(null);
      setShowEditPopup(false);
    };

 

//API CALL
    async function handleExportClick() {
      // Retrieve the access token from localForage
      const access_token = await localforage.getItem('access_token');
    
      // Make an AJAX request to the backend to download the CSV file
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/export_products/`, {
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
            <CardTitle tag="h4">Tüketici ekle</CardTitle>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleAdd}>
              <div>
                <div className="form-group-col">
                  <label>Vergi No</label>
                  <FormGroup>
                    <Input
                      name="tax_code"
                      type="number"
                     
                      onChange={(e) => setTaxCode(e.target.value)}
                    />
                  </FormGroup>

                  <label>İsim</label>
                  <FormGroup>
                    <Input
                      type="text"
                      
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormGroup>

                  <label>Yetkili Adı</label>
                  <FormGroup>
                    <Input
                      type="text"
                      
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </FormGroup>

                  <label>Yetkili No</label>
                  <FormGroup>
                    <Input
                      type="text"
                      
                      onChange={(e) => setContactNo(e.target.value)}
                    />
                  </FormGroup>

              
                </div>

                <div className="form-group-col">
                <label>Mail</label>
                  <FormGroup>
                    <Input
                      type="text"
                     
                      onChange={(e) => setMail(e.target.value)}
                    />
                  </FormGroup>
                  <label>Adres</label>
                  <FormGroup>
                    <Input
                      type="text"
                     
                      onChange={(e) => setAdress(e.target.value)}
                    />
                  </FormGroup>

                  <label>Açıklama</label>
                  <FormGroup>
                    <Input
                      type="textarea"  // Change from 'text' to 'textarea'
                      rows="10"  // Defines the number of visible rows. Adjust as needed.
                     
                      onChange={(e) => setExplanation(e.target.value)}
                    />
                  </FormGroup>


                </div>
              </div>
            </Form>
          </CardBody>
          <CardFooter>
            <Button className="btn-round" color="success" type="submit" onClick={handleAdd}>
              Onayla
            </Button>
            <Button className="btn-round" color="danger" type="submit" onClick={handleCancel}>
              İptal Et
            </Button>
          </CardFooter>
        </Card>

            </div>
)}
{showEditPopup  &&(
       <div className="popup">
              <Card>
          <CardHeader>
            <CardTitle tag="h4">Tüketici Düzenle</CardTitle>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleEdit}>
              <div>
                <div className="form-group-col">
                  <label>Vergi No</label>
                  <FormGroup>
                    <Input
                      name="tax_code"
                      type="number"
                      defaultValue={taxCode}
                      onChange={(e) => setTaxCode(e.target.value)}
                    />
                  </FormGroup>

                  <label>İsim</label>
                  <FormGroup>
                    <Input
                      type="text"
                      defaultValue={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormGroup>

                  <label>Yetkili Adı</label>
                  <FormGroup>
                    <Input
                      type="text"
                      defaultValue={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </FormGroup>

                  <label>Yetkili No</label>
                  <FormGroup>
                    <Input
                      type="text"
                      defaultValue={contactNo}
                      onChange={(e) => setContactNo(e.target.value)}
                    />
                  </FormGroup>

                
                
                </div>


                <div className="form-group-col">
                <label>Mail</label>
                  <FormGroup>
                    <Input
                      type="text"
                      value={mail}
                      onChange={(e) => setMail(e.target.value)}
                    />
                  </FormGroup>
                  <label>Adres</label>
                  <FormGroup>
                    <Input
                      type="text"
                      value={adress}
                      onChange={(e) => setAdress(e.target.value)}
                    />
                  </FormGroup>

                  <label>Açıklama</label>
                  <FormGroup>
                    <Input
                       type="textarea"  // Change from 'text' to 'textarea'
                       rows="10"  // Defines the number of visible rows. Adjust as needed.
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
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
    <CardTitle tag='h4'>TUKETICILER</CardTitle>
  </CardHeader>
  <CardBody>
    <div className="upload-container">
      {!showUploadDiv && (
        <div className="d-flex justify-content-between align-items-center">
          <Button className="my-button-class"  onClick={handleAddFileClick}>
            <i className="fa fa-plus-circle mr-1"></i>
            Yeni Tüketici Ekle
          </Button>
         
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
                    id: row[0],
                    tax_code: row[1],
                    name: row[2],
                    contact_name: row[3],
                    contact_no: row[4],
                    mail: row[5],
                    adress:row[6],
                    explanation:row[7],
                    

                    actions: (
                      <div className='actions-left'>
                       
                         <Button
                          disabled={showEditPopup}
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
                            disabled={showEditPopup}
                            onClick={() => {
                              
                               warningWithConfirmAndCancelMessage() 
                               const rowToDelete = {...row};
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
                      Header: 'Vergi No',
                      accessor: 'tax_code',
                    },
                    {
                      Header: 'Şirket Adı',
                      accessor: 'name',
                    },
                    {
                      Header: 'Yetkili Adı',
                      accessor: 'contact_name',
                    },
                    {
                      Header: 'Yetkili No',
                      accessor: 'contact_no',
                    },
                    
                    {
                      Header: 'Mail',
                      accessor: 'mail',
                    },
                    {
                      Header: 'Adres',
                      accessor: 'adress',
                    },
                    {
                      Header: 'Açıklama',
                      accessor: 'explanation',
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
