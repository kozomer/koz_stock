import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardHeader,ListGroup, CardBody, CardTitle, Row, Col, Form, FormGroup, Label, CardFooter, Input } from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';
import '../../assets/css/Table.css';
import ReactBSAlert from "react-bootstrap-sweetalert";
import localforage from 'localforage';
import { FaFileUpload } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faEdit, faTrash, faSave, faTimes} from '@fortawesome/free-solid-svg-icons';


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
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  //Variable Set
  const [productData, setProductData] = useState(null);
  const [id, setId] = useState('');
  const [date, setDate] = useState('');
  const [billNo, setBillNo] = useState('');
  const [productCode, setProductCode] = useState('');
  const [barcode, setBarcode] = useState('');
  const [supplierCompanyTaxCode, setSupplierCompanyTaxCode] = useState('');
  const [supplierCompanyName, setSupplierCompanyName] = useState('');
  const [receiverCompanyTaxCode, setReceiverCompanyTaxCode] = useState('');
  const [recieverCompanyName, setRecieverCompanyName] = useState('');
  const [status, setStatus] = useState('');
  const [placeOfUse, setPlaceOfUse] = useState('');

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

  const [uploadedFileUrlsModal, setUploadedFileUrlsModal] = useState([]);

  const [mode, setMode] = useState(null);  // This will store 'edit' or 'add'


  const [rows, setRows] = useState([{}]);

  const [show, setShow] = useState(false);
const [modalProducts, setModalProducts] = useState([]);
const [isEditingIndex, setIsEditingIndex] = useState(null);


const startEditProduct = (index) => {
  setIsEditingIndex(index);
};

const saveEditedProduct = async (index) => {
  const productToEdit = modalProducts[index];
  let endpoint;
  let payload;
  console.log(productToEdit)
  if (mode === 'edit') {
      endpoint = `${process.env.REACT_APP_PUBLIC_URL}/edit_product_inflow_item/`;
      payload = {
          item_id: productToEdit.item_id,
          product_code: productToEdit.product_code,
          barcode: productToEdit.barcode,
          status: productToEdit.status,
          place_of_use: productToEdit.place_of_use,
          amount: productToEdit.amount
      };
  } else if (mode === 'add') {
      endpoint = `${process.env.REACT_APP_PUBLIC_URL}/add_product_inflow_item/`;
      payload = {
          inflow_id: id,  // Assuming you have this inflow_id
          product_code: productToEdit.product_code,
          barcode: productToEdit.barcode,
          status: productToEdit.status,
          place_of_use: productToEdit.place_of_use,
          amount: productToEdit.amount
      };
      console.log(id)
  } else {
      // Neither edit nor add mode, return early or handle this case as appropriate
      return;
  }

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
         successUpload(data.message)
      } else {
          errorUpload(data.error)
      }
  } catch (error) {
      console.error("Error while saving product:", error);
  }

  // Close the editor and reset the mode
  setIsEditingIndex(null);
  setMode(null);
};


const handleProductChange = useCallback((index, field, value) => {
  setModalProducts(prevProducts => {
    const updatedProducts = [...prevProducts];
    updatedProducts[index][field] = value;
    return updatedProducts;
  });
}, []);

