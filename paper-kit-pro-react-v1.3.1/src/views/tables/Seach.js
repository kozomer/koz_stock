import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Input, Button, Col, Row } from 'reactstrap';
import localforage from 'localforage';
const SearchComponent = () => {
  const [productCode, setProductCode] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [consumers, setConsumers] = useState([]);

  const handleSearch = async () => {
    try {
    const access_token =  await localforage.getItem('access_token');
      const requestOptions = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ String(access_token)
        },
        body: JSON.stringify({ product_code: productCode })
      };
  
      const supplierResponse = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/supplier_search/`, requestOptions);
      const supplierData = await supplierResponse.json();
        
      const consumerResponse = await fetch(`${process.env.REACT_APP_PUBLIC_URL}/consumer_search/`, requestOptions);
      const consumerData = await consumerResponse.json();
  
      setSuppliers(supplierData.suppliers);
      setConsumers(consumerData.consumers);
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <>
    <div className='content'>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
        <Input type="text" placeholder="Product Code" onChange={(e) => setProductCode(e.target.value)} />
        <Button color="primary" onClick={handleSearch}>Search</Button>
      </div>
      
      <Row>
        <Col style={{ borderRight: '1px solid #000' }}>
          <Card>
            <CardBody>
              <CardTitle tag="h5">Suppliers</CardTitle>
              {suppliers.map((supplier) => (
                <div key={supplier.id}>
                  <p><strong>{supplier.name}</strong></p>
                  <p>Contact Name: {supplier.contact_name}</p>
                  <p>Contact No: {supplier.contact_no}</p>
                  <hr />
                </div>
              ))}
            </CardBody>
          </Card>
        </Col>

        <Col>
          <Card>
            <CardBody>
              <CardTitle tag="h5">Consumers</CardTitle>
              {consumers.map((consumer) => (
                <div key={consumer.id}>
                  <p><strong>{consumer.name}</strong></p>
                  <p>Contact Name: {consumer.contact_name}</p>
                  <p>Contact No: {consumer.contact_no}</p>
                  <hr />
                </div>
              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
    </>
  );
};

export default SearchComponent;
