import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import { NavLink } from 'react-router-dom';
import { Row, Card, Form, Label, Button } from 'reactstrap';
import { Colxx } from '../../components/common/CustomBootstrap';
import IntlMessages from '../../helpers/IntlMessages';
// Import custom components
import renderText from '../common/form/renderText';
import CustomizedSnackbar from '../common/snakebar/CustomizedSnackbar';

class LoginForm extends Component {
    constructor(props) {
        super(props);

    }

    onUserLogin() {
        if (this.state.email !== '' && this.state.password !== '') {
            this.props.loginUser(this.state, this.props.history);
        }
    }

    render() {
        const props = this.props;
        const { handleSubmit, onSubmit, errorMessage } = props;

        return (
            <Row className="h-100">
                <Colxx xxs="12" md="10" className="mx-auto my-auto">
                    <Card className="auth-card">
                        <div className="position-relative image-side ">
                            <p className="text-white h2">MAGIC IS IN THE DETAILS</p>
                            <p className="white mb-0">
                                Please use your credentials to login.
                        <br />
                                If you are not a member, please{' '}
                                <NavLink to={`/user/signup`} className="white">
                                    register
                        </NavLink>
                                .
                        </p>
                        </div>
                        <div className="form-side">
                            <NavLink to={`/`} className="white">
                                <span className="logo-single" />
                            </NavLink>
                            {errorMessage &&
                                <CustomizedSnackbar
                                    variant="error"
                                    message={errorMessage}
                                />}
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Label className="form-group has-float-label mb-4">
                                    <Field
                                        type="text"
                                        name="email"
                                        component={renderText}
                                        label="Username"
                                    />
                                </Label>
                                <Label className="form-group has-float-label mb-4">
                                    <Field
                                        type="password"
                                        name="password"
                                        component={renderText}
                                        label="Password"
                                    />
                                </Label>
                                <div className="d-flex justify-content-between align-items-center">
                                    <NavLink to={`/forgot-password`}>
                                        <IntlMessages id="user.forgot-password-question" />
                                    </NavLink>
                                    <Button
                                        color="primary"
                                        className="btn-shadow"
                                        size="lg"
                                        type="submit"
                                    >
                                        <IntlMessages id="user.login-button" />
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Card>
                </Colxx>
            </Row>
        );
    }
};

const validateLogin = values => {
    const errors = {};

    const requiredFields = [
        'email',
        'password'
    ];
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = '(The ' + field + ' field is required.)';
        }
        else if (field == 'password') {
            const password = values[field];
            if (password.length < 8) {
                errors[field] = '(Password must be more than 8 chars.)';
            }
        }
    });

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = '(Invalid email address.)';
    }
    return errors;
};

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

export default reduxForm({
    form: 'LoginForm', // a unique identifier for this form
    validate: validateLogin // ←Callback function for client-side validation
})(LoginForm);