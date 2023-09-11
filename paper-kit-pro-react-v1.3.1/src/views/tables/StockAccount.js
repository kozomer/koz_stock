import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col, Input,Form, FormGroup, Label,CardFooter} from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';
import ReactBSAlert from "react-bootstrap-sweetalert";
import '../../assets/css/Table.css';
import localforage from 'localforage';
import debounce from 'lodash.debounce';

const DataTable = () => {
  const [dataTable, setDataTable] = useState([]);
  const [file, setFile] = useState(null);
  const [dataChanged, setDataChanged] = useState(false);
  const [showUploadDiv, setShowUploadDiv] = useState(false);
  const [alert, setAlert] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [renderEdit, setRenderEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  /* Variables */

  const [formData, setFormData] = useState({
    id :  '' ,
    date  :   '' ,
    productCode :   '' ,
    barcode :   '' ,
    providerCompany  :   '' ,
    receiverCompany  :   '' ,
    status  :   '' ,
    placeOfUse  :   '' ,
    group :   '' ,
    subgroup :   '' ,
    brand :   '' ,
    serialNumber  :   '' ,
    model :   '' ,
    description  :   '' ,
    unit  :   '' ,
    amount  :   '' ,
    unitPrice  :   '' ,
    discountRate  :   '' ,
    discountAmount  :   '' ,
    taxRate :   '' ,
    tevkifatRate :   '' ,
    priceWithoutTax :   '' ,
    unitPriceWithoutTax :   '' ,
    priceWithTevkifat :   '' ,
    priceTotal:   '' ,

});


/*
  const setters = [
    setId, setProductCode, setDate, setBarcode, setProviderCompany,
    setReceiverCompany, setStatus, setPlaceOfUse, setGroup, setSubgroup,
    setBrand, setSerialNumber, setModel, setDescription, setUnit, setAmount,
    setUnitPrice, setDiscountRate, setDiscountAmount, setTaxRate, setTevkifatRate,
    setPriceWithoutTax, setUnitPriceWithoutTax, setPriceWithTevkifat, setPriceTotal
];
*/

  const [productData, setProductData] = useState(null);


  const refs = {
     idRef : React.useRef(null),
     productCodeRef : React.useRef(null),
     dateRef : React.useRef(null),
     barcodeRef : React.useRef(null),
     providerCompanyRef : React.useRef(null),
     receiverCompanyRef : React.useRef(null),
     statusRef : React.useRef(null),
     placeOfUseRef : React.useRef(null),
     groupRef : React.useRef(null),
     subgroupRef : React.useRef(null),
     brandRef : React.useRef(null),
     serialNumberRef : React.useRef(null),
     modelRef : React.useRef(null),
     descriptionRef : React.useRef(null),
     unitRef : React.useRef(null),
     amountRef : React.useRef(null),
     unitPriceRef : React.useRef(null),
     discountRateRef : React.useRef(null),
     discountAmountRef : React.useRef(),
     taxRateRef : React.useRef(null),
     tevkifatRateRef : React.useRef(null),
     priceWithoutTaxRef : React.useRef(null),
     unitPriceWithoutTaxRef : React.useRef(null),
     priceWithTevkifatRef : React.useRef(null),
     priceTotalRef : React.useRef(null),
};
  

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
      console.log(access_token)
      const response = await fetch('http://127.0.0.1:8000/api/accounting/',{
       
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ String(access_token)
        }
      })
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
    setShowPopup(true);
  }
  const handleUploadClick = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const access_token = await localforage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/add_accounting/', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Bearer '+ String(access_token)
      }
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
        
        fetch('http://127.0.0.1:8000/api/accounting/',{
          headers: {
            'Authorization': 'Bearer '+ String(access_token)
          }
        })
          .then((response) => response.json())
          
          .then((data) => setDataTable(data));
          
      })
      .finally(() => {
        setShowUploadDiv(false);
        
      });
    
    }
    })
  };
  
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
       console.log("delete")
       const access_token =  await localforage.getItem('access_token'); 
        fetch(`http://127.0.0.1:8000/api/delete_accounting/`, {
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


    


// 2. Define the formKeys array in the correct order
const formKeys = [
  'id',
  'date',
  'productCode',
  'barcode',
  'providerCompany',
  'receiverCompany',
  'status',
  'placeOfUse',
  'group',
  'subgroup',
  'brand',
  'serialNumber',
  'model',
  'description',
  'unit',
  'amount',
  'unitPrice',
  'discountRate',
  'discountAmount',
  'taxRate',
  'tevkifatRate',
  'priceWithoutTax',
  'unitPriceWithoutTax',
  'priceWithTevkifat',
  'priceTotal'
];

// Continue with your useEffect to map productData to formData
useEffect(() => {
if (productData) {
  const updatedFormData = {};

  formKeys.forEach((key, index) => {
    updatedFormData[key] = productData[index];
  });

  setFormData(updatedFormData);
}
}, [productData]);
  
    const handleClick = (row) => {
      setProductData(row);
      setShowPopup(true);
    };
  
    const handleEdit = async (event) => {
      event.preventDefault();
      console.log(formData);
      const access_token = await localforage.getItem('access_token'); 
      const updatedData = {
        old_id:formData.id,
        unit_price:formData.unitPrice,
        discount_rate:formData.discountRate,
        discount_amount:formData. discountAmount,
        tax_rate:formData. taxRate,
        tevkifat_rate:formData. tevkifatRate,
        price_without_tax:formData.priceWithoutTax,
        unit_price_without_tax: formData.unitPriceWithoutTax,
        price_with_tevkifat:formData. priceWithTevkifat,
        price_total:formData. priceTotal,
      };

 
    
      fetch(`http://127.0.0.1:8000/api/edit_accounting/`, {
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
          setShowPopup(false);
         
           
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
  

    const handleCancel = () => {
      setShowPopup(false);
      
    };

    

    async function handleExportClick() {
      // Retrieve the access token from localForage
      const access_token = await localforage.getItem('access_token');
    
      // Make an AJAX request to the backend to download the CSV file
      const response = await fetch('http://127.0.0.1:8000/api/export_accounting/', {
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

    

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      
      // Update the respective state
      setFormData(prevData => ({ ...prevData, [name]: value }));

      // Example condition: Move to next input after 3 characters
    
  };

  
  return (
    <>
      <div className='content'>
      {alert}
      {/* Pop Up */}
      {showPopup && (
       <div className="popup-sales">
      <Card>
            <CardHeader>
              <CardTitle tag="h4">Muhasebe Girişi Düzenle</CardTitle>
            </CardHeader>
            <CardBody>
            <Form onSubmit={handleEdit}>
    <div>

        <div className="form-group-col-sales">
        
                  <FormGroup>
                <label>No</label>
                <div>{formData.id}</div>
                </FormGroup>
           

                <FormGroup>
                <label>Product Code</label>
                <div>{formData.productCode} </div>
                 </FormGroup>
            
                <FormGroup>
                <label>Date</label>
                <div>{formData.date} </div>
                </FormGroup>
            
                <FormGroup>
                <label>Barcode</label>
                <div>{formData.barcode}</div>
                </FormGroup>
            
                <FormGroup>
                <label>Provider Company</label>
                <div>{formData.providerCompany} </div>
                </FormGroup>
                <FormGroup>
                <label>Receiver Company</label>
              <div>{formData.receiverCompany} </div>
              </FormGroup>
           
              <FormGroup>
                <label>Status</label>
                <div>{formData.status} </div>
                </FormGroup>

                <FormGroup>
                <label>Place Of Use</label>
              <div>{formData.placeOfUse}</div>
            </FormGroup>
          
        </div>

        <div className="form-group-col-sales">
            
            <FormGroup>
                <label>Group</label>
               <div>{formData.group}</div>
            </FormGroup>

            <FormGroup>
                <label>Subgroup</label>
              <div>{formData.subgroup}</div> 
            </FormGroup>

            <FormGroup>
                <label>Brand</label>
                <div>{formData.brand}</div>
            </FormGroup>

            <FormGroup>
                <label>Serial Number</label>
                <div>{formData.serialNumber} </div>
            </FormGroup>
            <FormGroup>
                <label>Model</label>
               <div> {formData.model}</div>
            </FormGroup>
            <FormGroup>
                <label>Description</label>
               <div>{formData.description}</div>
            </FormGroup>


            <FormGroup>
                <label>Unit</label>
                <div>{formData.unit}</div>
            </FormGroup>
            <FormGroup>
                <label>Amount</label>
                <div>{formData.amount}</div>
            </FormGroup>
        </div>

        <div className="form-group-col-sales">
          
            <FormGroup>
                <label>Unit Price</label>
                <Input name="unitPrice" onChange={(e) => handleInputChange(e)} value={formData.unitPrice} />
            </FormGroup>
            <FormGroup>
                <label>Discount Rate</label>
                <Input  onChange={(e) => handleInputChange(e)} value={formData.discountRate} />
            </FormGroup>
            <FormGroup>
                <label>Discount Amount</label>
                <Input ref={refs.discountAmountRef} onChange={(e) => handleInputChange(e)} defaultValue={formData.discountAmount} />
            </FormGroup>
            <FormGroup>
                <label>Tax Rate</label>
                <Input ref={refs.taxRateRef} onChange={(e) =>handleInputChange(e)} defaultValue={formData.taxRate} />
            </FormGroup>
            <FormGroup>
                <label>Tevkifat Rate</label>
                <Input ref={refs.tevkifatRateRef} onChange={(e) => handleInputChange(e)} defaultValue={formData.tevkifatRate} />
            </FormGroup>
        </div>

        <div className="form-group-col-sales">
            <FormGroup>
                <label>Price Without Tax</label>
                <Input ref={refs.priceWithoutTaxRef} onChange={(e) => handleInputChange(e)} defaultValue={formData.priceWithoutTax} />
            </FormGroup>
            <FormGroup>
                <label>Unit Price Without Tax</label>
                <Input ref={refs.unitPriceWithoutTaxRef} onChange={(e) => handleInputChange(e)} defaultValue={formData.unitPriceWithoutTax} />
            </FormGroup>
            <FormGroup>
                <label>Price With Tevkifat</label>
                <Input ref={refs.priceWithTevkifatRef} onChange={(e) => handleInputChange(e)} defaultValue={formData.priceWithTevkifat} />
            </FormGroup>
            <FormGroup>
                <label>Price Total</label>
                <Input ref={refs.priceTotalRef} onChange={(e) => handleInputChange(e)} defaultValue={formData.priceTotal} />
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
    <CardTitle tag='h4'>MUHASEBE</CardTitle>
  </CardHeader>
  <CardBody>
    <div className="upload-container">
      {!showUploadDiv && (
        <div className="d-flex justify-content-between align-items-center">
          <Button className="my-button-class" color="primary" onClick={handleAddFileClick}>
            <i className="fa fa-plus-circle mr-1"></i>
            MUHASEBE GİRİŞİ EKLE
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

        <Row>
          <Col md='12'>
            <Card>
              
              <CardBody>
              


                <ReactTable
                  data={dataTable.map((row, index) => ({
                    id: row[0],
                    product_code: row[1],
                    date: row[2],
                    barcode: row[3],
                    provider_company: row[4],
                    receiver_company: row[5],
                    status: row[6],
                    place_of_use: row[7],
                    group: row[8],
                    subgroup: row[9],
                    brand: row[10],
                    serial_number: row[11],
                    model: row[12],
                    description: row[13],
                    unit: row[14],
                    amount: row[15],
                    unit_price: row[16],
                    discount_rate: row[17],
                    discount_amount: row[18],
                    tax_rate: row[19],
                    tevkifat_rate: row[20],
                    price_without_tax: row[21],
                    unit_price_without_tax: row[22],
                    price_with_tevkifat: row[23],
                    price_total: row[24],

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
                    { Header: 'No', accessor: 'id' },
                    { Header: 'Malzeme Kodu', accessor: 'product_code' },
                    { Header: 'Tarih', accessor: 'date' },
                    { Header: 'Barkod', accessor: 'barcode' },
                    { Header: 'Alınan Firma', accessor: 'provider_company' },
                    { Header: 'Alan Firma', accessor: 'receiver_company' },
                    { Header: 'Durum', accessor: 'status' },
                    { Header: 'Kullanım Yeri', accessor: 'place_of_use' },
                    { Header: 'Grup', accessor: 'group' },
                    { Header: 'Alt Grup', accessor: 'subgroup' },
                    { Header: 'Marka', accessor: 'brand' },
                    { Header: 'Seri Numarası', accessor: 'serial_number' },
                    { Header: 'Model', accessor: 'model' },
                    { Header: 'Açıklama', accessor: 'description' },
                    { Header: 'Birim', accessor: 'unit' },
                    { Header: 'Miktar', accessor: 'amount' },
                    { Header: 'Birim Fiyatı', accessor: 'unit_price' },
                    { Header: 'İndirim Oranı', accessor: 'discount_rate' },
                    { Header: 'İndirim Miktarı', accessor: 'discount_amount' },
                    { Header: 'KDV Oranı', accessor: 'tax_rate' },
                    { Header: 'Tevkifat Oranı', accessor: 'tevkifat_rate' },
                    { Header: 'Toplam Fiyat(Vergiler Hariç)', accessor: 'price_without_tax' },
                    { Header: 'Birim Fiyat(Vergiler Hariç)', accessor: 'unit_price_without_tax' },
                    { Header: 'Tevkifatlı Fiyat', accessor: 'price_with_tevkifat' },
                    { Header: 'Toplam Fiyat(Vergiler Dahil)', accessor: 'price_total' },

                    { Header: 'İşlemler', accessor: 'actions' ,sortable: false,
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
