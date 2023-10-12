import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col, Input,Form, FormGroup, Label,CardFooter} from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';
import ReactBSAlert from "react-bootstrap-sweetalert";
import '../../assets/css/Table.css';
import localforage from 'localforage';
import debounce from 'lodash.debounce';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faEdit, faTrash, faSave, faTimes} from '@fortawesome/free-solid-svg-icons';

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

  const [show, setShow] = useState(false);
  const [modalProducts, setModalProducts] = useState([]);
  const [id, setId] = useState('');
  const [isEditingIndex, setIsEditingIndex] = useState(null);

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

  const handleShow = (products, id) => {
    console.log(id)
    setModalProducts(products);
    setId(id)
    setShow(true);
};

const handleClose = () => setShow(false);

const handleProductChange = (index, field, value) => {
  const updatedProducts = [...modalProducts];
  updatedProducts[index][field] = value;
  setModalProducts(updatedProducts);
};


const saveEditedProduct = async (index) => {
  const productToEdit = modalProducts[index];
  const backupProducts = [...modalProducts];
  const endpoint = `${process.env.REACT_APP_PUBLIC_URL}/edit_accounting_item/`;
  const payload = {
      item_id: productToEdit.item_id,
      unit_price: productToEdit.unit_price, // add these fields according to your React state structure
      discount_rate: productToEdit.discount_rate,
      discount_amount: productToEdit.discount_amount,
      tax_rate: productToEdit.tax_rate,
      tevkifat_rate: productToEdit.tevkifat_rate,
      price_without_tax: productToEdit.price_without_tax,
      unit_price_without_tax: productToEdit.unit_price_without_tax,
      price_with_tevkifat: productToEdit.price_with_tevkifat,
      price_total: productToEdit.price_total
  };

  try {
      const access_token = await localforage.getItem('access_token');

      const response = await fetch(endpoint, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              'Authorization': 'Bearer ' + String(access_token)
          },
          body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
         successUpload(data.message);
         setDataChanged(true)
      } else {
        setModalProducts(backupProducts); 
          errorUpload(data.error);
      }
  } catch (error) {
    setModalProducts(backupProducts); 
      console.error("Error while saving product:", error);
  }

  // Close the editor
  setIsEditingIndex(null);
};



  useEffect(() => {
    async function fetchData() {
      const access_token = await localforage.getItem('access_token'); 
      console.log(access_token)
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/accounting/`,{
       
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ String(access_token)
        }
      })
      const data = await response.json();
      console.log(data)
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
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/add_accounting/`, {
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
        
        fetch(`${process.env.REACT_APP_PUBLIC_URL}/accounting/`,{
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
        fetch(`${process.env.REACT_APP_PUBLIC_URL}/delete_accounting/`, {
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
  'productCode',
  'date',
  
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
  console.log(formData)
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

 
    
      fetch(`${process.env.REACT_APP_PUBLIC_URL}/edit_accounting/`, {
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
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/export_accounting/`, {
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
      console.log(name,value)
      // Update the respective state
      setFormData(prevData => ({ ...prevData, [name]: value }));

      // Example condition: Move to next input after 3 characters
    
  };

  
  return (
    <>
      <div className='content'>
      {alert}
      {/* Pop Up 
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
                <label >No</label>
                <Input value={formData.id} disabled></Input>
                </FormGroup>
           

                <FormGroup>
                <label>Product Code</label>
                <Input value={formData.productCode} disabled></Input>
                 </FormGroup>
            
                <FormGroup>
                <label>Date</label>
                <Input value={formData.date} disabled></Input>
                </FormGroup>
            
                <FormGroup>
                <label>Barcode</label>
                <Input value={formData.barcode} disabled></Input>
                </FormGroup>
            
                <FormGroup>
                <label>Provider Company</label>
                <Input value={formData.providerCompany} disabled></Input>
                </FormGroup>
                <FormGroup>
                <label>Receiver Company</label>
                <Input value={formData.receiverCompany} disabled></Input>
              </FormGroup>
           
              <FormGroup>
                <label>Status</label>
                <Input value={formData.status} disabled></Input>
                </FormGroup>

              
          
        </div>

        <div className="form-group-col-sales">
            
            <FormGroup>
                <label>Group</label>
                <Input value={formData.group} disabled></Input>
            </FormGroup>

            <FormGroup>
                <label>Subgroup</label>
                <Input value={formData.subgroup} disabled></Input>
            </FormGroup>

            <FormGroup>
                <label>Brand</label>
                <Input value={formData.brand} disabled></Input>
            </FormGroup>

            <FormGroup>
                <label>Serial Number</label>
                <Input value={formData.serialNumber} disabled></Input>
            </FormGroup>
            <FormGroup>
                <label>Model</label>
                <Input value={formData.model} disabled></Input>
            </FormGroup>
            <FormGroup>
                <label>Description</label>
                <Input value={formData.description} disabled></Input>
            </FormGroup>


            <FormGroup>
                <label>Unit</label>
                <Input value={formData.unit} disabled></Input>
            </FormGroup>
         
        </div>
        <div className="form-group-col-sales">
            <FormGroup>
                <label>Price Without Tax</label>
                <Input value={formData.priceWithoutTax} disabled></Input>
            </FormGroup>
            <FormGroup>
                <label>Unit Price Without Tax</label>
                <Input value={formData.unitPriceWithoutTax} disabled></Input>
            </FormGroup>
            <FormGroup>
                <label>Price With Tevkifat</label>
                <Input value={formData.priceWithTevkifat} disabled></Input>
            </FormGroup>
           
            <FormGroup>
                <label>Place Of Use</label>
                <Input value={formData.placeOfUse} disabled></Input>
            </FormGroup>
            <FormGroup>
                <label>Amount</label>
                <Input value={formData.amount} disabled></Input>
            </FormGroup>

            <FormGroup>
                <label>Price Total</label>
                <Input value={formData.priceTotal} disabled></Input>
            </FormGroup>
        </div>
        <div className="form-group-col-sales">
          
            <FormGroup>
                <label>Unit Price</label>
                <Input name="unitPrice" onChange={(e) => handleInputChange(e)} value={formData.unitPrice} />
            </FormGroup>
            <FormGroup>
                <label>Discount Rate</label>
                <Input name="discountRate" onChange={(e) => handleInputChange(e)} value={formData.discountRate} />
            </FormGroup>
            <FormGroup>
                <label>Discount Amount</label>
                <Input name="discountAmount" onChange={(e) => handleInputChange(e)} value={formData.discountAmount} />
            </FormGroup>
            <FormGroup>
                <label>Tax Rate</label>
                <Input 
                name="taxRate"
                 onChange={(e) =>handleInputChange(e)} value={formData.taxRate} />
            </FormGroup>
            <FormGroup>
                <label>Tevkifat Rate</label>
                <Input name="tevkifatRate"  onChange={(e) => handleInputChange(e)} value={formData.tevkifatRate} />
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
*/}
<Card>
  <CardHeader>
    <CardTitle tag='h4'>MUHASEBE</CardTitle>
  </CardHeader>
  <CardBody>
  
  </CardBody>
</Card>

        <Row>
          <Col md='12'>
            <Card>
              
              <CardBody>
              


                <ReactTable
                  data={dataTable.map((row, index) => ({
                    id: row.id,
                    bill_number:row.bill_number,
                    date: row.date,
                    items: row.items.map(item => ({
                      item_id:item.id,
                      product_code: item.product_code,
                      barcode: item.barcode,
                      status: item.status,
                      place_of_use: item.place_of_use,
                      group_name: item.group_name,
                      subgroup_name: item.subgroup_name,
                      brand: item.brand,
                      serial_number: item.serial_number,
                      model: item.model,
                      description: item.description,
                      unit: item.unit,
                      amount: item.amount,
                      unit_price:item.unit_price,
                      discount_rate:item.discount_rate,
                      discount_amount:item.discount_amount,
                      tax_rate:item.tax_rate,
                      tevkifat_rate:item.tevkifat_rate,
                      price_without_tax:item.price_without_tax,
                      unit_price_without_tax:item.unit_price_without_tax,
                      price_with_tevkifat:item.price_with_tevkifat,
                      price_total:item.price_total,
                    })),
                    supplier_company: row.supplier_company_name,
                    receiver_company: row.receiver_company_name,
                    supplier_company_tax_code: row.supplier_company_tax_code,
                    receiver_company_tax_code: row.receiver_company_tax_code,
                    total_price_total: row.price_total,
                    total_price_with_tevkifat: row.price_with_tevkifat
                    ,
                    total_price_without_tax: row.price_without_tax
                    ,
             
                   
                    actions: (
                      <div className='actions-left'>
                        
                        <>
    
    
                          
                          </>
                      </div>
                    ),
                  }))}
                  columns={[
                    { Header: 'No', accessor: 'id' },
                    { Header: 'Fatura Numarası', accessor: 'bill_number' },
                    { Header: 'Tarih', accessor: 'date' },
                    { Header: 'Alınan Firma', accessor: 'supplier_company' },
                    { Header: 'Alınan Firma Vergi Kodu', accessor: 'supplier_company_tax_code' },
                    { Header: 'Alan Firma', accessor: 'receiver_company' },
                    { Header: 'Alan Firma Vergi Kodu', accessor: 'receiver_company_tax_code' },
                    { Header: 'Toplam Fiyat(Vergiler Dahil)', accessor: 'total_price_total' },
                    { Header: 'Tevkifatlı Fiyat', accessor: 'total_price_with_tevkifat' },
                    { Header: 'Toplam Fiyat(Vergiler Hariç)', accessor: 'total_price_without_tax' },
                  
                    {
                      Header: 'Products',
                      id: 'products',
                      accessor: d => d.items.length,
                      Cell: ({ row: { original } }) => {
                          return (
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <i className="fa fa-cube" title="View Products" style={{ cursor: 'pointer', marginRight: '5px' }}
                                      onClick={() => handleShow(original.items,original.id)} />
                                  <span>{original.items.length}</span>
                              </div>
                          );
                      }
                  },
                    { Header: 'İşlemler', accessor: 'actions', sortable: false, filterable: false }
                  ]}
                  
                  defaultPageSize={10}
                  className='-striped -highlight'
                  />
                  </CardBody>
                  </Card>
                  </Col>
                  </Row>
                  </div>

                  
{show && (
  <div className="modal show d-block custom-modal" tabIndex="-1">
 <div className="modal-dialog modal-xl">

      <div className="modal-content custom-modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Products List</h5>
          <button type="button" className="close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body modal-body-scroll">
   
<table className="horizontal-table">
<thead>
            <tr>
                <th>Product</th>
                <th>Malzeme Kodu</th>
                <th>Açıklama</th>
                <th>Miktar</th>
                <th>Barkod</th>
                <th>Marka</th>
                <th>Model</th>
                <th>Kullanım Yeri</th>
                <th>Seri Numarası</th>
                <th>Durum</th>
                <th>Grup Adı</th>
                <th>Altgrup Adı</th>
                <th>Birim</th>
                <th>Birim Fiyatı</th>
                <th>İndirim Oranı(%)</th>
                <th>İndirim Miktarı</th>
                <th>Vergi Oranı(%)</th>
                <th>Tevkifat Oranı(%)</th>
                <th>Fiyat(Vergiler Hariç)</th>
                <th>Birim Fiyat(Vergiler Hariç)</th>
                <th>Tevkifatlı Fiyat</th>
                <th>Toplam Fiyat(Vergiler Dahil)</th>

            </tr>
        </thead>
        <tbody>

        {modalProducts.map((product, index) => (
        <tr key={index} >
            {isEditingIndex === index ? (
               
                <td colSpan="13">
                <div>
                  

                  <label>Birim Fiyat</label>
                    <FormGroup>
                        <Input
                            type="text"
                            value={product.unit_price || ''}
                            onChange={(e) => handleProductChange(index, 'unit_price', e.target.value)}
                        />
                    </FormGroup>

                    <label>İndirim Oranı(%)</label>
                    <FormGroup>
                        <Input
                            type="text"
                            value={product.discount_rate || ''}
                            onChange={(e) => handleProductChange(index, 'discount_rate', e.target.value)}
                        />
                    </FormGroup>

                        
                    <label>İndirim Miktarı</label>
                    <FormGroup>
                        <Input
                            type="text"
                            value={product.discount_amount || ''}
                            onChange={(e) => handleProductChange(index, 'discount_amount', e.target.value)}
                        />
                    </FormGroup>

                    
                    <label>Vergi Oranı(%)</label>
                    <FormGroup>
                        <Input
                            type="text"
                            value={product.tax_rate || ''}
                            onChange={(e) => handleProductChange(index, 'tax_rate', e.target.value)}
                        />
                    </FormGroup>

                    <label>Tevkifat Oranı(%)</label>
                    <FormGroup>
                        <Input
                            type="text"
                            value={product.tevkifat_rate || ''}
                            onChange={(e) => handleProductChange(index, 'tevkifat_rate', e.target.value)}
                        />
                    </FormGroup>

                    <label> Fiyat(Vergiler Hariç)</label>
                    <FormGroup>
                        <Input
                            type="text"
                            disabled
                            value={product.price_without_tax || ''}
                           
                        />
                    </FormGroup>

                    <label>Birim Fiyat(Vergiler Hariç)</label>
                    <FormGroup>
                        <Input
                            type="text"
                            disabled
                            value={product.unit_price_without_tax || ''}
                        />
                    </FormGroup>

                    <label>Tevkifatlı Fiyat</label>
                    <FormGroup>
                        <Input
                            type="text"
                            disabled
                            value={product.price_with_tevkifat || ''}
                        />
                    </FormGroup>



                    <label>Toplam Fiyat(Vergiler Dahil)</label>
                    <FormGroup>
                        <Input
                            type="text"
                            disabled
                            value={product.price_total || ''}
                        />
                    </FormGroup>

                    
                    

                   
                 

               



                    {/* ... you can continue with other product inputs in a similar fashion ... */}

                    <button type="button" className="icon-button" onClick={() => saveEditedProduct(index)}>
                        <FontAwesomeIcon icon={faSave} />
                    </button>
                    <button type="button" className="icon-button" onClick={() => setIsEditingIndex(null)}>
                        <FontAwesomeIcon icon={faTimes} /> {/* Cancel editing icon */}
                    </button>
                </div>
                </td>  
            ) : (

              <>
              <td>
               
            
                    <button type="button" className="icon-button" onClick={() => setIsEditingIndex(index)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    
                     {index + 1}
                    </td>
                    <td>{product.product_code}</td>
                            <td>{product.description}</td>
                            <td>{product.amount}</td>
                            <td>{product.barcode}</td>
                            <td>{product.brand}</td>
                            <td>{product.model}</td>
                            <td>{product.place_of_use}</td>
                            <td>{product.serial_number}</td>
                            <td>{product.status}</td>
                            <td>{product.group_name}</td>
                            <td>{product.subgroup_name}</td>
                            <td>{product.unit}</td>
                            <td>{product.unit_price}</td>
                            <td>{product.discount_rate}</td>
                            <td>{product.discount_amount}</td>
                            <td>{product.tax_rate}</td>
                            <td>{product.tevkifat_rate}</td>
                            <td>{product.price_without_tax}</td>
                            <td>{product.unit_price_without_tax}</td>
                            <td>{product.price_with_tevkifat}</td>
                            <td>{product.price_total}</td>


             
            </>
            )}
            </tr>
             ))}
             </tbody>
             </table>
        </div>

   


        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose}>Close</button>
        

        </div>
      </div>
    </div>
  </div>
)}

                  </>
                  );
                  };
                  
                  export default DataTable;
