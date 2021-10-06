import React, { Component, Fragment } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from "redux-form";
import { Row } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import { Button } from "reactstrap";
import ClientDataListView from './ClientDataListView';
import * as clientsService from '../../services/clientsService';
import { client_type } from '../../constants/defaultValues';
import ClientItemModalNew from './ClientItemModalNew';

class Clients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeOptions: client_type,
            selectedTypeOption: 2,
            selectedStatusOption: 1,
            modal: false
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="mb-2">
                            <h1>Clients List</h1>
                            <div className="text-zero top-right-button-container">
                                <Button className="top-right-button btn btn-primary btn-lg" onClick={this.toggle}>
                                    New Client
                                </Button>
                            </div>
                        </div>
                    </Colxx>
                </Row>
                <ClientDataListView />
                <ClientItemModalNew toggle={this.toggle} is_modalopen={this.state.modal}></ClientItemModalNew>
            </Fragment>
        );
    }
}

const validateClientData = values => {
    const errors = {};
    const requiredFields = ["company_name", "company_name_ar", "cr_number", "vat_rno", "address"];
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = "(The " + field + " field is required.)";
        }
    });
    return errors;
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(Object.assign({}, clientsService), dispatch)
});

Clients = reduxForm({
    form: "ClientsCU_Form",
    validate: validateClientData
})(Clients);

export default connect(null, mapDispatchToProps)(Clients);