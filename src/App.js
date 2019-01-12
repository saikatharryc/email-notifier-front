import React, { Component } from 'react';
import { HashRouter, Route, Switch ,Redirect} from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import './App.scss';
import {Login, Register} from './views/Pages';
import {MainLayout}  from './containers/index';
import AuthService from './AuthService';
const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

const auth = new AuthService();

class App extends Component {

  requireAuth = RouteComponent => {
      return  auth.loggedIn() ? <RouteComponent /> : <Redirect to="/login" />;
  };

  requireNotLoggedIn = RouteComponent => {
      return auth.loggedIn() ? <Redirect to="/app/dashboard" /> : <RouteComponent />;
  };


  render() {
    return (
      <HashRouter>
          <Switch>
          <Route exact path="/" name="unknown" render={() => <Redirect to="/login" />} />
            <Route exact path="/login" name="Login Page" render={()=>this.requireNotLoggedIn(Login)} />
            <Route exact path="/register" name="Register Page" render={()=>this.requireNotLoggedIn(Register)} />
            {/* <Route exact path="/404" name="Page 404" component={Page404} />
            <Route exact path="/500" name="Page 500" component={Page500} /> */}
            <Route path="/app/*" name="Dash" render={()=>this.requireAuth(MainLayout)} />
          </Switch>
      </HashRouter>
    );
  }
}

export default App;
