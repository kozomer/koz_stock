import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col,Form, FormGroup, Label,CardFooter, Input} from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';
import '../../assets/css/Table.css';
import ReactBSAlert from "react-bootstrap-sweetalert";
import localforage from 'localforage';
import Select from 'react-select';
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

const [productData, setProductData] = useState(null);
const [productList, setProductList] = useState([]);
const [supplierList, setSupplierList] = useState([]);
const [consumerList, setConsumerList] = React.useState([]);

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
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/product_outflow/`,{
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
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/add_product_outflow/`, {
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
          fetch(`${process.env.REACT_APP_PUBLIC_URL}/product_outflow/`,{
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
          const response = await fetch(`http://127.0.0.1:8000/api/delete_product_outflow/`, {
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
  

    const handlePDF = async (row) => {
      console.log(row[0]);
      const access_token = await localforage.getItem('access_token');
  
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/create_product_outflow_receipt_pdf/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+ String(access_token),
          },
          body: JSON.stringify({
              id: row[0],
          }),
      });
      if (!response.ok) {
        // Handle non-successful responses here
        console.error("An error occurred while fetching the PDF");
        return;
    }

    const { filename, content } = await response.json();

    // Decode base64 data
    const pdfData = atob(content);

    // Convert decoded base64 to Blob
    const blob = new Blob([pdfData], {type: 'application/pdf'});

    // Create object URL
    const url = URL.createObjectURL(blob);

    // Create a link and click it to start download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();  // To prevent the page from reloading when the form is submitted
    const access_token =  await localforage.getItem('access_token'); 
    
    const updatedData = {
      id: id,
      date: date,
      product_code: productCode,
      barcode: barcode,
      provider_company_tax_code: providerCompanyTaxCode,
      provider_company_name: providerCompanyName,
      receiver_company_tax_code: recieverCompanyTaxCode,
      receiver_company_name: recieverCompanyName,
      status: status,
      place_of_use: placeOfUse,
      group: group,
      subgroup: subgroup,
      brand: brand,
      serial_number: serialNumber,
      model: model,
      description: description,
      unit: unit,
      amount: amount,
      // assuming the company and project id is defined and passed from somewhere
      company_id: companyId,
      project_id: projectId,
    };
  
    console.log(updatedData)
  
    fetch('http://127.0.0.1:8000/api/add_product_outflow/', {
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
  }
  

  const handleAdd = async (event) => {
    const access_token = await localforage.getItem('access_token');
    event.preventDefault();
  
    fetch(`http://127.0.0.1:8000/api/add_product_outflow/`, {
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
      setShowEditPopup(false);
    };


    useEffect(() => {
      async function fetchOptions() {
        try {
          const access_token = await localforage.getItem('access_token');
          
          const response = await fetch('http://127.0.0.1:8000/api/search_supplier_consumer_product/', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+ String(access_token)
            },
          });
    
          if (!response.ok) {
            throw new Error("Response is not OK");
          }
    
          const data = await response.json();
          console.log(data)
          setProductList(data[0]);
          setSupplierList(data[1]);
          setConsumerList(data[2]);
    
        } catch(e) {
          errorUpload(e.message);
        }
      }
    
      fetchOptions();
    }, []);
    
    const productOptions = productList.map((product) => ({
      value: product[1] !== undefined ? String(product[1]) : '',
      label: product[1] !== undefined && product[2] !== undefined ? `${product[1]} - ${product[2]}` : '',
    }));
    
    const supplierOptions = supplierList.map((supplier) => ({
      value: supplier[1] !== undefined ? String(supplier[1]) : '',
      label: supplier[1] !== undefined && supplier[2] !== undefined ? `${supplier[1]} - ${supplier[2]}` : '',
    }));
    
    const consumerOptions = consumerList.map((consumer) => ({
      value: consumer[1] !== undefined ? String(consumer[1]) : '',
      label: consumer[1] !== undefined && consumer[2] !== undefined ? `${consumer[1]} - ${consumer[2]}` : '',
    }));

    useEffect(() => {
      if (productData) {
        console.log(productData[2])
        setId(productData[0]);
        setDate(productData[1]);
        setProductCode(productData[2]);
        setProviderCompanyTaxCode(productData[4]);
        setRecieverCompanyTaxCode(productData[7])
        setStatus(productData[8])
        setBarcode(productData[3]);
        setPlaceOfUse(productData[9]);
        setAmount(productData[17]);
        
       
      }
    }, [productData]);
  
    const handleClick = (row) => {
      setProductData(row);
      setShowEditPopup(true);
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
      {showPopup  &&(
       <div className="popup">
      <Card>
            <CardHeader>
              <CardTitle tag="h4">Ambar Çıkış Ekle</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleAdd}>
              <div>
        <div className="form-group-col">

        
        <label>Tarih</label>
        <FormGroup>
          <Input
            name="date"
            type="text"
           
            onChange={(e) => setDate(e.target.value)}
          />
        </FormGroup>


        <label>Barkod</label>
        <FormGroup>
          <Input
            type="text"
           
            onChange={(e) => setBarcode(e.target.value)}
          />
        </FormGroup>
        <label>Tedarikçi Vergi No</label>
      <FormGroup>
      <Select
  name="provider_tax_code"
  
  options={supplierOptions}
  onChange={(selectedOption) => setProviderCompanyTaxCode(selectedOption ? selectedOption.value : '')}
/>

      </FormGroup>

        <label>Miktar</label>
        <FormGroup>
          <Input
            type="text"
           
            onChange={(e) => setAmount(e.target.value)}
          />
        </FormGroup>
      
        </div>

        <div className="form-group-col">

        <label>Alıcı Vergi No</label>
      <FormGroup>
      <Select
  name="receiver_tax_code"
  
  options={consumerOptions}
  onChange={(selectedOption) => setRecieverCompanyTaxCode(selectedOption ? selectedOption.value : '')}
/>
      </FormGroup>

       

        <label>Durum</label>
        <FormGroup>
          <Input
            type="text"
           
            onChange={(e) => setStatus(e.target.value)}
          />
        </FormGroup>

        <label>Kullanım Yeri</label>
        <FormGroup>
          <Input
            type="text"
          
            onChange={(e) => setPlaceOfUse(e.target.value)}
          />
        </FormGroup>

        <label>Malzeme Kodu</label>
      <FormGroup>
        <Select
          name="product_code"
          
          options={productOptions}
          onChange={(selectedOption) => setProductCode(selectedOption.value)}
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
                <Button className="btn-round" color="danger" type="submit"  onClick={handleCancel}>
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
              <CardTitle tag="h4">Ambar Çıkış Ekle</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleAdd}>
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

        <label>Miktar</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={amount}
            onChange={(e) => setAmount(e.target.value)}
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

        <label>Malzeme Kodu</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={productCode}
            onChange={(e) => setProductCode(e.target.value)}
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
                <Button className="btn-round" color="danger" type="submit"  onClick={handleCancel}>
                  İptal Et
                </Button>
              </CardFooter>
            </Card>
            </div>
)}
<Card>
  <CardHeader>
    <CardTitle tag='h4'>AMBAR ÇIKIŞ</CardTitle>
  </CardHeader>
  <CardBody>
    <div className="upload-container">
      {!showUploadDiv && (
        <div className="d-flex justify-content-between align-items-center">
          <Button className="my-button-class" color="primary" onClick={handleAddFileClick}>
            <i className="fa fa-plus-circle mr-1"></i>
            Çıkış Ekle
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
                    Header: 'Malzeme Kodu',
                    accessor: 'product_code'
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
    </>
    
  );
};

export default DataTable;
