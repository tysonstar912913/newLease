import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAdminAuthenticated } from '../../utils/jwtUtil';

const AuthenticationAdmin = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        isAdminAuthenticated() ? (
            <Component {...props} />
        ) : (
                <Redirect to={{ pathname: "/app/dashboard", state: { from: props.location } }} />
            )
    )} />
);

export default AuthenticationAdmin;