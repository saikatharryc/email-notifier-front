import React, { Component } from 'react';
import { Link ,Redirect} from 'react-router-dom';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import AuthService from '../../../AuthService'
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';


const auth = new AuthService();
class Login extends Component {
  state={
    email:'',
    password:'',
    redirectHome:false
  }
login = (e)=>{
  auth.login(this.state.email, this.state.password).then((response) => {
    this.setState({redirectHome: true})
}, (error) => {
    if (error.message) {
      return NotificationManager.error('Login Failed', error.message);
    } else {
      return NotificationManager.error('Login Failed');
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
            {this.state.redirectHome &&( <Redirect to={{pathname:'/app/home'} }/>) }
      <NotificationContainer />
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            @
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="email" name="email" autoComplete="email" value={this.state.email} onChange={this.inputHandler} />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" name="password" autoComplete="current-password" value={this.state.password} onChange={this.inputHandler} />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" onClick={this.login} disabled={this.state.email && this.state.password ?  false :true}>Login</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
