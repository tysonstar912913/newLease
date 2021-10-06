import React, { Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import NotFound from '../components/error/NotFound';
import AuthContainer from '../containers/auth/AuthContainer';
import Authentication from './Authentication';
import AppAdminContainer from '../containers/admin/AppAdminContainer';
// import NotificationContainer from '../components/common/react-notifications/NotificationContainer';

const Router = () => (
    <Fragment>
        <Switch>
            <Authentication path="/app" component={AppAdminContainer} />
            <Route path="/user" component={AuthContainer} />
            <Route path="/error" exact component={NotFound} />
            <Redirect to="/user/login" />
        </Switch>
    </Fragment>
);

export default Router;
