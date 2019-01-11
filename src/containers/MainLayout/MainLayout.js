import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch ,Link} from 'react-router-dom';
import { Container } from 'reactstrap';
import AuthService from '../../AuthService'

import {
  AppFooter,
  AppHeader,
} from '@coreui/react';
import Dashboard from '../../views/Dashboard'
import {NotificationContainer} from 'react-notifications';


const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));
const auth = new AuthService();
class MainLayout extends Component {
state={
  logout:false
}
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  componentDidMount() {
    this.setState({
      height: ((document.body.scrollHeight - document.getElementsByClassName('app-footer')[0].offsetHeight)) + 'px',
    })
}
  signOut(e) {
    e.preventDefault()
    auth.logout();
    this.setState({
      logout:true
    })
  }

  render() {
    return (
      <div className="app" style={{

          backgroundPositionY: 'bottom',
          backgroundRepeat: 'repeat-x',
          backgroundRepeatX: 'repeat',
          overflow:'scroll',
      }}>
      <NotificationContainer />
      {this.state.logout && (<Redirect path='/login' />)}
        <AppHeader fixed>
          <Suspense  fallback={this.loading()}>
            <DefaultHeader onLogout={e=>this.signOut(e)}/>
          </Suspense>
        </AppHeader>
        <Container style={{marginTop:"5%",          height: "720px",
}}>
        <Route  path='/app/dashboard' component={Dashboard}  />
        </Container>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default MainLayout;
