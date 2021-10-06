import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from "redux-form";
import { Row } from 'reactstrap';
import { Colxx } from '../../components/common/CustomBootstrap';
import {
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
import { USERNEWITEM } from '../../constants/entity';
import { user_status, default_user_password } from '../../constants/defaultValues';

class UserModalNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUserStatusOption: 0,
            default_user_password: default_user_password,
        };
        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount() {

    }

    handleUserStatusChange = selectedUserStatusOption => {
        this.setState({ selectedUserStatusOption: selectedUserStatusOption.target.value });
    };

    submitForm(formProps) {
        formProps.status = this.state.selectedUserStatusOption;
        formProps.password = this.state.default_user_password;
        let api_url = 'admin/newitem';
        this.props.actions.storeUserItemReduxForm(USERNEWITEM, api_url, formProps);
        // this.props.toggle();
    }

    render() {
        const { handleSubmit } = this.props;
        let selected_typeoption_index = 0;
        return (
            <Modal isOpen={this.props.is_modalopen} toggle={this.props.toggle}>
                <Form onSubmit={handleSubmit(this.submitForm)}>
                    <ModalHeader toggle={this.props.toggle}>
                        New User
                    </ModalHeader>
                    <ModalBody>
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
                            <Label for="">Default Password: {default_user_password}</Label>
                        </FormGroup>
                        <FormGroup>
                            <Label for="">User Status</Label>
                            <CustomInput id="exampleCustomRadio1" label="User" name="customRadio" type="radio" value="0"
                                onChange={this.handleUserStatusChange} checked={this.state.selectedUserStatusOption == 0} />
                            <CustomInput id="exampleCustomRadio2" label="Admin" name="customRadio" type="radio" value="1"
                                onChange={this.handleUserStatusChange} checked={this.state.selectedUserStatusOption == 1} />
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

const validateUserData = values => {
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

UserModalNew = reduxForm({
    form: "UserCU_Form",
    validate: validateUserData,
})(UserModalNew);

export default connect(null, mapDispatchToProps)(UserModalNew);