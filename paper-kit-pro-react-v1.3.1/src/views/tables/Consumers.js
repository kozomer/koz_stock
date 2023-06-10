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
  const [taxCode, setTaxCode] = useState(null);
  const [name, setName] = useState(null);
  const [contactName, setContactName] = useState(null);
  const [contactNo, setContactNo] = useState(null);
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

  //API CALL DEGISECEK
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

  //API CALL
    
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
      setTaxCode(row.tax_code);
      setName(row.name);
      setContactName(row.contact_name);
      setContactNo(row.contact_no);
      setCompany(row.company);
      setProject(row.project);
      setProducts(row.products);
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
        new_tax_code: taxCode,
        new_name: name,
        new_group: group,
        new_subgroup: subgroup,
        new_company: company,
        new_project: project,
        new_products: products,
        new_description: description,
        new_unit: unit,
        new_supplier: supplier,
        new_supplier_contact: supplierContact,
    
        old_tax_code: oldData[0],
        old_name: oldData[1],
        old_group: oldData[2],
        old_subgroup: oldData[3],
        old_company: oldData[4],
        old_project: oldData[5],
        old_products: oldData[6],
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
        setTaxCode(editData[0]);
        setName(editData[1]);
        setContactName(editData[2]);
        setContactNo(editData[3]);
        setCompany(editData[4]);
        setProject(editData[5]);
        setProducts(editData[6]);
        setDescription(editData[7]);
        setUnit(editData[8]);
        setSupplier(editData[9]);
        setSupplierContact(editData[10]);
        setIsUpdated(true);
    }
    
    }, [editData])

//API CALL
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
            <CardTitle tag="h4">Edit Supplier</CardTitle>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
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

                  <label>Firma</label>
                  <FormGroup>
                    <Input
                      type="text"
                      defaultValue={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </FormGroup>

                  <label>Proje</label>
                  <FormGroup>
                    <Input
                      type="text"
                      defaultValue={project}
                      onChange={(e) => setProject(e.target.value)}
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
<Card>
  <CardHeader>
    <CardTitle tag='h4'>TUKETICILER</CardTitle>
  </CardHeader>
  <CardBody>
    <div className="upload-container">
      {!showUploadDiv && (
        <div className="d-flex justify-content-between align-items-center">
          <Button className="my-button-class" color="primary" onClick={handleAddFileClick}>
            <i className="fa fa-plus-circle mr-1"></i>
            Yeni Tüketici Ekle
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
                  data={dataTable.map((row,index) => ({
                    id: row.id,
                    tax_code: row[0],
                    name: row[1],
                    contact_name: row[2],
                    contact_no: row[3],
                    company: row[4],
                    project: row[5],
                    products: row[6],
                    

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
                                tax_code: rowToDelete[0],

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
                      accessor: 'tax_code',
                    },
                    {
                      Header: 'Barkod',
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
                      Header: 'Firma',
                      accessor: 'company',
                    },
                    {
                      Header: 'Proje',
                      accessor: 'project',
                    },
                    {
                      Header: 'Ürün',
                      accessor: 'products',
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
