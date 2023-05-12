import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col,Form, FormGroup, Label,CardFooter, Input} from 'reactstrap';
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
  const [oldData, setOldData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
//Variable Set
const [id, setId] = useState(null);
const [date, setDate] = useState(null);
const [productCode, setProductCode] = useState(null);
const [providerCompany, setProviderCompany] = useState(null);
const [recieverCompany, setRecieverCompany] = useState(null);
const [inflowOutflow, setInflowOutflow] = useState(null);
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
      const response = await fetch('http://127.0.0.1:8000/api/product_flow/',{
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
    setTimeoutId(setTimeout(() => setShowUploadDiv(true), 500));
   
    
  }
  const handleUploadClick = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const access_token = await localforage.getItem('access_token'); 
    fetch('http://127.0.0.1:8000/api/add_product_flow/', {
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
          fetch('http://127.0.0.1:8000/api/product_flow/',{
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
       
        const access_token =  await localforage.getItem('access_token');
        fetch(`http://127.0.0.1:8000/api/delete_product_flow/`, {
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

      setId(row.id);
      setDate(row.date);
      setProductCode(row.product_code);
      setProviderCompany(row.provider_company);
      setRecieverCompany(row.reciever_company);
      setInflowOutflow(row.inflow_outflow);
      setStatus(row.status);
      setPlaceOfUse(row.place_of_use);
      setGroup(row.group);
      setSubgroup(row.subgroup);
      setBrand(row.brand);
      setSerialNumber(row.serial_number);
      setModel(row.model);
      setDescription(row.description);
      setUnit(row.unit);
      setAmount(row.amount);
      setShowPopup(!showPopup);
      setIsUpdated(true);

    };

    const handleSubmit = async (e) => {
      const access_token =  await localforage.getItem('access_token');
      const updatedData = {
        new_id: id,
        new_date: date,
        new_product_code: productCode,
        new_provider_company: providerCompany,
        new_reciever_company: recieverCompany,
        new_inflow_outflow: inflowOutflow,
        new_status: status,
        new_place_of_use: placeOfUse,
        new_group: group,
        new_subgroup: subgroup,
        new_brand: brand,
        new_serial_number: serialNumber,
        new_model: model,
        new_description: description,
        new_unit: unit,
        new_amount: amount,

        old_id: oldData[0],
        old_date: oldData[1],
        old_product_code: oldData[2],
        old_provider_company: oldData[3],
        old_reciever_company: oldData[4],
        old_inflow_outflow: oldData[5],
        old_status: oldData[6],
        old_place_of_use: oldData[7],
        old_group: oldData[8],
        old_subgroup: oldData[9],
        old_brand: oldData[10],
        old_serial_number: oldData[11],
        old_model: oldData[12],
        old_description: oldData[13],
        old_unit: oldData[14],
        old_amount: oldData[15],
      };
      
      fetch('http://127.0.0.1:8000/api/edit_product_flow/', {
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

          setIsLoading(false);
          errorUpload(data.error);
        });
      }
      else{
        return response.json().then(data => {

         setEditData(updatedData);
          successEdit()
        });
      }

      // Call your Django API to send the updated values here
    });
  };

    const handleCancel = () => {
      setShowPopup(false);
      setEditData(null)
    };

    useEffect(() => {
      
      if(editData){
        setId(editData[0]);
        setDate(editData[1]);
        setProductCode(editData[2]);
        setProviderCompany(editData[3]);
        setRecieverCompany(editData[4]);
        setInflowOutflow(editData[5]);
        setStatus(editData[6]);
        setPlaceOfUse(editData[7]);
        setGroup(editData[8]);
        setSubgroup(editData[9]);
        setBrand(editData[10]);
        setSerialNumber(editData[11]);
        setModel(editData[12]);
        setDescription(editData[13]);
        setUnit(editData[14]);
        setAmount(editData[15]);
        setIsUpdated(true)
      }
    }, [editData])
    

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
      {showPopup && isUpdated &&(
       <div className="popup-sales">
      <Card>
            <CardHeader>
              <CardTitle tag="h4">Edit Sales</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
              <div>
        <div className="form-group-col-sales">

        <label>No</label>
        <FormGroup>
          <Input
            name="id"
            type="number"
            defaultValue={id}
            onChange={(e) => setId(e.target.value)}
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

        <label>Malzeme Kodu</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={productCode}
            onChange={(e) => setProductCode(e.target.value)}
          />
        </FormGroup>

        <label>Alınan Firma</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={providerCompany}
            onChange={(e) => setProviderCompany(e.target.value)}
          />
        </FormGroup>

        <label>Alan Firma</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={recieverCompany}
            onChange={(e) => setRecieverCompany(e.target.value)}
          />
        </FormGroup>

        <label>Giriş/Çıkış</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={inflowOutflow}
            onChange={(e) => setInflowOutflow(e.target.value)}
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
                <Button className="btn-round" color="success" type="submit" onClick={handleSubmit}>
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
    <CardTitle tag='h4'>SALES</CardTitle>
  </CardHeader>
  <CardBody>
    <div className="upload-container">
      {!showUploadDiv && (
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
                    provider_company : row[3],
                    reciever_company : row[4],
                    inflow_outflow : row[5],
                    status : row[6],
                    place_of_use : row[7],
                    group : row[8],
                    subgroup : row[9],
                    brand : row[10],
                    serial_number : row[11],
                    model : row[12],
                    description : row[13],
                    unit : row[14],
                    amount : row[15],

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
                                product_code: rowToDelete [2],
                                amount: rowToDelete [15]
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
                      Header: 'Alınan Firma',
                      accessor: 'provider_company'
                  },
                  {
                      Header: 'Alan Firma',
                      accessor: 'reciever_company'
                  },
                  {
                      Header: 'Giriş/Çıkış',
                      accessor: 'inflow_outflow'
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
