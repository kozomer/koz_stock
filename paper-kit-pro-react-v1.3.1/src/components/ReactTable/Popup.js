import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Label,
  FormGroup,
  Form,
  Input,
  FormText,
  Row,
  Col
} from "reactstrap";

function Popup() {


return(

<Card>
              <CardHeader>
                <CardTitle tag="h4">Stacked Form</CardTitle>
              </CardHeader>
              <CardBody>
                <Form action="#" method="#">
                  <label>Email address</label>
                  <FormGroup>
                    <Input placeholder="Enter email" type="email" />
                  </FormGroup>
                  <label>Password</label>
                  <FormGroup>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="off"
                    />
                  </FormGroup>
                  <FormGroup check className="mt-3">
                    <FormGroup check>
                      <Label check>
                        <Input defaultValue="" type="checkbox" />
                        Subscribe to newsletter{" "}
                        <span className="form-check-sign" />
                      </Label>
                    </FormGroup>
                  </FormGroup>
                </Form>
              </CardBody>
              <CardFooter>
                <Button className="btn-round" color="info" type="submit">
                  Submit
                </Button>
              </CardFooter>
            </Card>
)
}


export default Popup;
