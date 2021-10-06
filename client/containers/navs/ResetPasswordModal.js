import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from "redux-form";
import { Row } from 'reactstrap';
import { Colxx } from '../../components/common/CustomBootstrap';
import {
    Input,
    CustomInput,
    Label,
    Form,
    FormGroup,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from "reactstrap";
import renderText from "../../components/common/form/renderText"
import * as crudAction from '../../actions/crudAction';
import { API_URL } from '../../config/config';
import axios from "axios";

class ResetPasswordModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginUser: this.props.loginUser || null,
        };
        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount() {

    }

    submitForm(formProps) {
        if (this.state.loginUser === null) {
            return;
        }
        console.log(formProps);
        if (formProps.reset_password != '') {
            if (formProps.reset_password.length < 8) {
                alert('Password must be more than 8 chars.');
                return;
            }            
            if (formProps.reset_password != formProps.confirm_password) {
                alert('Confirm password is uncorrect.');
                return;
            }
        }
        let reset_api_url = 'auth/resetpassword';
        let user_id = this.state.loginUser.id;
        axios({
            url: API_URL + reset_api_url + '/' + user_id,
            method: "PUT",
            data: formProps
        })
            .then(function (response) {
                console.log(response);
                if (!response.data.error) {
                    alert(response.data.message);
                    window.location.href = '';
                }
            })
            .catch(function (error) {
                console.log(error);
                alert('Error occured');
            });
    }

    render() {
        const { handleSubmit } = this.props;
        
        return (
            <Modal isOpen={this.props.is_modalopen} toggle={this.props.toggle}>
                <Form onSubmit={handleSubmit(this.submitForm)}>
                    <ModalHeader toggle={this.props.toggle}>
                        Reset Password
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Field type="password" name="reset_password"
                                component={renderText}
                                label="Reset Password"
                                placeholder="Reset Password"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Field type="password" name="confirm_password"
                                component={renderText}
                                label="Confirm Password"
                                placeholder="Confirm Password" />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Row>
                            <Colxx className="text-center" lg="12">
                                <Button className="btn btn-primary" type="submit">
                                    Save
                            </Button>
                                <Button className="btn btn-primary" onClick={this.props.toggle}>
                                    Cancel
                            </Button>
                            </Colxx>
                        </Row>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

const validateResetpasswordData = values => {
    const errors = {};
    const requiredFields = ["company_name", "company_name_ar", "cr_number", "vat_rno", "address"];
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = "(The " + field + " field is required.)";
        }
    });
    return errors;
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

ResetPasswordModal = reduxForm({
    form: "ClientsCU_Form",
    validate: validateResetpasswordData,
    enableReinitialize: true
})(ResetPasswordModal);

export default connect(null, mapDispatchToProps)(ResetPasswordModal);