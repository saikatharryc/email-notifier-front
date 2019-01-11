import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import AuthService from '../../../AuthService'
const auth = new AuthService();
class Register extends Component {
state={
  email:'',
  password:'',
  confirmPass:'',
  redirect:false
}


register= (e)=>{

  auth.fetch('/auth/signup',{
      method: 'POST',
      body:JSON.stringify({
        email:this.state.email,
        password:this.state.password
      })
  }).then(res => {
      this.setState({
        redirect:true
      });
      }).catch( (error) => {
        console.log(error);
          if (error.message) {
            return NotificationManager.error('Registration Failed', error.message);
          } else {
            return NotificationManager.error('Registration Failed');
          }
    });
  }
inputHandler =(e)=>{
  this.setState({
    [e.target.name]:e.target.value
  })
}


  render() {
    return (
      <div className="app flex-row align-items-center">
      {this.state.redirect &&( <Redirect to={{pathname:'/login'} }/>) }
      <NotificationContainer />
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" placeholder="Email" name="email" value={this.state.email} onChange={this.inputHandler} autoComplete="email" />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.inputHandler} autoComplete="new-password" />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Repeat password" name="confirmPass" value={this.state.confirmPass}  onChange={this.inputHandler} autoComplete="new-password" />
                    </InputGroup>
                    <Button color="success" block onClick={this.register.bind(this)} disabled={this.state.email && this.state.password && this.state.password == this.state.confirmPass ? false :true}>Create Account</Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
