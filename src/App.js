import React, { Component } from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
import Checkout from './containers/Checkout/Checkout'
import Order from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions';

class App extends Component {
  componentDidMount = () => {
    this.props.onTryAutoSignIn();
  }
  
  render() {
    let routes = (
      <Switch>
        <Route path='/login' component={Auth}/>
        <Route exact path='/' component={BurgerBuilder}/>
        <Redirect to="/" />
      </Switch>
    )

    if (this.props.isAuthenticated) {
      routes = (
      <Switch>
        <Route path='/checkout' component={Checkout}/>
        <Route path='/orders' component={Order}/>  
        <Route path='/logout' component={Logout}/>
        <Route path='/login' component={Auth}/>
        <Route exact path='/' component={BurgerBuilder}/>
        <Redirect to="/" />
      </Switch>
      )
    }
    return (
    <div>
      <Layout>
        {routes}
      </Layout>
    </div>
  );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.auth.token
})

const mapDispatchToProps = {
  onTryAutoSignIn: actions.checkAuthState
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
