import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import UserLayout from '../../components/common/layout/UserLayout';
// Import custom components
import LoginContainer from './LoginContainer';
import SignUpContainer from './SignUpContainer';

const AuthContainer = ({ match }) => {
  return (
    <UserLayout>
      <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/login`} />
        <Route path={`${match.url}/login`} component={LoginContainer} />
        <Route path={`${match.url}/signup`} component={SignUpContainer} />
        <Redirect to="/error" />
      </Switch>
    </UserLayout>
  );
};

export default AuthContainer;