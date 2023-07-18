import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col,Form, FormGroup, Label,CardFooter, Input} from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';
import '../../assets/css/Table.css';
import ReactBSAlert from "react-bootstrap-sweetalert";
import localforage from 'localforage';
import { FaFileUpload } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';

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
  const [editData, setEditData] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [renderEdit, setRenderEdit] = useState(false);
  const [oldData, setOldData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
//Variable Set
const [productData, setProductData] = useState(null);
const [id, setId] = useState(null);
const [date, setDate] = useState(null);
const [productCode, setProductCode] = useState(null);
const [barcode, setBarcode] = useState(null);
const [providerCompanyTaxCode, setProviderCompanyTaxCode] = useState(null);
const [providerCompanyName, setProviderCompanyName] = useState(null);
const [recieverCompanyTaxCode, setRecieverCompanyTaxCode] = useState(null);
const [recieverCompanyName, setRecieverCompanyName] = useState(null);
const [status, setStatus] = useState(null);
const [placeOfUse, setPlaceOfUse] = useState(null);
const [group, setGroup] = useState(null);
const [subgroup, setSubgroup] = useState(null);
const [brand, setBrand] = useState(null);
const [serialNumber, setSerialNumber] = useState(null);
const [model, setModel] = useState(null);
const [description, setDescription] = useState(null);
const [unit, setUnit] = useState(null);
const [amount, setAmount] = useState(null);
const [selectedFiles, setSelectedFiles] = useState(null);
;

const [showModal, setShowModal] = useState(false);
const [currentFiles, setCurrentFiles] = useState([]);
const [uploadedFiles, setUploadedFiles] = useState([]);
const [uploadedFileUrls, setUploadedFileUrls] = useState([]);



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
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/product_inflow/`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ String(access_token)
        }
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
    setTimeoutId(setTimeout(() => setShowPopup(true), 500));
   
    
  }
  const handleUploadClick = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const access_token = await localforage.getItem('access_token'); 
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/add_product_inflow/`, {
      method: 'POST',
      body: formData,
      
      headers: {
        'Authorization': 'Bearer '+ String(access_token)
      }
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(data => {
          setIsLoading(false);
          errorUpload(data.error);
        });
      }
      else{
        return response.json().then(data => {
          setIsLoading(false);
          successUpload(data.message);
          fetch(`${process.env.REACT_APP_PUBLIC_URL}/product_inflow/`,{
            headers: {
              'Authorization': 'Bearer '+ String(access_token)
            }
          })
          .then((response) => response.json())
          .then((data) =>{
             setDataTable(data)
             });
          clearTimeout(timeoutId); // Clear any existing timeout
          setTimeoutId(setTimeout(() => setShowUploadDiv(false), 500));
        });
      }
    })
    .catch((error) => {
      console.error(error.message); // the error message returned by the server
      setIsLoading(false);
      errorUpload(e);
    })
    .finally(() => {
      setShowUploadDiv(false);
      
    });
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
    async function deleteFunc() {
      if (deleteConfirm) {
        const access_token = await localforage.getItem('access_token');
        
        console.log(deleteData)
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/delete_product_inflow/`, {
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
      
      setId(productData[0]);
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

  

  const handleAdd = async (event) => {
    const access_token = await localforage.getItem('access_token');
    event.preventDefault();
  
    fetch(`http://127.0.0.1:8000/api/add_product_inflow/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + String(access_token)
      },
      body: JSON.stringify({
        date: date,
        product_code: productCode,
        barcode: barcode,
        provider_company_tax_code: providerCompanyTaxCode,
        receiver_company_tax_code: recieverCompanyTaxCode,
        status: status,
        place_of_use: placeOfUse,
        amount: amount
      })
    })
    .then(response => response.json().then(data => ({status: response.status, body: data})))
    .then(({status, body}) => {
      if (status === 201) { // Assuming 201 is the success status code
        console.log("Product inflow added successfully");
        successUpload(body.message);
        setDataChanged(true);
      } else {
        console.log("Failed to add product inflow", body.error);
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
      setEditData(null)
    };

    

    const successEdit = () => {
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
          Your edit has been successfully saved.
        </ReactBSAlert>
      );
      setRenderEdit(true)
    };

    const handleFileChange = (e) => {
      // This is an array-like object
      const files = e.target.files;
  
      // Convert it to an array
      const fileArray = Array.from(files);
  
      // You can then set the state with this array
      setUploadedFiles(fileArray);
    };



const handleUpload = (event) => {
  event.preventDefault(); 

  // Perform upload logic here
  // If you're uploading files one at a time
  let urls = [];
  uploadedFiles.forEach((file, index) => {
    // Replace this with your actual upload code
    // Example: axios.post('/upload', file)
    //   .then((response) => urls.push(response.data.url))
    //   .catch((error) => console.log(`Error uploading file ${index + 1}: ${error}`));

    console.log(`Uploading file ${index + 1}`);
    // Simulating the response with a timeout
    setTimeout(() => {
      urls.push(URL.createObjectURL(file)); // This will create a blob URL for the file. Replace this with your server's response
    }, 2000);
  });

  // Simulating the response with a timeout
  setTimeout(() => {
    console.log('All files uploaded successfully');
    setUploadedFileUrls(urls);
    setUploadedFiles([]);
  }, 2000);
};

    
  
    const handleDownload = (event) => {
      event.preventDefault();
      if (uploadedFile) {
        const downloadUrl = URL.createObjectURL(uploadedFile);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = uploadedFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      }
    };

    // Function to handle showing the modal
const handleShowModal = (files) => {
  setCurrentFiles(uploadedFileUrls);
  setShowModal(true);
};

// Function to handle hiding the modal
const handleHideModal = () => {
  setCurrentFiles([]);
  setShowModal(false);
};

    async function handleExportClick() {
      // Retrieve the access token from localForage
      const access_token = await localforage.getItem('access_token');
    
      // Make an AJAX request to the backend to download the CSV file
      const response = await fetch('http://127.0.0.1:8000/api/export_sales/', {
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

     
        <Row>
          
          <Col
          >
            {/* Pop Up */}
      {showPopup && (
       <div className="popup">
      <Card>
            <CardHeader>
              <CardTitle tag="h4">Ambar Giriş Ekle</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
              <div>
        <div className="form-group-col">

               
        <label>Tarih</label>
        <FormGroup>
          <Input
            name="date"
            type="text"
            defaultValue={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormGroup>

        <label>Malzeme Kodu</label>
        <FormGroup>
          <Input
            type="text"
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
        <label>Tedarikçi Vergi No</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={providerCompanyTaxCode}
            onChange={(e) => setProviderCompanyTaxCode(e.target.value)}
          />
        </FormGroup>

          </div>
          <div className="form-group-col">
        <label>Alıcı Vergi No</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={recieverCompanyTaxCode}
            onChange={(e) => setRecieverCompanyTaxCode(e.target.value)}
          />
        </FormGroup>


        <label>Durum</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </FormGroup>

        <label>Kullanım Yeri</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={placeOfUse}
            onChange={(e) => setPlaceOfUse(e.target.value)}
          />
        </FormGroup>

        <label>Miktar</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </FormGroup>
        </div>

        
          {/* Photo upload section */}
          <div className="photo-upload-section">
      <input type="file" onChange={handleFileChange} multiple />
      <button className="upload-button" onClick={handleUpload}>
        <FaFileUpload /> Upload
      </button>
      {uploadedFiles.length > 0 && (
        <p>
          {uploadedFiles.length} files selected for upload
        </p>
      )}
    </div>
    <div className="uploaded-files-section">
  <ul>
    {uploadedFileUrls.map((url, index) => (
      <li key={index}>
        <a href={url} download>
          Download File {index + 1}
        </a>
      </li>
    ))}
  </ul>
</div>

        </div>
        
              </Form>
            </CardBody>
              <CardFooter>
                <Button className="btn-round" color="success" type="submit" onClick={handleAdd}>
                  Onayla
                </Button>
                <Button className="btn-round" color="danger" type="submit"  onClick={handleCancel}>
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
              <CardTitle tag="h4">Ambar Giriş Düzenle</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleEdit}>
              <div>
        <div className="form-group-col">
        <label>Malzeme Kodu</label>
        <FormGroup>
          <Input
            name="product_code"
            type="text"
            defaultValue={productCode}
            onChange={(e) => setProductCode(e.target.value)}
          />
        </FormGroup>
               
        <label>Tarih</label>
        <FormGroup>
          <Input
            name="date"
            type="text"
            defaultValue={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormGroup>

        <label>Durum</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={status}
            onChange={(e) => setStatus(e.target.value)}
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
        <label>Tedarikçi Vergi No</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={providerCompanyTaxCode}
            onChange={(e) => setProviderCompanyTaxCode(e.target.value)}
          />
        </FormGroup>

          </div>
          <div className="form-group-col">
        <label>Alıcı Vergi No</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={recieverCompanyTaxCode}
            onChange={(e) => setRecieverCompanyTaxCode(e.target.value)}
          />
        </FormGroup>


      
        <label>Kullanım Yeri</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={placeOfUse}
            onChange={(e) => setPlaceOfUse(e.target.value)}
          />
        </FormGroup>

        <label>Miktar</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={amount}
            onChange={(e) => setAmount(e.target.value)}
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
                <Button className="btn-round" color="danger" type="submit"  onClick={handleCancel}>
                  İptal Et
                </Button>
              </CardFooter>
            </Card>
            </div>
)}
<Card>
  <CardHeader>
    <CardTitle tag='h4'>AMBAR GİRİŞ</CardTitle>
  </CardHeader>
  <CardBody>
    <div className="upload-container">
      {!showUploadDiv && (
        <div className="d-flex justify-content-between align-items-center">
          <Button className="my-button-class" color="primary" onClick={handleAddFileClick}>
            <i className="fa fa-plus-circle mr-1"></i>
            GİRDİ EKLE
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
              Dosya Ekle
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
            <Card >
             
              <CardBody >

                <ReactTable
                  data={dataTable.map((row,index) => ({
                    id: row[0],
                    date: row[1],
                    product_code : row[2],
                    barcode: row[3],
                    supplier_company_tax_code : row[4],
                    supplier_company_name : row[5],
                    receiver_company_tax_code : row[6],
                    receiver_company_name: row[7],
                    status : row[8],
                    place_of_use : row[9],
                    group : row[10],
                    subgroup : row[11],
                    brand : row[12],
                    serial_number : row[13],
                    model : row[14],
                    description : row[15],
                    unit : row[16],
                    amount : row[17],

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
                                id: rowToDelete [0],
                               
                              };
                              
                              setDeleteData(data);
                              
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
                                fetch(`http://127.0.0.1:8000/api/delete_sales/`, {
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
                      Header: 'No',
                      accessor: 'id'
                  },
                    {
                      Header: 'Tarih',
                      accessor: 'date'
                  },
                  {
                    Header: 'Barkod',
                    accessor: 'barcode'
                },
                  {
                      Header: 'Tedarikçi Vergi No',
                      accessor: 'supplier_company_tax_code'
                  },
                  {
                      Header: 'Tedarikçi Adı',
                      accessor: 'supplier_company_name'
                  },
                  {
                      Header: 'Alıcı Vergi No',
                      accessor: 'receiver_company_tax_code'
                  },
                  {
                      Header: 'Alıcı Adı',
                      accessor: 'receiver_company_name'
                  },
                  {
                      Header: 'Durum',
                      accessor: 'status'
                  },
                  {
                      Header: 'Kullanım Yeri',
                      accessor: 'place_of_use'
                  },
                  {
                      Header: 'Grup',
                      accessor: 'group'
                  },
                  {
                      Header: 'Alt Grup',
                      accessor: 'subgroup'
                  },
                  {
                      Header: 'Marka',
                      accessor: 'brand'
                  },
                  {
                      Header: 'Seri Numarası',
                      accessor: 'serial_number'
                  },
                  {
                      Header: 'Model',
                      accessor: 'model'
                  },
                  {
                      Header: 'Açıklama',
                      accessor: 'description'
                  },
                  {
                      Header: 'Birim',
                      accessor: 'unit'
                  },
                  {
                      Header: 'Miktar',
                      accessor: 'amount'
                  },

                                      {
                      Header: 'Uploaded Files',
                      id: 'uploaded_files',  // change from accessor to id
                      Cell: () => (  // removed the value from here
                        <button onClick={handleShowModal}>Show Files</button>
                      ),
                    },

                    {
                      Header: 'İşlem',
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
      {showModal && (
  <div className="modal show d-block" tabindex="-1">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Uploaded Files</h5>
          <button type="button" className="close" onClick={handleHideModal}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          {currentFiles.map((file, index) => (
            <p key={index}>
              <a href={file}>{file}</a>
            </p>
          ))}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleHideModal}>Close</button>
        </div>
      </div>
    </div>
  </div>
)}



    </>
    
  );
};

export default DataTable;
