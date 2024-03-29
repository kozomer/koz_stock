import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardTitle, Row, Col, Input,Form, FormGroup, Label,CardFooter} from 'reactstrap';
import ReactTable from 'components/ReactTable/ReactTable.js';
import localforage from 'localforage';
import ReactBSAlert from "react-bootstrap-sweetalert";
const DataTable = () => {
  const [dataTable, setDataTable] = useState([]);
  const [file, setFile] = useState(null);
  const [showUploadDiv, setShowUploadDiv] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [productCode, setProductCode] = useState(null);

  const [group, setGroup] = useState(null);
  const [subgroup, setSubgroup] = useState(null);
  const [brand, setBrand] = useState(null);
  const [serialNumber, setSerialNumber] = useState(null);
  const [model, setModel] = useState(null);
  const [description, setDescription] = useState(null);
  const [unit, setUnit] = useState(null);
  const [warehouse, setWarehouse] = useState(null);
  const [inflow, setInflow] = useState(null);
  const [outflow, setOutflow] = useState(null);
  const [stock, setStock] = useState(null);
  const [reserveStock, setReserveStock] = useState(null);
  
  const [alert, setAlert] = useState(null);
  const [renderEdit, setRenderEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [dataChanged, setDataChanged] = useState(false);

  const [editData, setEditData] = useState(null);
  const [oldData, setOldData] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      const access_token = await localforage.getItem('access_token'); 
      
      const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/warehouse/`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ String(access_token)
        }});
      const data = await response.json();
      console.log(data)
      setDataTable(data);
    }
    fetchData();
  }, [dataChanged,renderEdit]);

  /*
  useEffect(() => {
    console.log(dataTable);
  }, [dataTable]);
*/


const handleAddFileClick = () => {
  setShowUploadDiv(true);
}

  const handleFileInputChange = (e) => {
    setFile(e.target.files[0]);
    console.log(file)
  };

  const handleUploadClick = async() => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const access_token = await localforage.getItem('access_token'); 
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/add_warehouse/`, {
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
          fetch(`${process.env.REACT_APP_PUBLIC_URL}/warehouse/`,{
            headers: {
              'Authorization': 'Bearer '+ String(access_token)
            }
          })
          .then((response) => response.json())
          .then((data) =>{
             setDataTable(data)
             console.log(data.message)});
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
  
  const handleClick = (row) => {
     
    setEditData(row);
    setOldData(row);

    setProductCode(row.product_code);
    
    setGroup(row.group);
    setSubgroup(row.subgroup);
    setBrand(row.brand);
    setSerialNumber(row.serial_number);
    setModel(row.model);
    setDescription(row.description);
    setUnit(row.unit);
    setWarehouse(row.warehouse);
    setInflow(row.inflow);
    setOutflow(row.outflow);
    setStock(row.stock);
    setReserveStock(row.reserve_stock);
   
    setShowPopup(!showPopup);
    console.log(row)
  };
  const handleSubmit = async (e) => {
    const access_token = await localforage.getItem('access_token'); 
    
    const updatedData = {
      new_product_code: productCode,
   
      new_group: group,
      new_subgroup: subgroup,
      new_brand: brand,
      new_serial_number: serialNumber,
      new_model: model,
      new_description: description,
      new_unit: unit,
      new_warehouse: warehouse,
      new_inflow: inflow,
      new_outflow: outflow,
      new_stock: stock,
      new_reserve_stock: stock,

      old_product_code: oldData[0],
     
      old_group: oldData[1],
      old_subgroup: oldData[2],
      old_brand: oldData[3],
      old_serial_number: oldData[4],
      old_model: oldData[5],
      old_description: oldData[6],
      old_unit: oldData[7],
      old_warehouse: oldData[8],
      old_inflow: oldData[9],
      old_outflow: oldData[10],
      old_stock: oldData[11],
      old_stock: oldData[12],
      
      
    };
    console.log(updatedData)
    fetch(`${process.env.REACT_APP_PUBLIC_URL}/edit_warehouse/`, {
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


  const handleCancel = () => {
    setShowPopup(false);
    setEditData(null)
  };
  
  useEffect(() => {
    console.log("useEffect called")
    if(editData){
      
      setProductCode(editData[0]);
     
      setGroup(editData[1]);
      setSubgroup(editData[2]);
      setBrand(editData[3]);
      setSerialNumber(editData[4]);
      setModel(editData[5]);
      setDescription(editData[6]);
      setUnit(editData[7]);
      setWarehouse(editData[8]);
      setInflow(editData[9]);
      setOutflow(editData[10]);
      setStock(editData[11]);
      setReserveStock(editData[12]);
       
        setIsUpdated(true)
    }
  }, [editData])
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

  //delete
  


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
        async function deleteFunc() {
        if (deleteConfirm) {
         
         const access_token =  await localforage.getItem('access_token'); 
          fetch(`${process.env.REACT_APP_PUBLIC_URL}/delete_warehouse/`, {
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


  async function handleExportClick() {
    // Retrieve the access token from localForage
    const access_token = await localforage.getItem('access_token');
  
    // Make an AJAX request to the backend to download the CSV file
    const response = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/export_warehouse/`, {
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
    
    {/* 
      {showPopup && isUpdated &&(
       <div className="popup">
      <Card>
            <CardHeader>
              <CardTitle tag="h4">Ambarı Düzenle</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
              <div>

        <div className="form-group-col">
        <label>Malzeme Kodu</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={productCode}
            onChange={(e) => setProductCode(e.target.value)}
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
        </div>

        <div className="form-group-col">
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
        </div>
         

        <div className="form-group-col">
        <label>Depo</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
          />
        </FormGroup>

        <label>Giriş</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={inflow}
            onChange={(e) => setInflow(e.target.value)}
          />
        </FormGroup>

        <label>Çıkış</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={outflow}
            onChange={(e) => setOutflow(e.target.value)}
          />
        </FormGroup>

        <label>Stok</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </FormGroup>

        <label>Kullanımda Stok</label>
        <FormGroup>
          <Input
            type="text"
            defaultValue={reserveStock}
            onChange={(e) => setReserveStock(e.target.value)}
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

*/}

<Card>
  <CardHeader>
    <CardTitle tag='h4'>AMBAR</CardTitle>
  </CardHeader>
  <CardBody>
    
  </CardBody>
</Card>
        <Row>
          <Col md='12'>
            <Card>
             
              <CardBody>
             
                <ReactTable
                  data={dataTable.map((row, key) => ({
                    id: row[0],
                    product_code: row[1],
                   
                    group: row[2],
                    subgroup: row[3],
                    brand: row[4],
                    serial_number: row[5],
                    model: row[6],
                    description: row[7],
                    unit: row[8],
                    warehouse: row[9],
                    inflow: row[10],
                    outflow: row[11],
                    stock: row[12],
                    reserve_stock: row[13],
                    
                    actions: (
                      <div className='actions-left'>
                        
                        <>
    
  
                          </>
                      </div>
                    ),
                  }))}
                  columns={[
                    { Header: 'Malzeme Kodu', accessor: 'product_code' },
                    
                    { Header: 'Grup', accessor: 'group' },
                    { Header: 'Alt Grup', accessor: 'subgroup' },
                    { Header: 'Marka', accessor: 'brand' },
                    { Header: 'Seri Numarası', accessor: 'serial_number' },
                    { Header: 'Model', accessor: 'model' },
                    { Header: 'Açıklama', accessor: 'description' },
                    { Header: 'Birim', accessor: 'unit' },
                    { Header: 'Depo', accessor: 'warehouse' },
                    { Header: 'Giriş', accessor: 'inflow' },
                    { Header: 'Çıkış', accessor: 'outflow' },
                    { Header: 'Stok', accessor: 'stock' },
                    { Header: 'Kullanımda Stok', accessor: 'reserve_stock' },
                    { Header: 'Actions', accessor: 'actions', sortable: false, filterable: false },

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