const deleteProduct = async (index) => {
  const productToDelete = modalProducts[index];

  // Construct the payload to send to the API
  const deleteData = {
      item_id: productToDelete.item_id,  // Assuming each product has a unique id
  };

  try {
      const access_token = await localforage.getItem('access_token');

      // Make the API call
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/delete_product_inflow_item/`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              'Authorization': 'Bearer ' + String(access_token)
          },
          body: JSON.stringify(deleteData)
      });

      const data = await response.json();

      if (response.status === 200) {
          successUpload(data.message)
          // Remove product from local state after successful deletion from server
          const updatedProducts = [...modalProducts];
          updatedProducts.splice(index, 1);
          setModalProducts(updatedProducts);
      } else {
        errorUpload(data.error)
          // Show an error message to the user
      }
  } catch (error) {
      console.error("Error while deleting product:", error);
      // Show an error message to the user
  }
};


const addProduct = () => {
  const newProduct = {
      // add default or empty values for a new product
  };
  setModalProducts(prevProducts => [...prevProducts, newProduct]);
  setIsEditingIndex(modalProducts.length); // To edit the last product (the newly added one).
};



const handleClose = () => setShow(false);
const handleShow = (products, id) => {
    console.log(id)
    setModalProducts(products);
    setId(id)
    setShow(true);
};


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


  
  const handleAddRow = () => {
    setRows([...rows, {}]); // Add an empty row to the rows state
  };

  const handleRemoveRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };


  const handleInputChange = useCallback((index, fieldName, value) => {
    setRows(prevRows => {
        // Clone the array for immutability
        const newRows = [...prevRows];
        
        // Check if the object at the index exists, if not, create it
        if (!newRows[index]) {
            newRows[index] = {};
        }
        
        // Now, set the property
        newRows[index][fieldName] = value;

        return newRows;  // This line returns the updated rows array, thus applying the update
    });
}, []);


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


  const deleteImage = (index,id) => {

    setAlert(

      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Emin misiniz?"
        onConfirm={() => {
          handleDeleteFile(index,id)
        }}
        onCancel={() => {
          
          cancelDelete()
        }}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Evet, sil!"
        cancelBtnText="İptal et"
        showCancel
        btnSize=""
      >
        Bu görsel silinecektir!
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
          const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/delete_product_inflow/`, {
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

  /* Helper functions to find tax codes by names */
  const getTaxCodeByName = (name) => {
    const matchingConsumer = consumerList.find(consumer => consumer[2] === name);
    return matchingConsumer ? String(matchingConsumer[1]) : '';
  }


  
  /* */

  useEffect(() => {
    if (productData) {
      console.log(productData.supplier_company_tax_code)
      setId(productData.id);
      setBillNo(productData.bill_number)
      console.log("pre value:",date)
      setDate(productData.date);
      console.log("after set:",date)
      setSupplierCompanyTaxCode(productData.supplier_company_tax_code);
      setReceiverCompanyTaxCode(productData.receiver_company_tax_code);

      
     

    }
  }, [productData]);

  useEffect(() => {
    console.log(receiverCompanyTaxCode)
    console.log("Matching Option:",supplierOptions.find(option => String(option.value) === String(supplierCompanyTaxCode)));
    ;
    console.log("Supplier Options:",supplierOptions)
    
 
  }, [supplierCompanyTaxCode,
  receiverCompanyTaxCode]);

  const handleClick = (row) => {
    setProductData(row);
    setSupplierCompanyTaxCode(row.supplier_company_tax_code);
    setReceiverCompanyTaxCode(row.receiver_company_tax_code);
    setShowEditPopup(true);
  };

  useEffect(() => {
    async function fetchOptions() {
      try {
        const access_token = await localforage.getItem('access_token');

        const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/search_supplier_consumer_product/`, {
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

  console.log()

  
  console.log("Matching Option:", supplierOptions.find(option => option.value ===  supplierCompanyTaxCode));
   console.log("Supplier Options:",supplierOptions)
   

  const handleEdit = async (event) => {
    event.preventDefault();



    const access_token = await localforage.getItem('access_token');
    const updatedData = {
      inflow_id: id,
      bill_number:billNo,
      supplier_tax_code: supplierCompanyTaxCode,
      receiver_tax_code: receiverCompanyTaxCode,
      date:date,
      
      
    };

    fetch(`${process.env.REACT_APP_PUBLIC_URL}/edit_product_inflow/`, {
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
    let productsArray = [];

    const formData = new FormData();

    formData.append('date', date);
    formData.append('bill_number',billNo)
    formData.append('provider_company_tax_code', supplierCompanyTaxCode);
    formData.append('receiver_company_tax_code', receiverCompanyTaxCode);
  

    rows.forEach(row => {
      productsArray.push({
          product_code: row.productCode,
          barcode: row.barcode,
          status: row.status,
          place_of_use: row.placeOfUse,
          amount: row.amount
      });
  });

  formData.append('products', JSON.stringify(productsArray));
    // Append all the uploaded files
    console.log(formData);
    for (let i = 0; i < uploadedFiles.length; i++) {
      formData.append('images', uploadedFiles[i]);
    }
    
    
  
    for(let pair of formData.entries()) {
      console.log(pair[0]+ ', '+ pair[1]); 
   }
   
   fetch(`${process.env.REACT_APP_PUBLIC_URL}/add_product_inflow/`, {
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
          resetForm();
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

  const resetForm = () => {
    setDate('');  // Or set to initial value
    setBillNo('');  // Or set to initial value
    setSupplierCompanyTaxCode('');  // Or set to initial value
    setReceiverCompanyTaxCode('');  // Or set to initial value
    setRows([]);  // Assuming initial value is an empty array
    setUploadedFiles([]);  // Resetting to empty array
};

  const handleCancel = () => {
    setShowPopup(false);
    setShowEditPopup(false)
    setId('');
    setDate('');
    setProductCode('');
    setBillNo('');
    setSupplierCompanyTaxCode('');

    
    setReceiverCompanyTaxCode('');
    setStatus('')
    setBarcode('');
    setPlaceOfUse('');
    setAmount('');


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



  const handleDeleteFile = async(index,rowId) => {
    let fileToDelete = currentFiles[index];
    const filename = fileToDelete.split('/').pop(); // Assuming the filename is the last part after the slash
    const access_token = await localforage.getItem('access_token');
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/delete_image/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(access_token)
          // Add other headers like authorization if required
      },
      body: JSON.stringify({
          content_type: "product_inflow",
          id:rowId, // You need to have the row id here. Pass it when you call handleDeleteFile
          image: filename
      })
  })
  .then(response => response.json())
  .then(data => {
      if(data.message) {
          successDelete(data.message)
          let updatedFiles = [...currentFiles];
          updatedFiles.splice(index, 1);
          setCurrentFiles(updatedFiles);
      } else if(data.error) {
          errorUpload(data.message)
      }
  })
  .catch(error => console.error("Error:", error));
  };


  useEffect(() => {
    
  }, [currentFiles]);

  const instantUploadFileChange = (e) => {
      const files = Array.from(e.target.files);
      let urls = [];
      setIsLoading(true);
      files.forEach((file, index) => {
        console.log(`Uploading file ${index + 1}`);
  
        // Replace below simulated upload logic with your actual upload code if needed
        setTimeout(() => {
          urls.push(file.name); // Storing the name of the file instead of the blob URL
        }, 2000);
      });

      console.log("Coming file:",e.target.files)
      console.log("Files:",files)
  
      setTimeout(() => {
        console.log('All files uploaded successfully');
        setUploadedFileUrls(urls); // This will now store file names
        setUploadedFiles(files);
        setIsLoading(false);

      }, 2000 * files.length); // Assuming each file takes 2 seconds to upload
  };


  
  const UploadFileChangeInModal = async (e) => {
    const files = Array.from(e.target.files);
    let urls = [];
    setIsLoadingModal(true);
    const localURLs = files.map(file => URL.createObjectURL(file));

    // Add the local URLs to the currentFiles state for immediate display
    setCurrentFiles(prevFiles => [...prevFiles, ...localURLs]);

    files.forEach((file, index) => {
        console.log(`Uploading file ${index + 1}`);
        setTimeout(() => {
            urls.push(file.name); 
        }, 2000);
    });

    console.log("Coming file:", e.target.files)
    console.log("Files:", files)

    setTimeout(async () => {
        console.log('All files uploaded successfully');
        setUploadedFileUrlsModal(urls);

        const access_token = await localforage.getItem('access_token');
        const formData = new FormData();
        formData.append('content_type', "product_inflow");
        formData.append('id', id);
        files.forEach(file => {
            formData.append('images', file);
        });

        fetch(`${process.env.REACT_APP_PUBLIC_URL}/add_image/`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + String(access_token)
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
          setIsLoadingModal(false);
          const updatedURLs = data.images || []; // Adjust this according to your server response structure
          setCurrentFiles(prevFiles => {
              let newFiles = [...prevFiles];
              localURLs.forEach((localURL, index) => {
                  const indexOfLocal = newFiles.indexOf(localURL);
                  if (indexOfLocal !== -1 && updatedURLs[index]) {
                      newFiles[indexOfLocal] = updatedURLs[index];
                  }
              });
              return newFiles;
          });

          setUploadedFileUrlsModal([]); // Assuming you're done with this and clearing it
        })
        .catch(error => {
            console.error('Error uploading images:', error);
        });

    }, 2000 * files.length); 
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
  const handleShowModal = (files,rowId) => {
    setId(rowId)
    setCurrentFiles(files);
    setShowModal(true);
  };

  // Function to handle hiding the modal
  const handleHideModal = () => {
    setUploadedFileUrlsModal([]);
    setShowModal(false);
  };

  async function handleExportClick() {
    // Retrieve the access token from localForage
    const access_token = await localforage.getItem('access_token');

    // Make an AJAX request to the backend to download the CSV file
    const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/export_sales/`, {
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
              <div className="popup-inflow">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4">Ambar Giriş Ekle</CardTitle>
                  </CardHeader>
                  <CardBody>
        <Form onSubmit={handleAdd}>
          {/* General details */}
          <div className="form-general">

          <label>İrsaliye No</label>
            <FormGroup>
              <Input
                name="bill_number"
                type="text"
                value={billNo}
                onChange={(e) => setBillNo(e.target.value)}
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
            <label>Alıcı Vergi No</label>
            <FormGroup>
              <Select
                name="receiver_tax_code"
                options={consumerOptions}
                onChange={(selectedOption) => setReceiverCompanyTaxCode(selectedOption ? selectedOption.value : '')}
              />
            </FormGroup>
            <label>Tedarikçi Vergi No</label>
            <FormGroup>
              <Select
                name="supplier_tax_code"
                options={supplierOptions}
                onChange={(selectedOption) => setSupplierCompanyTaxCode(selectedOption ? selectedOption.value : '')}
              />
            </FormGroup>
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
        {isLoading ? (
          <div className="loading-icon">
            {/* Use your own LoadingIcon component or an icon from any library */}
            {/* <LoadingIcon /> */}
            Loading...
          </div>
        ) : (
          <ul>
            {uploadedFileUrls.map((name, index) => (
              <li key={index}>
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
          </div>

          {/* Dynamic product rows */}
          {rows.map((row, index) => (
  <div key={index} className="dynamic-row">

    <hr className="row-separator"/> {/* Horizontal separator line */}
    <h5 className="row-subheader">{`Product ${index + 1}`}</h5> {/* Subheader indicating product number */}
    
    <label>Malzeme Kodu</label>
    <FormGroup>
      <Select
        name="product_code"
        options={productOptions}
        value={productOptions.find(option => option.value === row.productCode)}
        onChange={(selectedOption) => handleInputChange(index, 'productCode', selectedOption.value)}
      />
    </FormGroup>

    <label>Miktar</label>
    <FormGroup>
      <Input
        type="text"
        value={row.amount || ''}
        onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
      />
    </FormGroup>

    <label>Barkod</label>
    <FormGroup>
      <Input
        type="text"
        value={row.barcode || ''}
        onChange={(e) => handleInputChange(index, 'barcode', e.target.value)}
      />
    </FormGroup>

    <label>Durum</label>
    <FormGroup>
      <Input
        type="text"
        value={row.status || ''}
        onChange={(e) => handleInputChange(index, 'status', e.target.value)}
      />
    </FormGroup>

    <label>Kullanım Yeri</label>
    <FormGroup>
      <Input
        type="text"
        value={row.placeOfUse || ''}
        onChange={(e) => handleInputChange(index, 'placeOfUse', e.target.value)}
      />
    </FormGroup>

              {/* ... other product inputs like barcode, amount, etc. ... */}
              <button type="button" className="icon-button" onClick={() => handleRemoveRow(index)}>
                <FontAwesomeIcon icon={faMinus} />
              </button>
            </div>
          ))}
          <button type="button" className="icon-button" onClick={handleAddRow}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
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

                        <label>Tarih</label>
                          <FormGroup>
                            <Input
                              name="date"
                              type="text"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                            />
                          </FormGroup>

                        
                          <label>İrsaliye No</label>
                          <FormGroup>
                            <Input
                              name="bill_number"
                              type="text"
                              value={billNo}
                              onChange={(e) => setBillNo(e.target.value)}
                            />
                          </FormGroup>
                          <label>Alıcı Vergi No</label>
                          <FormGroup>
                            <Select
                              name="receiver_tax_code"
                              value={consumerOptions.find(option => String(option.value) === String(receiverCompanyTaxCode))}
                              options={consumerOptions}
                              onChange={(selectedOption) => setReceiverCompanyTaxCode(selectedOption ? selectedOption.value : '')}
                            />
                          </FormGroup>

                          <label>Tedarikçi Vergi No</label>
                          <FormGroup>
                            <Select
                              name="supplier_tax_code"
                              value={supplierOptions.find(option =>String(option.value)=== String(supplierCompanyTaxCode))}
                              options={supplierOptions}
                              onChange={(selectedOption) => setSupplierCompanyTaxCode(selectedOption ? selectedOption.value : '')}
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
                      <Button className="my-button-class"  onClick={handleAddFileClick}>
                        <i className="fa fa-plus-circle mr-1"></i>
                        GİRDİ EKLE
                      </Button>
                      <Button className="my-button-class"  onClick={handleExportClick}>
                        <i className="fa fa-download mr-1"></i>
                        Dışa Aktar
                      </Button>
                    </div>
                  )}
                  {showUploadDiv && (
                    <div>
                      <div className="d-flex justify-content-between align-items-center">
                        <Button className="my-button-class"  onClick={handleAddFileClick}>
                          <i className="fa fa-plus-circle mr-1"></i>
                          Dosya Ekle
                        </Button>
                        <Button className="my-button-class"  onClick={handleExportClick}>
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
              data={dataTable.map(row => ({
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
                  amount: item.amount
                })),
                images: row.images,
                supplier_company_tax_code: row.supplier_company_tax_code,
                supplier_company_name: row.supplier_company_name,
                receiver_company_tax_code: row.receiver_company_tax_code,
                receiver_company_name: row.receiver_company_name,
             
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
                      Header: 'Date',
                      accessor: 'date'
                    },
                    {
                      Header: 'ID',
                      accessor: 'id'
                    },
                    {
                      Header: 'Bill Number',
                      accessor: 'bill_number'
                    },
                    {
                      Header: 'Supplier Company',
                      accessor: 'supplier_company_name'
                    },
                    {
                      Header: 'Supplier Tax Code',
                      accessor: 'supplier_company_tax_code'
                    },
                    {
                      Header: 'Receiver Company',
                      accessor: 'receiver_company_name'
                    },
                    {
                      Header: 'Receiver Tax Code',
                      accessor: 'receiver_company_tax_code'
                    },
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

                
                  
                    
                    {
                      Header: 'Uploaded Files',
                      id: 'uploaded_files',
                      accessor: 'images',
                      Cell: ({ value, row: { original } }) => {
                        const numOfFiles = value.length;
                        return (
                          <Button 
                            color="link" 
                            onClick={() => handleShowModal(value, original.id)}
                            title="Show Uploaded Files"
                          >
                            <i className="fa fa-picture-o" /> 
                            <span>{numOfFiles}</span>
                          </Button>
                        );
                      }
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
            const imageUrl = `${process.env.REACT_APP_MEDIA_URL}${file}`;

            return (
              <div key={index} className="file-item">
    <img src={imageUrl} alt={`file ${index}`} />
    <button className="delete-button" onClick={() => deleteImage(index, id)}>
        <i className="fa fa-trash"></i>
    </button>
</div>

            );
          })}
        </div>
        <div className="modal-footer">
          <input 
            type="file" 
            onChange={UploadFileChangeInModal} 
            multiple
          />
        
        </div>
        <div className="uploaded-files-section">
        {isLoadingModal ? (
              <div className="loading-icon">
              {/* Use your own LoadingIcon component or an icon from any library */}
              {/* <LoadingIcon /> */}
              Loading...
            </div>
        ) : (
          <ul>
            {uploadedFileUrlsModal.map((name, index) => (
              <li key={index}>
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>
    </div>
  </div>
)}


{show && (
  <div className="modal show d-block custom-modal" tabindex="-1">
    <div className="modal-dialog">
      <div className="modal-content custom-modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Products List</h5>
          <button type="button" className="close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body modal-body-scroll">
    {modalProducts.map((product, index) => (
        <div key={index} className="product-item">
            {isEditingIndex === index ? (
                // Editable inputs for the current product
                <div>
                    <label>Malzeme Kodu</label>
                    <FormGroup>
                        <Select
                            name="product_code"
                            options={productOptions}
                            value={productOptions.find(option => option.value === product.product_code)}
                            onChange={(selectedOption) => handleProductChange(index, 'product_code', selectedOption.value)}
                        />
                    </FormGroup>

                    <label>Miktar</label>
                    <FormGroup>
                        <Input
                            type="text"
                            value={product.amount || ''}
                            onChange={(e) => handleProductChange(index, 'amount', e.target.value)}
                        />
                    </FormGroup>

                    <label>Barkod</label>
                    <FormGroup>
                        <Input
                            type="text"
                            value={product.barcode || ''}
                            onChange={(e) => handleProductChange(index, 'barcode', e.target.value)}
                        />
                    </FormGroup>

                    <label>Durum</label>
                    <FormGroup>
                        <Input
                            type="text"
                            value={product.status || ''}
                            onChange={(e) => handleProductChange(index, 'status', e.target.value)}
                        />
                    </FormGroup>

                    <label>Kullanım Yeri</label>
                    <FormGroup>
                        <Input
                            type="text"
                            value={product.place_of_use || ''}
                            onChange={(e) => handleProductChange(index, 'place_of_use', e.target.value)}
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
            ) : (
                // Display mode for the current product
                <div className="product-details">
                <h5 className="product-title">
                    Product {index + 1}
                    <button type="button" className="icon-button" onClick={() => {
                        setIsEditingIndex(index);
                        setMode('edit');
                    }}>
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button type="button" className="icon-button" onClick={() => deleteProduct(index)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </h5>
                
                <div className="detail-row">
                    <strong className="detail-title">Product Code:</strong>
                    <span>{product.product_code}</span>
                </div>
                <div className="detail-row">
                    <strong className="detail-title">Description:</strong>
                    <span>{product.description}</span>
                </div>
                <div className="detail-row">
                    <strong className="detail-title">Amount:</strong>
                    <span>{product.amount}</span>
                </div>
                <div className="detail-row">
                    <strong className="detail-title">Barcode:</strong>
                    <span>{product.barcode}</span>
                </div>
                <div className="detail-row">
                    <strong className="detail-title">Brand:</strong>
                    <span>{product.brand}</span>
                </div>
                <div className="detail-row">
                    <strong className="detail-title">Model:</strong>
                    <span>{product.model}</span>
                </div>
                <div className="detail-row">
                    <strong className="detail-title">Place of Use:</strong>
                    <span>{product.place_of_use}</span>
                </div>
                <div className="detail-row">
                    <strong className="detail-title">Serial Number:</strong>
                    <span>{product.serial_number}</span>
                </div>
                <div className="detail-row">
                    <strong className="detail-title">Status:</strong>
                    <span>{product.status}</span>
                </div>
                <div className="detail-row">
                    <strong className="detail-title">Group Name:</strong>
                    <span>{product.group_name}</span>
                </div>
                <div className="detail-row">
                    <strong className="detail-title">Subgroup Name:</strong>
                    <span>{product.subgroup_name}</span>
                </div>
                <div className="detail-row">
                    <strong className="detail-title">Unit:</strong>
                    <span>{product.unit}</span>
                </div>
            </div>
            )}
            {(index !== modalProducts.length - 1) && <hr />}
        </div>
    ))}
   
</div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose}>Close</button>
          <button type="button" className="icon-button" onClick={() => {
    addProduct();
    setMode('add');
}}>
    <FontAwesomeIcon icon={faPlus} />
</button>

        </div>
      </div>
    </div>
  </div>
)}





    </>

  );
};

export default DataTable;
