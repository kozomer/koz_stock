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
import React, { useState, useEffect, useCallback } from "react";
// react plugin used to create charts
import { Line, Bar, Doughnut } from "react-chartjs-2";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";
import { Pie } from "react-chartjs-2";

// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4,
  chartExample5,
  chartExample6,
  chartExample7,
  chartExample8
} from "variables/charts.js";

var mapData = {
  AU: 760,
  BR: 550,
  CA: 120,
  DE: 1300,
  FR: 540,
  GB: 690,
  GE: 200,
  IN: 200,
  RO: 600,
  RU: 300,
  US: 2920
};
import NotificationAlert from "react-notification-alert";
import localforage from 'localforage';
export const notifications = [];



function Dashboard() {
  const notificationAlert = React.useRef();
  const [filterOption, setFilterOption] = useState("monthly");
  const [filterOptionCust, setFilterOptionCust] = useState("monthly");
  const [filterOptionArea, setFilterOptionArea] = useState("monthly");
  const [topProducts, setTopProducts] = useState([]);
  const [topProductsPieData, setTopProductsPieData] = useState({});
  const [topCustomers, setTopCustomers] = useState([]);
  const [topCustomersPieData, setTopCustomersPieData] = useState({});
  const [topAreas, setTopAreas] = useState([]);
  const [topAreasPieData, setTopAreasPieData] = useState({});
  const [currency, setCurrency] = useState();
  const [currentDateTime] = useState(new Date());
  const [date, setDate] = useState([]);
  const [salesData, setSalesData] = useState([]);
  
  const [salesTotalData, setSalesTotalData] = useState([]);
  const [salesMonthlyData, setSalesMonthlyData] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const [notificationsAdded, setNotificationsAdded] = useState(false);

  //Notification
  const notify = useCallback((place, productCode) => {
    var color = Math.floor(Math.random() * 5 + 1);
    var type;
    switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            Welcome to <b>Now UI Dashboard React</b> - a beautiful premium admin
            for every web developer. Click <a href={`/admin/rop?productCode=${productCode}`}>here</a> to reorder points for product {productCode}.
          </div>
        </div>
      ),
      type: type,
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 7,
      read: false
    };
    notifications.push(options);
    localforage.setItem('notifications', JSON.stringify([...notifications]));
   // notificationAlert.current.notificationAlert(options);
    console.log(notifications)
  }, []);
  
  const fetchNotificationData = async () => {
    const access_token = await localforage.getItem('access_token');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/notifications/', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + String(access_token)
        },
      }); // Replace with the correct API endpoint
      const data = await response.json();
      setNotificationData(data);
      setNotificationsAdded(true);
    } catch (error) {
      console.error('Error fetching notification data:', error);
    }
  };

  useEffect(() => {
    fetchNotificationData();
  }, []);
  
  useEffect(() => {
    if (!notificationsAdded && notificationData.length > 0) {
      notificationData.forEach((notification) => {
        const [id, date, productCode, orderAvrg, orderExp, orderHolt] = notification;
        console.log(notificationData);
        notify("tr", productCode);
      });
      setNotificationsAdded(true);
    }
  }, [notificationData, notificationsAdded]);
  
  useEffect(() => {
    const fetchData = async () => {
      const access_token = await localforage.getItem('access_token');
      const response = await fetch("http://127.0.0.1:8000/api/top_products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + String(access_token)
        },
        body: JSON.stringify({ report_type: filterOption }),
      });
      const data = await response.json();
      console.log(data)
      setTopProducts(data.top_products_list);
      setTopProductsPieData({
        labels: data.top_products_pie_chart.map((item) => item[0]),
        datasets: [
          {
            label: "Top Products",
            data: data.top_products_pie_chart.map((item) => item[1]),
            backgroundColor: ["#53b100", "#61e8e1", "#f25757", "#f2a05d", "#f2e863", "#5e55ff"],
          },
        ],
      });
      

    };
    fetchData();
  }, [filterOption]);


  useEffect(() => {
    const fetchDataCustomers = async () => {
      const access_token = await localforage.getItem('access_token');
      const response = await fetch("http://127.0.0.1:8000/api/top_customers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + String(access_token)
        },
        body: JSON.stringify({ report_type: filterOptionCust }),
      });
      const data = await response.json();
      setTopCustomers(data.top_customers_list);
      setTopCustomersPieData({
        labels: data.top_customers_pie_chart.map((item) => item[0]),
        datasets: [
          {
            label: "Top Customers",
            data: data.top_customers_pie_chart.map((item) => item[1]),
            backgroundColor: ["#53b100", "#61e8e1", "#f25757", "#f2a05d", "#f2e863", "#5e55ff"],
          },
        ],
      });
    };
    fetchDataCustomers();
  }, [filterOptionCust])


  useEffect(() => {
    const fetchExchange = async () => {
      const access_token = await localforage.getItem('access_token');
      const response = await fetch("http://127.0.0.1:8000/api/exchange_rate/", {

        headers: {

          'Authorization': 'Bearer ' + String(access_token)
        },

      });
      const data = await response.json();
      console.log(data["jalali_date"])
      setCurrency(data);

    };
    fetchExchange();
  }, []);


  useEffect(() => {
    const fetchDailyReportSaler = async () => {
      const access_token = await localforage.getItem('access_token');
      const response = await fetch("http://127.0.0.1:8000/api/daily_report/saler_data/", {

        headers: {

          'Authorization': 'Bearer ' + String(access_token)
        },

      });
      const data = await response.json();
      console.log(data)
      setSalesData(data.sales_data || []);
      setDate(data.jalali_date || []);
      
    };
    fetchDailyReportSaler();
  }, []);
  
  useEffect(() => {
    const fetchDailyReportTotal = async () => {
      const access_token = await localforage.getItem('access_token');
      const response = await fetch("http://127.0.0.1:8000/api/daily_report/total_data/", {

        headers: {

          'Authorization': 'Bearer ' + String(access_token)
        },

      });
      const data = await response.json();
      
      setSalesTotalData(data);
      console.log(salesTotalData)
    };
    fetchDailyReportTotal();
  }, []);

  useEffect(() => {
    const fetchDailyReportMotnhly = async () => {
      const access_token = await localforage.getItem('access_token');
      const response = await fetch("http://127.0.0.1:8000/api/daily_report/total_data_by_monthly/", {

        headers: {

          'Authorization': 'Bearer ' + String(access_token)
        },

      });
      const data = await response.json();
      
      setSalesMonthlyData(data);
      console.log(data)
    };
    fetchDailyReportMotnhly();
  }, []);

  useEffect(() => {
    const fetchDataArea = async () => {
      const access_token = await localforage.getItem('access_token');
      
      const response = await fetch("http://127.0.0.1:8000/api/customer_area/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + String(access_token)
        },
        body: JSON.stringify({ report_type: filterOptionArea }),
      });
      const data = await response.json();
      
      setTopAreas(data.table_data);
      setTopAreasPieData({
        labels: data.chart_data_percent.map((item) => item[0]),
        datasets: [
          {
            label: "Top Customers",
            data: data.chart_data_percent.map((item) => item[1]),
            backgroundColor: ["#53b100", "#61e8e1", "#f25757", "#f2a05d", "#f2e863", "#5e55ff"],
          },
        ],
      });
    };
   
    fetchDataArea();
  }, [filterOptionArea])

  
  const rowHeaders = [
    'Current Sales (Toman)',
    'Current Sales ($) (Sepidar)',
    'Current Sales ($) (Tablo)',
    'Current Sales (KG)',
  ];
  
    
  return (
    <>
      <NotificationAlert ref={notificationAlert} />
      <div className="content">
        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-globe text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Currency</p>
                      <CardTitle tag="p">{currency} IRR</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-refresh" />
                  Update at {currentDateTime.toLocaleString()}
                </div>
              </CardFooter>
            </Card>
          </Col>


          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-calendar-60" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Current Date(Gregorian)</p>
                      <CardTitle tag="p">{new Date().toLocaleDateString()}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col md="12" xs="7">
                    <div className="numbers">
                      <p className="card-category">Current Date(Jalali)</p>
                      <CardTitle tag="p">{date}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>

            </Card>
          </Col>

          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Errors</p>
                      <CardTitle tag="p">23</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-clock-o" />
                  In the last hour
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Followers</p>
                      <CardTitle tag="p">+45K</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-refresh" />
                  Update now
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col sm="7">
                    <div className="numbers pull-left">Daily Reports</div>
                  </Col>
                  
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                <Table>
         <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Daily Sales</th>
          <th scope="col">Monthly Sales</th>
          <th scope="col">Yearly Sales</th>
        </tr>
      </thead>
      <tbody>
        {salesTotalData.daily_sales &&
          salesTotalData.daily_sales.map((_, rowIndex) => (
            <tr key={rowIndex}>
              <th scope="row">{rowHeaders[rowIndex]}</th>
              <td>{salesTotalData.daily_sales[rowIndex]}</td>
              <td>{salesTotalData.monthly_sales[rowIndex]}</td>
              <td>{salesTotalData.yearly_sales[rowIndex]}</td>
            </tr>
          ))}
      </tbody>
      </Table>
      </Row>
      <hr style={{ marginTop: '30px', marginBottom: '30px', borderWidth: '3px' }} />

      <Row>
      <Table responsive>
        <thead>
          <tr>
            <th>Experts</th>
            <th>Status</th>
            <th>Daily Sales</th>
            <th>Monthly Sales</th>
            <th>Yearly Sales</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((sale, index) => (
            <tr key={index}>
              <td>{sale[0]}</td>
              <td>{sale[1] ? 'Active' : 'Inactive'}</td>
              <td>{sale[2]}</td>
              <td>{sale[3]}</td>
              <td>{sale[4]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      

      </Row>
      <hr style={{ marginTop: '30px', marginBottom: '30px', borderWidth: '3px' }} />

      <Row>
              <Table>
              <thead>
        <tr>
          <th>Month</th>
          <th>Toman</th>
          <th>USD</th>
          <th>KG</th>
          <th>Sepidar</th>
        </tr>
      </thead>
      <tbody>
        {salesMonthlyData.map((sale, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{sale[0]}</td>
            <td>{sale[1]}</td>
            <td>{sale[2]}</td>
            <td>{sale[3]}</td>
          </tr>
        ))}
      </tbody>
      </Table>
      </Row>
              </CardBody>
              
            </Card>
          </Col>
          

        
        </Row>

        <Row>
          <Col md="6">
            <Card>
              <Row>
                <Col xs="5">
                  <CardHeader>
                    <CardTitle tag="h4">Top Five Products</CardTitle>

                  </CardHeader>
                </Col>
                <Col xs="3"></Col>
                <Col xs="3" style={{marginTop:"10px"}}>
                  <Label for="selectType">Select Type:</Label>
                  <Input type="select" name="select" id="selectType" onChange={(e) => setFilterOption(e.target.value)}>
                    <option value="">Select Type</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>

                  </Input>
                </Col>
              </Row>
              <CardBody>
                <Row>

                  <Col md="12">

                    <Table responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Product Name</th>
                          <th className="text-right">Total Sales</th>

                        </tr>
                      </thead>
                      <tbody>
                        {topProducts.map((product, index) => (
                          <tr key={product[0]}>
                            <td>{index + 1}</td>
                            <td>{product[0]}</td>
                            <td className="text-right">{product[1]}</td>

                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <Col md="8">
                      <Doughnut
                        style={{ marginTop: "50px" }}
                        data={topProductsPieData}
                        options={{
                          plugins: {
                            legend: {
                              position: "right",
                              labels: {
                                font: {
                                  size: 12,
                                },
                                usePointStyle: true,
                              },
                            },
                            tooltips: {
                              enabled: false,
                            },
                            title: {
                              display: true,
                              position: "top",
                              text: "Top Products",
                              color: "#66615c",
                              font: {
                                weight: 400,
                                size: 20,
                              },

                            },
                          },

                          cutout: "70%",
                          scales: {
                            y: {
                              ticks: {
                                display: false,
                              },
                              grid: {
                                drawBorder: false,
                                display: false,
                              },
                            },
                            x: {
                              grid: {
                                drawBorder: false,
                                display: false,
                              },
                              ticks: {
                                display: false,
                              },
                            },
                          },
                        }}


                      />

                    </Col>

                  </Col>



                </Row>

              </CardBody>
            </Card>
          </Col>
        
          <Col md="6">
            <Card>
              <Row>
                <Col xs="5">
                  <CardHeader>
                    <CardTitle tag="h4">Top Five Customers</CardTitle>

                  </CardHeader>
                </Col>
                <Col xs="3"></Col>
                <Col xs="3" style={{marginTop:"10px"}}>
                  <Label for="selectType">Select Type:</Label>
                  <Input type="select" name="select" id="selectType" onChange={(e) => setFilterOptionCust(e.target.value)}>
                    <option value="">Select Type</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>

                  </Input>
                </Col>
              </Row>
              <CardBody>
                <Row>

                  <Col md="12">
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Customer Name</th>
                          <th className="text-right">Total Sales</th>

                        </tr>
                      </thead>
                      <tbody>
                        {topCustomers.map((customer, index) => (
                          <tr key={customer[0]}>
                            <td>{index + 1}</td>
                            <td>{customer[0]}</td>
                            <td className="text-right">{customer[1]}</td>

                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Col md="8">
                      <Doughnut
                        style={{ marginTop: "50px" }}
                        data={topCustomersPieData}
                        options={{
                          plugins: {
                            legend: {
                              position: "right",
                              labels: {
                                font: {
                                  size: 12,
                                },
                                usePointStyle: true,
                              },
                            },
                            tooltips: {
                              enabled: false,
                            },
                            title: {
                              display: true,
                              position: "top",
                              text: "Top Customers",
                              color: "#66615c",
                              font: {
                                weight: 400,
                                size: 20,
                              },

                            },
                          },

                          cutout: "70%",
                          scales: {
                            y: {
                              ticks: {
                                display: false,
                              },
                              grid: {
                                drawBorder: false,
                                display: false,
                              },
                            },
                            x: {
                              grid: {
                                drawBorder: false,
                                display: false,
                              },
                              ticks: {
                                display: false,
                              },
                            },
                          },
                        }}


                      />

                    </Col>

                  </Col>



                </Row>

              </CardBody>


            </Card>
          </Col>
        </Row>


        <Row>
          <Col md="6" > 
            <Card>
              <Row>
                <Col xs="5">
                  <CardHeader>
                    <CardTitle tag="h4">Top Five Areas</CardTitle>

                  </CardHeader>
                </Col>
                <Col xs="3"></Col>
                <Col xs="3" style={{marginTop:"10px"}}>
                  <Label for="selectType">Select Type:</Label>
                  <Input type="select" name="select" id="selectType" onChange={(e) => setFilterOptionArea(e.target.value)}>
                    <option value="">Select Type</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>

                  </Input>
                </Col>
              </Row>
              <CardBody>
                <Row>

                  <Col md="12">

                    <Table responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Area Name</th>
                          <th className="text-right">Total Sales</th>

                        </tr>
                      </thead>
                      <tbody>
                        {topAreas.map((area, index) => (
                          <tr key={area[0]}>
                            <td>{index + 1}</td>
                            <td>{area[0]}</td>
                            <td className="text-right">{area[1]}</td>

                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <Col md="8">
                      <Doughnut
                        style={{ marginTop: "50px" }}
                        data={topAreasPieData}
                        options={{
                          plugins: {
                            legend: {
                              position: "right",
                              labels: {
                                font: {
                                  size: 12,
                                },
                                usePointStyle: true,
                              },
                            },
                            tooltips: {
                              enabled: false,
                            },
                            title: {
                              display: true,
                              position: "top",
                              text: "Top Areas",
                              color: "#66615c",
                              font: {
                                weight: 400,
                                size: 20,
                              },

                            },
                          },

                          cutout: "70%",
                          scales: {
                            y: {
                              ticks: {
                                display: false,
                              },
                              grid: {
                                drawBorder: false,
                                display: false,
                              },
                            },
                            x: {
                              grid: {
                                drawBorder: false,
                                display: false,
                              },
                              ticks: {
                                display: false,
                              },
                            },
                          },
                        }}


                      />

                    </Col>

                  </Col>



                </Row>

              </CardBody>
            </Card>
          </Col>
        
          
        </Row>

{/* 
        <Row>
          <Col md="6">
            <Card className="card-tasks">
              <CardHeader>
                <CardTitle tag="h4">Goods On The Road</CardTitle>
                <h5 className="card-category">Backend development</h5>
              </CardHeader>
              <CardBody>
                <div className="table-full-width table-responsive">
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultChecked type="checkbox" />
                              <span className="form-check-sign" />
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="img-row">
                          <div className="img-wrapper">
                            <img
                              alt="..."
                              className="img-raised"
                              src={require("assets/img/faces/ayo-ogunseinde-2.jpg")}
                            />
                          </div>
                        </td>
                        <td className="text-left">
                          Sign contract for "What are conference organizers
                          afraid of?"
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="info"
                            id="tooltip42906017"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-ruler-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip42906017"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="danger"
                            id="tooltip570363224"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-simple-remove" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip570363224"
                          >
                            Remove
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input type="checkbox" />
                              <span className="form-check-sign" />
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="img-row">
                          <div className="img-wrapper">
                            <img
                              alt="..."
                              className="img-raised"
                              src={require("assets/img/faces/erik-lucatero-2.jpg")}
                            />
                          </div>
                        </td>
                        <td className="text-left">
                          Lines From Great Russian Literature? Or E-mails From
                          My Boss?
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="info"
                            id="tooltip584875601"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-ruler-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip584875601"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="danger"
                            id="tooltip517629613"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-simple-remove" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip517629613"
                          >
                            Remove
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultChecked type="checkbox" />
                              <span className="form-check-sign" />
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="img-row">
                          <div className="img-wrapper">
                            <img
                              alt="..."
                              className="img-raised"
                              src={require("assets/img/faces/kaci-baum-2.jpg")}
                            />
                          </div>
                        </td>
                        <td className="text-left">
                          Using dummy content or fake information in the Web
                          design process can result in products with unrealistic
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="info"
                            id="tooltip792337830"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-ruler-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip792337830"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="danger"
                            id="tooltip731952378"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-simple-remove" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip731952378"
                          >
                            Remove
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input type="checkbox" />
                              <span className="form-check-sign" />
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="img-row">
                          <div className="img-wrapper">
                            <img
                              alt="..."
                              className="img-raised"
                              src={require("assets/img/faces/joe-gardner-2.jpg")}
                            />
                          </div>
                        </td>
                        <td className="text-left">
                          But I must explain to you how all this mistaken idea
                          of denouncing pleasure
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="info"
                            id="tooltip825783733"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-ruler-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip825783733"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="danger"
                            id="tooltip285089652"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-simple-remove" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip285089652"
                          >
                            Remove
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-refresh spin" />
                  Updated 3 minutes ago
                </div>
              </CardFooter>
            </Card>
          </Col>

          <Col md="6">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Order Notificatons</CardTitle>
                <p className="card-category">All products including Taxes</p>
              </CardHeader>
              <CardBody>
                <Bar
                  data={chartExample4.data}
                  options={chartExample4.options}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-info" />
                  Tesla Model S <i className="fa fa-circle text-danger" />
                  BMW 5 Series
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-check" />
                  Data information certified
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="3">
            <Card>
              <CardHeader>
                <CardTitle></CardTitle>
                <p className="card-category">Last Campaign Performance</p>
              </CardHeader>
              <CardBody style={{ height: "253px" }}>
                <Doughnut
                  data={chartExample5.data}
                  options={chartExample5.options}
                  className="ct-chart ct-perfect-fourth"
                  height={300}
                  width={456}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-info" />
                  Open
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-calendar" />
                  Number of emails sent
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col md="3">
            <Card>
              <CardHeader>
                <CardTitle>New Visitators</CardTitle>
                <p className="card-category">Out Of Total Number</p>
              </CardHeader>
              <CardBody style={{ height: "253px" }}>
                <Doughnut
                  data={chartExample6.data}
                  options={chartExample6.options}
                  className="ct-chart ct-perfect-fourth"
                  height={300}
                  width={456}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-warning" />
                  Visited
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-check" />
                  Campaign sent 2 days ago
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col md="3">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <p className="card-category">Total number</p>
              </CardHeader>
              <CardBody style={{ height: "253px" }}>
                <Doughnut
                  data={chartExample7.data}
                  options={chartExample7.options}
                  className="ct-chart ct-perfect-fourth"
                  height={300}
                  width={456}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-danger" />
                  Completed
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-clock-o" />
                  Updated 3 minutes ago
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col md="3">
            <Card>
              <CardHeader>
                <CardTitle>Subscriptions</CardTitle>
                <p className="card-category">Our Users</p>
              </CardHeader>
              <CardBody style={{ height: "253px" }}>
                <Doughnut
                  data={chartExample8.data}
                  options={chartExample8.options}
                  className="ct-chart ct-perfect-fourth"
                  height={300}
                  width={456}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-secondary" />
                  Ended
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" />
                  Total users
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        */}
        <Row>
          <Col md="4">
            <Button
              block
              className="btn-round"
              color="default"
              onClick={() => notify("tr")}
              outline
            >
              Top Right
            </Button>
          </Col>
        </Row>
        
      </div>
    </>
  );
}

export default Dashboard;
