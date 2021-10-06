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
import Select from "react-select";
import renderText from "../common/form/renderText";
import * as crudAction from '../../actions/crudAction';
import { UNITNEWITEM } from '../../constants/entity';
import { unit_buildings, unit_floor } from '../../constants/defaultValues';

class UnitItemModalNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUnitTypeOption: 1,
            selectedUnitStatusOption: 1,
            building_end_num: 15,
            floor_end_num: 10,
            unit_buildings: unit_buildings,
            unit_floor: unit_floor,
            selectedBuildingOption: 1,
            selectedFloorOption: 1,
        };
        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount() {

    }

    handleUnitTypeChange = selectedUnitTypeOption => {
        this.setState({ selectedUnitTypeOption: selectedUnitTypeOption.target.value });
    };

    handleUnitStatusChange = selectedUnitStatusOption => {
        this.setState({ selectedUnitStatusOption: selectedUnitStatusOption.target.value });
    };

    handleBuildingChange = selectedBuildingOption => {
        this.setState({ selectedBuildingOption: selectedBuildingOption.value });
    };

    handleFloorChange = selectedFloorOption => {
        this.setState({ selectedFloorOption: selectedFloorOption.value });
    };

    submitForm(formProps) {
        formProps.unit_type = this.state.selectedUnitTypeOption;
        formProps.building = this.state.selectedBuildingOption;
        formProps.floor = this.state.selectedFloorOption;
        formProps.unit_status = this.state.selectedUnitStatusOption;
        if (formProps.unit_type != 2) {
            delete formProps['number_of_bedrooms'];
            delete formProps['number_of_bathrooms'];
            delete formProps['number_of_livingrooms'];
            delete formProps['number_of_diningrooms'];
            delete formProps['number_of_kitchens'];
            delete formProps['number_of_laundry'];
            delete formProps['number_of_maidrooms'];
            delete formProps['number_of_duplex'];
            delete formProps['number_of_atrium'];
            delete formProps['number_of_terraces'];
            delete formProps['number_of_pools'];
            delete formProps['number_of_lobbies'];
        }
        let api_url = 'units/newitem';
        this.props.actions.submitReduxForm(UNITNEWITEM, api_url, formProps);
        this.props.toggle();
    }

    render() {
        const { handleSubmit } = this.props;
        let selected_typeoption_index = 0;
        return (
            <Modal isOpen={this.props.is_modalopen} toggle={this.props.toggle}>
                <Form onSubmit={handleSubmit(this.submitForm)}>
                    <ModalHeader toggle={this.props.toggle}>
                        New Unit
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="">Unit Type</Label>
                            <CustomInput id="exampleCustomRadio1" label="Office" name="customRadio" type="radio" value="1"
                                onChange={this.handleUnitTypeChange} checked={this.state.selectedUnitTypeOption == 1} />
                            <CustomInput id="exampleCustomRadio2" label="Residental" name="customRadio" type="radio" value="2"
                                onChange={this.handleUnitTypeChange} checked={this.state.selectedUnitTypeOption == 2} />
                            <CustomInput id="exampleCustomRadio3" label="Retail" name="customRadio" type="radio" value="3"
                                onChange={this.handleUnitTypeChange} checked={this.state.selectedUnitTypeOption == 3} />
                        </FormGroup>
                        <FormGroup>
                            <Field type="text" name="unit_name"
                                component={renderText}
                                label="Name"
                                placeholder="Name"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Field type="number" name="unit_area"
                                component={renderText}
                                label="Area"
                                placeholder="Area"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="">Building</Label>
                            <Select
                                defaultValue={{
                                    label: this.state.unit_buildings[selected_typeoption_index].label,
                                    value: this.state.unit_buildings[selected_typeoption_index].value
                                }}
                                onChange={this.handleBuildingChange}
                                options={this.state.unit_buildings} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="">Floor</Label>
                            <Select
                                defaultValue={{
                                    label: this.state.unit_floor[selected_typeoption_index].label,
                                    value: this.state.unit_floor[selected_typeoption_index].value
                                }}
                                onChange={this.handleFloorChange}
                                options={this.state.unit_floor} />
                        </FormGroup>

                        {this.state.selectedUnitTypeOption == 2 ? (
                            <div>
                                <FormGroup>
                                    <Field type="number" name="number_of_bedrooms"
                                        component={renderText}
                                        label="Number of Bedrooms"
                                        placeholder="Number of Bedrooms"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Field type="number" name="number_of_bathrooms"
                                        component={renderText}
                                        label="Number of Bathrooms"
                                        placeholder="Number of Bathrooms"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Field type="number" name="number_of_livingrooms"
                                        component={renderText}
                                        label="Number of Livingrooms"
                                        placeholder="Number of Livingrooms"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Field type="number" name="number_of_diningrooms"
                                        component={renderText}
                                        label="Number of Diningrooms"
                                        placeholder="Number of Diningrooms"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Field type="number" name="number_of_kitchens"
                                        component={renderText}
                                        label="Number of Kitchens"
                                        placeholder="Number of Kitchens"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Field type="number" name="number_of_laundry"
                                        component={renderText}
                                        label="Number of Laundry"
                                        placeholder="Number of Laundry"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Field type="number" name="number_of_maidrooms"
                                        component={renderText}
                                        label="Number of Maidrooms"
                                        placeholder="Number of Maidrooms"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Field type="number" name="number_of_duplex"
                                        component={renderText}
                                        label="Number of Duplex"
                                        placeholder="Number of Duplex"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Field type="number" name="number_of_atrium"
                                        component={renderText}
                                        label="Number of Atrium"
                                        placeholder="Number of Atrium"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Field type="number" name="number_of_terraces"
                                        component={renderText}
                                        label="Number of Terraces"
                                        placeholder="Number of Terraces"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Field type="number" name="number_of_pools"
                                        component={renderText}
                                        label="Number of Pools"
                                        placeholder="Number of Pools"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Field type="number" name="number_of_lobbies"
                                        component={renderText}
                                        label="Number of Lobbies"
                                        placeholder="Number of Lobbies"
                                    />
                                </FormGroup>
                            </div>
                        ) : ""}

                        <FormGroup>
                            <Label for="">Unit Status</Label>
                            <CustomInput id="unitstatusradio1" label="Available" name="unitstatus" type="radio" value="1"
                                onChange={this.handleUnitStatusChange} checked={this.state.selectedUnitStatusOption == 1} />
                            <CustomInput id="unitstatusradio2" label="Not Available" name="unitstatus" type="radio" value="2"
                                onChange={this.handleUnitStatusChange} checked={this.state.selectedUnitStatusOption == 2} />
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

const validateUnitData = values => {
    const errors = {};
    const requiredFields = ["unit_name", "unit_area"];
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

UnitItemModalNew = reduxForm({
    form: "UnitsCU_Form",
    validate: validateUnitData,
})(UnitItemModalNew);

export default connect(null, mapDispatchToProps)(UnitItemModalNew);