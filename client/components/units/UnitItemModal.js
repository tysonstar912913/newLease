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
import Select from "react-select";
import renderText from "../common/form/renderText";
import * as crudAction from '../../actions/crudAction';
import { unit_buildings, unit_floor, unit_status, unit_type } from '../../constants/defaultValues';
import { UNITUPDATE, UNITVIEW } from '../../constants/entity';

class UnitItemModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUnitTypeOption: this.props.initialValues.unit_type,
            selectedUnitStatusOption: this.props.initialValues.unit_status,
            selectedBuildingOption: this.props.initialValues.building,
            selectedFloorOption: this.props.initialValues.floor,
            building_end_num: 15,
            floor_end_num: 10,
            unit_type: unit_type,
            unit_status: unit_status,
            unit_buildings: unit_buildings,
            unit_floor: unit_floor,
        };
        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount() {

    }

    componentWillReceiveProps(newProps) {
        const { initialValues } = newProps;
        this.setState({
            selectedUnitTypeOption: initialValues.unit_type,
            selectedUnitStatusOption: initialValues.unit_status,
            selectedBuildingOption: initialValues.building,
            selectedFloorOption: initialValues.floor,
        })
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
        let id = formProps.id;
        let api_url = 'units/update';
        let refreshDispathchData = {
            entity: UNITVIEW,
            reqUrl: 'units/getitem'
        }
        
        let refreshLoglistCriteria = {
            reqUrl: 'logs/getloglist',
            order_by_column: 'logs.created_at',
            order_by_dir: 'DESC',
            type: 2,
            data_id: id
        }
        this.props.actions.submitReduxForm(UNITUPDATE, api_url, formProps, id, refreshDispathchData, refreshLoglistCriteria);
        this.props.toggle();
    }

    render() {
        const { handleSubmit } = this.props;
        let data_id = -1;
        let selected_buildingoption_index = 0;
        let selected_flooroption_index = 0;
        let status_uneditable_text = '';
        if (this.props.initialValues) {
            data_id = this.props.initialValues.id;
            for (let i = 0; i < this.state.unit_buildings.length; i++) {
                if (this.props.initialValues && this.state.unit_buildings[i].value === this.props.initialValues.building) {
                    selected_buildingoption_index = i;
                }
            }
            for (let i = 0; i < this.state.unit_floor.length; i++) {
                if (this.props.initialValues && this.state.unit_floor[i].value === this.props.initialValues.floor) {
                    selected_flooroption_index = i;
                }
            }
            for (let i = 0; i < this.state.unit_status.length; i++) {
                if (this.state.unit_status[i].value === this.props.initialValues.unit_status) {
                    status_uneditable_text = 'Unit Status : ' + this.state.unit_status[i].label;
                }
            }
        }
        return (
            // <Modal isOpen={this.props.is_modalopen} toggle={this.props.toggle} backdrop="static">
            <Modal isOpen={this.props.is_modalopen} toggle={this.props.toggle}>
                <Form onSubmit={handleSubmit(this.submitForm)}>
                    <ModalHeader toggle={this.props.toggle}>
                        Update Unit
                    </ModalHeader>
                    <ModalBody>
                        <Input type="hidden" name="id" value={data_id}></Input>
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
                                    label: this.state.unit_buildings[selected_buildingoption_index].label,
                                    value: this.state.unit_buildings[selected_buildingoption_index].value
                                }}
                                onChange={this.handleBuildingChange}
                                options={this.state.unit_buildings} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="">Floor</Label>
                            <Select
                                defaultValue={{
                                    label: this.state.unit_floor[selected_flooroption_index].label,
                                    value: this.state.unit_floor[selected_flooroption_index].value
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
                            {this.state.selectedUnitStatusOption < 3 ? (
                                <div>
                                    <Label for="">Unit Status</Label>
                                    <CustomInput id="unitstatusradio1" label="Available" name="unitstatus" type="radio" value="1"
                                        onChange={this.handleUnitStatusChange} checked={this.state.selectedUnitStatusOption == 1} />
                                    <CustomInput id="unitstatusradio2" label="Not Available" name="unitstatus" type="radio" value="2"
                                        onChange={this.handleUnitStatusChange} checked={this.state.selectedUnitStatusOption == 2} />
                                </div>
                            ) : (
                                    <Label for="">{status_uneditable_text}</Label>
                                )}
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Row>
                            <Colxx className="text-center" lg="12">
                                <Button className="btn btn-primary" type="submit" disabled={this.state.selectedUnitStatusOption < 3 ? false : true}>
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

// function mapStateToProps(state) {
//     return {
//         unitItemData: state.clientData.unititem,
//     };
// }

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

UnitItemModal = reduxForm({
    form: "ClientsCU_Form",
    validate: validateUnitData,
    enableReinitialize: true
})(UnitItemModal);

export default connect(null, mapDispatchToProps)(UnitItemModal);