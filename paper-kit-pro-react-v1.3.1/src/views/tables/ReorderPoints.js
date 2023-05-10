/*!

=========================================================
* Paper Dashboard PRO React - v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { data } from "jquery";
import React, { useEffect, useState,useMemo} from "react";
// react plugin used to create charts
import { Line, Bar, Pie } from "react-chartjs-2";
import Select from "react-select";
import ReactBSAlert from "react-bootstrap-sweetalert";
import '../../assets/css/Table.css';

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  Table,
  Label,
  Container,
  Input,
  Button

} from "reactstrap";

// core components
import {
  chartExample1,
  chartExample4,
  chartExample9,
  chartExample10,
  chartExample11,
  chartExample12
} from "variables/charts.js";

import localforage from 'localforage';
import { useLocation } from 'react-router-dom';
function Charts() {
  const [dataTable, setDataTable] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [result, setResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [leadTime, setLeadTime] = useState('');
  const [forecast, setForecast] = useState('');
  const [serviceLevel, setServiceLevel] = useState('');
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [orderFlag, setOrderFlag] = useState(false);
  const [order, setOrder] = useState('');
  const [orderFlagHolt, setOrderFlagHolt] = useState(false);
  const [orderHolt, setOrderHolt] = useState('');
  const [orderFlagExp, setOrderFlagExp] = useState(false);
  const [orderExp, setOrderExp] = useState('');
  const [alert, setAlert] = useState(null);
  const [tableData, setTableData] = useState({
    group: "",
    subgroup: "",
    feature: "",
    new_or_old_product: "",
    related: "",
    origin: "",
    product_code_ir: "",
    product_code_tr: "",
    dont_order_again: "",
    description_tr: "",
    description_ir: "",
    unit: "",
    weight: "",
    unit_secondary: "",
    price: "",
    avarage_previous_year: "",
    month_1: "",
    month_2: "",
    month_3: "",
    month_4: "",
    month_5: "",
    month_6: "",
    month_7: "",
    month_8: "",
    month_9: "",
    month_10: "",
    month_11: "",
    month_12: "",
    total_sale: "",
    warehouse: "",
    goods_on_the_road: "",
    total_stock_all: "",
    total_month_stock: "",
    standart_deviation: "",
    lead_time: "",
    product_coverage_percentage: "",
    demand_status: "",
    safety_stock: "",
    rop: "",
    monthly_mean: "",
    new_party: "",
    cycle_service_level: "",
    total_stock: "",
    need_prodcuts: "",
    over_stock: "",
    calculated_need: "",
    calculated_max_stock: "",
    calculated_min_stock: "",
  });
  const tableHeaders = [
    'Group',
    'Subgroup',
    'Feature',
    'New or Old Product',
    'Related',
    'Origin',
    'Product Code IR',
    'Product Code TR',
    "Dont Order Again",
    "Description TR",
    "Description IR",
    "Unit",
    "Weight",
    "Unit Secondary",
    "Price",
    "Avarage Previous Year",
    "Month 1",
    "Month 2",
    "Month 3",
    "Month 4",
    "Month 5",
    "Month 6",
    "Month 7",
    "Month 8",
    "Month 9",
    "Month 10",
    "Month 11",
    "Month 12",
    "Total Sale",
    "Warehouse",
    "Goods on the Road",
    "Total Stock All",
    "Total Month Stock",
    "Standart Deviation",
    "Lead Time",
    "Product Coverage Percentage",
    "Demand Status",
    "Safety Stock",
    "Rop",
    "Monthly Mean",
    "New Party",
    "Cycle Service Level",
    "Total Stock",
    "Need Products",
    "Over Stock",
    "Calculated Need",
    "Calculated Max Stock",
    "Calculated Min Stock",
  ];

  const parsedTableData = useMemo(() => {
    if (Array.isArray(tableData) && tableData.length > 0) {
      return tableData;
    }
    return [];
  }, [tableData]);


  const location = useLocation();
  const productCode = location.pathname.split('/').pop();
  


  useEffect(() => {
    async function fetchData() {
      const access_token = await localforage.getItem('access_token');
      const response = await fetch('https://vividstockfish.com/api/charts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(access_token)
        }
      });
      const responseData = await response.json();

      setDataTable(responseData)


    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchItems() {
      const access_token = await localforage.getItem('access_token');
     
      fetch('https://vividstockfish.com/api/item_list/', {
        headers: {

          'Authorization': 'Bearer ' + String(access_token)
        }
      })
        .then(response => response.json())
        .then(data => {
          setItems(data);

        })


    }
    fetchItems()
  }, []);


  useEffect(() => {
    if (productCode) {
      console.log("aaaaa")
      const parsedProductCode = parseInt(productCode, 10);
      setSelectedItem({ value: parsedProductCode });
      setLeadTime(2);
      setServiceLevel(0.9);
      setForecast(3);
     
    }
  }, [productCode]);

  useEffect(() => {
    if (selectedItem && selectedItem.value) {
      
      handleSave();
    }
  }, [selectedItem]);

  useEffect(() => {
    if (selectedItem && leadTime && serviceLevel && forecast) {
      console.log("sd")
      setSaveDisabled(false);
    } else {
      setSaveDisabled(true);
    }
  }, [selectedItem, leadTime, serviceLevel,forecast]);

  const handleSave = async () => {
    // handle the save logic here
    
    console.log("aaaaa")
    const access_token = await localforage.getItem('access_token');
    
    const selectData = { product_code: selectedItem.value, lead_time: leadTime, service_level:serviceLevel, forecast_period: forecast};
    // post the selected option to Django
    fetch('https://vividstockfish.com/api/rop/', {
      method: 'POST',
    headers: { "Content-Type": "application/json", 
    'Authorization': 'Bearer '+ String(access_token)},
      
      body: JSON.stringify(selectData),
     
    })

    .then((response) => {
      if (!response.ok) {
        return response.json().then(data => {

          console.log(data)
          errorUpload(data.error);
        });
      }

      else {
        return response.json().then(data => {
          setTableData(data.rop_list);
          setResult(data);
          setOrder(data.avrg_order);
          setOrderFlag(data.avrg_order_flag)
  
          setOrderHolt(data.holt_order);
          setOrderFlagHolt(data.holt_order_flag)
  
          setOrderExp(data.exp_order);
          setOrderFlagExp(data.exp_order_flag)
          

         
        })

      }
    })

     
  };

  const handleSelect = async (selectedOption) => {
   
    setSelectedItem(selectedOption);
   

  }
  useEffect(() => {
    console.log(tableData);
  }, [tableData,productCode]);



  const options = items.map((item) => ({
    value: item,
    label: item
  }));

  let charts_ave = {};
  if ( result && result.avrg_dates_for_sales && result.avrg_sales && result.avrg_future_forecast_dates && result.avrg_future_sales) {
    const combinedDates = [...result.avrg_dates_for_sales, ...result.avrg_future_forecast_dates];
    const combinedSales = [...result.avrg_sales, ...result.avrg_future_sales];
    const historicalSales = combinedSales.slice(0, result.avrg_sales.length);
    const futureSales = combinedSales.slice(result.avrg_sales.length);
    const futureDates = result.avrg_future_forecast_dates;
    console.log(futureDates)
  
    charts_ave = {
      data: {
        labels: combinedDates,
        datasets: [
          {
            label: "Historical Sales",
            borderColor: "#6bd098",
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: false,
            borderWidth: 3,
            barPercentage: 1.6,
            tension: 0.4,
            data: historicalSales.map((sales, index) => ({ x: result.avrg_dates_for_sales[index], y: sales })),
          },
          {
            label: "Future Sales",
            borderColor: "#f96868",
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: false,
            borderWidth: 3,
            barPercentage: 1.6,
            tension: 0.4,
            data: futureSales.map((sales, index) => ({ x: futureDates[index], y: sales })),
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltips: {
            enabled: false
          }
        },
        scales: {
          y: {
            ticks: {
              color: "#9f9f9f",
              beginAtZero: false,
              maxTicksLimit: 5
              //padding: 20
            },
            grid: {
              drawBorder: false,
              display: true
            }
          },
          x: {
            grid: {
              drawBorder: false,
              display: true
            },
            ticks: {
              padding: 20,
              color: "#9f9f9f"
            }
            
          }
        }
      }
    };
  }
  
  let charts_holt = {};
  if ( result && result.holt_dates_for_sales && result.holt_sales && result.holt_future_forecast_dates && result.holt_future_sales) {
    console.log("sdad")
    const combinedDates = [...result.holt_dates_for_sales, ...result.holt_future_forecast_dates];
    const combinedSales = [...result.holt_sales, ...result.holt_future_sales];
    const historicalSales = combinedSales.slice(0, result.holt_sales.length);
    const futureSales = combinedSales.slice(result.holt_sales.length);
    const futureDates = result.holt_future_forecast_dates;
  
  
    charts_holt = {
      data: {
        labels: combinedDates,
        datasets: [
          {
            label: "Historical Sales",
            borderColor: "#6bd098",
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: false,
            borderWidth: 3,
            barPercentage: 1.6,
            tension: 0.4,
            data: historicalSales.map((sales, index) => ({ x: result.holt_dates_for_sales[index], y: sales })),
          },
          {
            label: "Future Sales",
            borderColor: "#f96868",
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: false,
            borderWidth: 3,
            barPercentage: 1.6,
            tension: 0.4,
            data: futureSales.map((sales, index) => ({ x: futureDates[index], y: sales })),
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltips: {
            enabled: false
          }
        },
        scales: {
          y: {
            ticks: {
              color: "#9f9f9f",
              beginAtZero: false,
              maxTicksLimit: 5
              //padding: 20
            },
            grid: {
              drawBorder: false,
              display: true
            }
          },
          x: {
            grid: {
              drawBorder: false,
              display: true
            },
            ticks: {
              padding: 20,
              color: "#9f9f9f"
            }
            
          }
        }
      }
    };
  }
  
  let charts_exp = {};
  if ( result && result.exp_dates_for_sales && result.exp_sales && result.exp_future_forecast_dates && result.exp_future_sales) {
    console.log("sdad")
    const combinedDates = [...result.exp_dates_for_sales, ...result.exp_future_forecast_dates];
    const combinedSales = [...result.exp_sales, ...result.exp_future_sales];
    const historicalSales = combinedSales.slice(0, result.exp_sales.length);
    const futureSales = combinedSales.slice(result.exp_sales.length);
    const futureDates = result.exp_future_forecast_dates;
  
  
    charts_exp = {
      data: {
        labels: combinedDates,
        datasets: [
          {
            label: "Historical Sales",
            borderColor: "#6bd098",
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: false,
            borderWidth: 3,
            barPercentage: 1.6,
            tension: 0.4,
            data: historicalSales.map((sales, index) => ({ x: result.exp_dates_for_sales[index], y: sales })),
          },
          {
            label: "Future Sales",
            borderColor: "#f96868",
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: false,
            borderWidth: 3,
            barPercentage: 1.6,
            tension: 0.4,
            data: futureSales.map((sales, index) => ({ x: futureDates[index], y: sales })),
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltips: {
            enabled: false
          }
        },
        scales: {
          y: {
            ticks: {
              color: "#9f9f9f",
              beginAtZero: false,
              maxTicksLimit: 5
              //padding: 20
            },
            grid: {
              drawBorder: false,
              display: true
            }
          },
          x: {
            grid: {
              drawBorder: false,
              display: true
            },
            ticks: {
              padding: 20,
              color: "#9f9f9f"
            }
            
          }
        }
      }
    };
  }
  
 
  const successEdit = (s) => {

    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Saved!"
        onConfirm={() => {
          hideAlert()
          
        }
        }
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

  const hideAlert = () => {
    setAlert(null);
  };

  return (
    <>


      <div className="content">
      {alert}
      <Card>
      <CardHeader>
        <CardTitle tag='h4'>REORDER POINTS</CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <Col md="4">
            <Label for="singleSelect">Select Product:</Label>
            <Select
              name="singleSelect"
              value={selectedItem}
              onChange={(value) => {
                setSelectedItem(value);
                handleSelect(value);
              }}
              options={options}
              placeholder="Search for an item..."
              isSearchable
              styles={{
                control: (provided) => ({
                  ...provided,
                  height: '15px',
                  minHeight: '38px',
                }),
              }}
            />
          </Col>
          <Col md="4">
            <Label for="leadTime">Lead Time:</Label>
            <Input
              type="number"
              name="leadTime"
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
            />
          </Col>
          <Col md="4">
            <Label for="serviceLevel">Service Level(must 0.00 - 1.00):</Label>
            <Input
              type="number"
              name="serviceLevel"
              value={serviceLevel}
              min="0"
              max="1"
              step="0.01"
              onChange={(e) => setServiceLevel(e.target.value)}
            />
          </Col>
          <Col md="4">
            <Label for="forecast">Forecast Period:</Label>
            <Input
              type="number"
              name="forecast"
              value={forecast}
              
              onChange={(e) => setForecast(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col md="12" className="text-center">
            <Button color="primary" className="btn-upload" onClick={handleSave} disabled={saveDisabled}>
              SHOW RESULTS
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
        <Container fluid>
          <Row style={{ marginTop: "100px" }}>
            <Col md="6">
              <Card>
              <Table className="scrollable-table">
      <tbody>
        {tableHeaders.map((header, index) => (
          <tr key={index}>
            <th>{header}</th>
            <td>{parsedTableData.length > 0 && parsedTableData[index]}</td>
          </tr>
        ))}
      </tbody>
    </Table>

              </Card>
            </Col>
            <Col md="6">
              <Row>
                <Col md="12">
                  <div className="d-flex justify-content-center" style={{ width: "100%" }}>
                    <Card className="card-chart" style={{ width: "100%" }}>
                      <CardHeader>
                        <CardTitle tag="h5">AVERAGE MODEL(OLD)</CardTitle>
                        <div>
                        <span><strong>Order Status:</strong> {`${orderFlag ? "required" : "not-required"}, `}</span>
<span><strong>Order:</strong>{` ${order}`}</span>
                </div>
                      </CardHeader>
                      <CardBody>
                        <Line data={charts_ave.data} options={charts_ave.options} />
                      </CardBody>
                    </Card>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <div className="d-flex justify-content-center" style={{ width: "100%" }}>
                    <Card className="card-chart" style={{ width: "100%" }}>
                      <CardHeader>
                        <CardTitle tag="h5">HOLT MODEL</CardTitle>
                        <div>
                        <span><strong>Order Status:</strong> {`${orderFlagHolt ? "required" : "not-required"}, `}</span>
<span><strong>Order:</strong>{` ${orderHolt}`}</span>
                </div>
                      </CardHeader>
                      <CardBody>
                        <Line data={charts_holt.data} options={charts_holt.options} />
                      </CardBody>
                    </Card>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <div className="d-flex justify-content-center" style={{ width: "100%" }}>
                    <Card className="card-chart" style={{ width: "100%" }}>
                      <CardHeader>
                        <CardTitle tag="h5">EXP. MODEL</CardTitle>
                        <div>
                        <span><strong>Order Status:</strong> {`${orderFlagExp ? "required" : "not-required"}, `}</span>
<span><strong>Order:</strong>{` ${orderExp}`}</span>
                </div>
                      </CardHeader>
                      <CardBody>
                        <Line data={charts_exp.data} options={charts_exp.options} />
                      </CardBody>
                    </Card>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>





      </div>
    </>
  );
}

export default Charts;
