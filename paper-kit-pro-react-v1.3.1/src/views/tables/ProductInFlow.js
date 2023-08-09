import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col, Form, FormGroup, Label, CardFooter, Input } from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';
import '../../assets/css/Table.css';
import ReactBSAlert from "react-bootstrap-sweetalert";
import localforage from 'localforage';
import { FaFileUpload } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
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
  const [productData, setProductData] = useState(null);
  const [id, setId] = useState('');
  const [date, setDate] = useState('');
  const [productCode, setProductCode] = useState('');
  const [barcode, setBarcode] = useState('');
  const [providerCompanyTaxCode, setProviderCompanyTaxCode] = useState('');
  const [providerCompanyName, setProviderCompanyName] = useState('');
  const [recieverCompanyTaxCode, setRecieverCompanyTaxCode] = useState('');
  const [recieverCompanyName, setRecieverCompanyName] = useState('');
  const [status, setStatus] = useState('');
  const [placeOfUse, setPlaceOfUse] = useState('');
  const [group, setGroup] = useState(null);
  const [subgroup, setSubgroup] = useState(null);
  const [brand, setBrand] = useState(null);
  const [serialNumber, setSerialNumber] = useState(null);
  const [model, setModel] = useState(null);
  const [description, setDescription] = useState(null);
  const [unit, setUnit] = useState(null);
  const [amount, setAmount] = useState('');
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [productList, setProductList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [consumerList, setConsumerList] = React.useState([]);
  const [updatedProductData, setUpdatedProductData] = useState(null);

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
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/product_inflow/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(access_token)
        }
      });
      const data = await response.json();
      console.log(data)
      setDataTable(data);

      setDataChanged(false);
      setRenderEdit(false)
    }
    fetchData();
  }, [dataChanged, renderEdit]);

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
        'Authorization': 'Bearer ' + String(access_token)
      }
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(data => {
            setIsLoading(false);
            errorUpload(data.error);
          });
        }
        else {
          return response.json().then(data => {
            setIsLoading(false);
            successUpload(data.message);
            fetch(`${process.env.REACT_APP_PUBLIC_URL}/product_inflow/`, {
              headers: {
                'Authorization': 'Bearer ' + String(access_token)
              }
            })
              .then((response) => response.json())
              .then((data) => {
                setDataTable(data)
                console.log(data)
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
        onConfirm={() => {
          setDeleteConfirm(true);
          successDelete()
        }}
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

  useEffect(() => {
    async function fetchOptions() {
      try {
        const access_token = await localforage.getItem('access_token');

        const response = await fetch('http://127.0.0.1:8000/api/search_supplier_consumer_product/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(access_token)
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

      } catch (e) {
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


  const handleEdit = async (event) => {
    event.preventDefault();



    const access_token = await localforage.getItem('access_token');
    const updatedData = {
      old_id: id,
      new_product_code: productCode,
      new_supplier_tax_code: providerCompanyTaxCode,
      new_receiver_tax_code: recieverCompanyTaxCode,
      date,
      status,
      place_of_use: placeOfUse,
      amount,
      barcode
    };

    fetch(`http://127.0.0.1:8000/api/edit_product_inflow/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + String(access_token)
      },
      body: JSON.stringify(updatedData)
    })
      .then(response => response.json().then(data => ({ status: response.status, body: data })))
      .then(({ status, body }) => {
        if (status === 200) { // Assuming 200 is the success status code
          console.log("Inflow edited successfully");
          successUpload(body.message);
          setUpdatedProductData(updatedData);

          setDataChanged(true);
          setShowEditPopup(false);


        } else {
          console.log("Failed to edit inflow", body.error);
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

    const formData = new FormData();

    formData.append('date', date);
    formData.append('product_code', productCode);
    formData.append('barcode', barcode);
    formData.append('provider_company_tax_code', providerCompanyTaxCode);
    formData.append('receiver_company_tax_code', recieverCompanyTaxCode);
    formData.append('status', status);
    formData.append('place_of_use', placeOfUse);
    formData.append('amount', amount);
  
    // Append all the uploaded files
    console.log(uploadedFiles);
    for (let i = 0; i < uploadedFiles.length; i++) {
      formData.append('images', uploadedFiles[i]);
    }
    
    
  
    for(let pair of formData.entries()) {
      console.log(pair[0]+ ', '+ pair[1]); 
   }
   
   fetch(`http://127.0.0.1:8000/api/add_product_inflow/`, {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + String(access_token)
      },
      body:formData,
    })
      .then(response => response.json().then(data => ({ status: response.status, body: data })))
      .then(({ status, body }) => {
        if (status === 201) { // Assuming 201 is the success status code
          console.log("Product inflow added successfully");
          successUpload(body.message);
          setDataChanged(true);
          setUploadedFiles([]);
          setShowPopup(false);
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
    setShowEditPopup(false)

  };



  const successEdit = () => {
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
        Your edit has been successfully saved.
      </ReactBSAlert>
    );
    setRenderEdit(true)
  };

  const instantUploadFileChange = (e) => {
      const files = Array.from(e.target.files);
      let urls = [];
      
      files.forEach((file, index) => {
        console.log(`Uploading file ${index + 1}`);
  
        // Replace below simulated upload logic with your actual upload code if needed
        setTimeout(() => {
          urls.push(file.name); // Storing the name of the file instead of the blob URL
        }, 2000);
      });
  
      setTimeout(() => {
        console.log('All files uploaded successfully');
        setUploadedFileUrls(urls); // This will now store file names
        setUploadedFiles(files);
      }, 2000 * files.length); // Assuming each file takes 2 seconds to upload
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
    console.log(files)
    setCurrentFiles(files);
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
        'Authorization': 'Bearer ' + String(access_token)
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

                          <label>Malzeme Kodu</label>
      <FormGroup>
        <Select
          name="product_code"
          
          options={productOptions}
          onChange={(selectedOption) => setProductCode(selectedOption.value)}
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
                            <Select
                              name="provider_tax_code"

                              options={supplierOptions}
                              onChange={(selectedOption) => setProviderCompanyTaxCode(selectedOption ? selectedOption.value : '')}
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
  <input 
    type="file" 
    onChange={instantUploadFileChange}
    multiple 
  />
  {uploadedFiles.length > 0 && (
    <p>
      {uploadedFiles.length} files selected for upload
    </p>
  )}
</div>

<div className="uploaded-files-section">
  <ul>
    {uploadedFileUrls.map((name, index) => (
      <li key={index}>
        {name} {/* Displaying the file name directly */}
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
                    <CardTitle tag="h4">Ambar Giriş Düzenle</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Form onSubmit={handleEdit}>
                      <div>
                        <div className="form-group-col">
                          <label>Malzeme Kodu</label>
                          <FormGroup>
                            <Select
                              name="product_code"

                              options={productOptions}
                              onChange={(selectedOption) => setProductCode(selectedOption.value)}
                            />
                          </FormGroup>



                          <label>Tarih</label>
                          <FormGroup>
                            <Input
                              name="date"
                              type="text"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                            />
                          </FormGroup>

                          <label>Durum</label>
                          <FormGroup>
                            <Input
                              type="text"
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                            />
                          </FormGroup>

                          <label>Barkod</label>
                          <FormGroup>
                            <Input
                              type="text"
                              value={barcode}
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
                              value={amount}
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
                    <Button className="btn-round" color="danger" type="submit" onClick={handleCancel}>
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
                  data={dataTable.map((row, index) => ({
                    id: row[0],
                    date: row[1],
                    product_code: row[2],
                    barcode: row[3],
                    supplier_company_tax_code: row[4],
                    supplier_company_name: row[5],
                    receiver_company_tax_code: row[6],
                    receiver_company_name: row[7],
                    status: row[8],
                    place_of_use: row[9],
                    group: row[10],
                    subgroup: row[11],
                    brand: row[12],
                    serial_number: row[13],
                    model: row[14],
                    description: row[15],
                    unit: row[16],
                    amount: row[17],
                    uploaded_files: row[18],  // This line is added


                    actions: (
                      <div className='actions-left'>

                        <Button
                          disabled={showEditPopup}
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
                            disabled={showEditPopup}
                            onClick={() => {

                              warningWithConfirmAndCancelMessage()
                              const rowToDelete = { ...row };
                              const data = {
                                id: rowToDelete[0],

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
                      Header: 'Uploaded Files',
                      id: 'uploaded_files',
                      Cell: ({row: {original}}) => {
                        const numOfFiles = original.uploaded_files.length;
                    
                        return (
                          <Button 
                            color="link" 
                            onClick={() => handleShowModal(original.uploaded_files)}
                            title="Show Uploaded Files"
                          >
        <i className="fa fa-picture-o" /> 
                            <span>{numOfFiles}</span>
                          </Button>
                        );
                      },
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
  <div className="modal show d-block custom-modal" tabindex="-1">
    <div className="modal-dialog">
      <div className="modal-content custom-modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Uploaded Files</h5>
          <button type="button" className="close" onClick={handleHideModal}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          {currentFiles.map((file, index) => {
            // prepend the server's base URL to the relative file URL
            const imageUrl = `http://127.0.0.1:8000${file}`; 

            return (
              <p key={index}>
                <img src={imageUrl} alt={`file ${index}`} />
              </p>
            );
          })}
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
