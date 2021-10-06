import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';

import { NavLink } from 'react-router-dom';
import { Row, Card, CardTitle, Form, Label, Input, Button } from 'reactstrap';
import { Colxx } from '../../components/common/CustomBootstrap';
import IntlMessages from '../../helpers/IntlMessages';
import renderText from '../common/form/renderText';
import CustomizedSnackbar from '../common/snakebar/CustomizedSnackbar';

class SignUpForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: 'demo@gogo.com',
            password: 'gogo123',
            first_name: 'Sarah',
            last_name: 'Kortney'
        };
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
                                Please use this form to register. <br />
                                If you are a member, please{' '}
                                <NavLink to={`/user/login`} className="white">
                                    login
                                </NavLink>
                                .
                            </p>
                        </div>
                        <div className="form-side">
                            <NavLink to={`/`} className="white">
                                <span className="logo-single" />
                            </NavLink>
                            <CardTitle className="mb-4">
                                <IntlMessages id="user.register" />
                            </CardTitle>
                            {errorMessage &&
                                <CustomizedSnackbar
                                    variant="error"
                                    message={errorMessage}
                                />}
                            <Form method="post" onSubmit={handleSubmit(onSubmit)}>
                                <Label className="form-group has-float-label mb-4">
                                    <Field
                                        type="text"
                                        name="first_name"
                                        component={renderText}
                                        label="First Name"
                                    />
                                </Label>
                                <Label className="form-group has-float-label mb-4">
                                    <Field
                                        type="text"
                                        name="last_name"
                                        component={renderText}
                                        label="Last Name"
                                    />
                                </Label>
                                <Label className="form-group has-float-label mb-4">
                                    <Field
                                        type="text"
                                        name="email"
                                        component={renderText}
                                        label="Email"
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
                                <div className="d-flex justify-content-end align-items-center">
                                    <Button
                                        color="primary"
                                        className="btn-shadow"
                                        size="lg"
                                        type="submit"
                                    >
                                        <IntlMessages id="user.register-button" />
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

const validateSignUp = values => {
    const errors = {};

    const requiredFields = [
        'first_name',
        'last_name',
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
    return errors
};

SignUpForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

export default reduxForm({
    form: 'SignUpForm', // a unique identifier for this form
    validate: validateSignUp // ←Callback function for client-side validation
})(SignUpForm);
