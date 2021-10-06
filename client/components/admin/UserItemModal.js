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
import renderText from "../common/form/renderText";
import * as crudAction from '../../actions/crudAction';
// import { user_status } from '../../constants/defaultValues';
import { USERUPDATE, USERVIEW } from '../../constants/entity';

class UserItemModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUserStatusOption: 0,
            selectedUserActiveStatusOption: 0,
        };
        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount() {

    }

    componentWillReceiveProps(newProps) {
        const { initialValues } = newProps;
        this.setState({
            selectedUserStatusOption: initialValues.status,
            selectedUserActiveStatusOption: initialValues.is_allowed,
        })
    }

    handleUserStatusChange = selectedUserStatusOption => {
        this.setState({ selectedUserStatusOption: selectedUserStatusOption.target.value });
    };

    handleUserActiveStatusChange = selectedUserActiveStatusOption => {
        this.setState({ selectedUserActiveStatusOption: selectedUserActiveStatusOption.target.value });
    };

    submitForm(formProps) {
        delete formProps['password'];
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
        
        formProps.status = this.state.selectedUserStatusOption;
        formProps.is_allowed = this.state.selectedUserActiveStatusOption;
        let id = formProps.id;
        let api_url = 'admin/update';
        let refreshDispathchData = {
            entity: USERVIEW,
            reqUrl: 'admin/getitem'
        }
        this.props.actions.updateUserItemReduxForm(USERUPDATE, api_url, formProps, id, refreshDispathchData);
        this.props.toggle();
    }

    render() {
        const { handleSubmit } = this.props;
        let data_id = -1;
        if (this.props.initialValues) {
            data_id = this.props.initialValues.id;
        }
        return (
            <Modal isOpen={this.props.is_modalopen} toggle={this.props.toggle}>
                <Form onSubmit={handleSubmit(this.submitForm)}>
                    <ModalHeader toggle={this.props.toggle}>
                        Update User
                    </ModalHeader>
                    <ModalBody>
                        <Input type="hidden" name="id" value={data_id}></Input>
                        <FormGroup>
                            <Field type="text" name="first_name"
                                component={renderText}
                                label="First Name"
                                placeholder="First Name"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Field type="text" name="last_name"
                                component={renderText}
                                label="Last Name"
                                placeholder="Last Name"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Field type="text" name="email"
                                component={renderText}
                                label="email"
                                placeholder="email"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="">User Status</Label>
                            <CustomInput id="exampleCustomRadio1" label="User" name="customRadio" type="radio" value="0"
                                onChange={this.handleUserStatusChange} checked={this.state.selectedUserStatusOption == 0} />
                            <CustomInput id="exampleCustomRadio2" label="Admin" name="customRadio" type="radio" value="1"
                                onChange={this.handleUserStatusChange} checked={this.state.selectedUserStatusOption == 1} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="">Active Status</Label>
                            <CustomInput id="activestatus" label="active" name="customRadioactive" type="radio" value="1"
                                onChange={this.handleUserActiveStatusChange} checked={this.state.selectedUserActiveStatusOption == 1} />
                            <CustomInput id="inactivestatus" label="inactive" name="customRadioactive" type="radio" value="0"
                                onChange={this.handleUserActiveStatusChange} checked={this.state.selectedUserActiveStatusOption == 0} />
                        </FormGroup>
                        <FormGroup>
                            <Field type="password" name="reset_password"
                                component={renderText}
                                label="Reset Password"
                                placeholder="password"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Field type="password" name="confirm_password"
                                component={renderText}
                                label="Confirm Password"
                                placeholder="password"
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Row>
                            <Colxx className="text-center" lg="12">
                                <Button className="btn btn-primary" type="submit">Save</Button>
                                <Button className="btn btn-primary" onClick={this.props.toggle}>Cancel</Button>
                            </Colxx>
                        </Row>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

const validateUnitData = values => {
    const errors = {};
    const requiredFields = [
        'first_name',
        'last_name',
        'email',
    ];
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = "(The " + field + " field is required.)";
        }
    });

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = '(Invalid email address.)';
    }
    return errors;
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

UserItemModal = reduxForm({
    form: "UserCU_Form",
    validate: validateUnitData,
    enableReinitialize: true
})(UserItemModal);

export default connect(null, mapDispatchToProps)(UserItemModal);