import React, { Component, Fragment } from 'react';
import { Prompt } from 'react-router'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from "redux-form";
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import {
    Form,
    FormGroup,
    Button
} from "reactstrap";
import Select from "react-select";
import renderText from "../common/form/renderText";
import * as crudAction from '../../actions/crudAction';
import { PROPOSALSELECTABLECLIENTS, PROPOSALSELECTABLEUNITS, PROPOSALUPDATE, PROPOSALVIEW, PROPOSALWHOLEUNITS } from '../../constants/entity';
import PriceFeeBreak from './PriceFeeBreak';
import { unit_type, rent_free_period, payment_frequency, proposal_types } from '../../constants/defaultValues';
import { Input } from '@material-ui/core';
import axios from 'axios';
import { SERVER_URL } from '../../config/config';
import { NotificationManager, Notifications } from '../common/react-notifications';
import history from '../../utils/history';

class ProposalEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            get_client_list_reqUrl: 'proposal/getclientlist',
            get_unit_list_reqUrl: 'proposal/getunitlist',
            get_whole_unit_list_reqUrl: 'proposal/getwholeunitlist',

            client_list: this.props.client_list || [],
            selected_client_id: this.props.selected_client_id || -1,
            selected_client_ceo_label: this.props.selected_client_ceo_label || '',
            selected_client_address_label: this.props.selected_client_address_label || '',
            selected_client_id_index: this.props.selected_client_id_index || null,

            unit_list: this.props.client_list || [],
            selected_unit_id: null,
            selected_unit_arr: this.props.selected_unit_arr || [],

            whole_unit_list: this.props.whole_unit_list || [],

            rent_free_period: rent_free_period,
            selectedRentFreePeriodOption: this.props.selectedRentFreePeriodOption || 0,
            payment_frequency: payment_frequency,
            selectedPaymentFrequencyOption: this.props.selectedPaymentFrequencyOption || 0,

            proposal_status: this.props.proposal_status || 1,
            proposal_id: this.props.proposal_id || -1,
            initialValues: null,

            pricefeebreakData: {
                base_rent: 0,
                annual_community_service_charges: 0,
                annual_building_service_charges: 0,
                annual_increment_on_service_charges: 0,
                rent_free_period: 0,
            },

            selectedFiles: null,
            is_fileuploading: false,
            selected_type: null,
            selected_unit_type: null,
        };
        this.submitForm = this.submitForm.bind(this);
        this.onClickAddUnit = this.onClickAddUnit.bind(this);
        this.saveProposalAsPending = this.saveProposalAsPending.bind(this);
        this.saveProposalAsDraft = this.saveProposalAsDraft.bind(this);
        this.goBack = this.goBack.bind(this);
        this.onAttatchmentFileChange = this.onAttatchmentFileChange.bind(this);
        this.init();
    }

    createNotification = (type, className) => {
        let cName = className || "";
        return () => {
            switch (type) {
                case "primary":
                    NotificationManager.primary(
                        "This is a notification!",
                        "Primary Notification",
                        3000,
                        null,
                        null,
                        cName
                    );
                    break;
                case "secondary":
                    NotificationManager.secondary(
                        "This is a notification!",
                        "Secondary Notification",
                        3000,
                        null,
                        null,
                        cName
                    );
                    break;
                case "info":
                    NotificationManager.info("Info message", "", 3000, null, null, cName);
                    break;
                case "success":
                    NotificationManager.success(
                        "Success message",
                        "Title here",
                        3000,
                        null,
                        null,
                        cName
                    );
                    break;
                case "warning":
                    NotificationManager.warning(
                        "Warning message",
                        "Close after 3000ms",
                        3000,
                        null,
                        null,
                        cName
                    );
                    break;
                case "error":
                    NotificationManager.error(
                        "Error message",
                        "Click me!",
                        5000,
                        () => {
                            alert("callback");
                        },
                        null,
                        cName
                    );
                    break;
                default:
                    NotificationManager.info("Info message");
                    break;
            }
        };
    };

    componentDidMount() {

    }

    componentWillReceiveProps(newProps) {
        if (newProps.client_list && newProps.client_list.data) {
            this.setState({ unit_list: newProps.client_list });
        }
        if (newProps.unit_list && newProps.unit_list.data) {
            this.setState({ unit_list: newProps.unit_list });
        }
        if (newProps.whole_unit_list && newProps.whole_unit_list.data) {
            this.setState({ whole_unit_list: newProps.whole_unit_list });
        }

        if (newProps.initialValues) {
            console.log('newProps.initialValues.selected_unit_arr', newProps.selected_unit_arr)
            this.setState({
                initialValues: newProps.initialValues,
                selected_client_id: newProps.selected_client_id,
                selected_client_id_index: newProps.selected_client_id_index,
                selected_client_ceo_label: newProps.selected_client_ceo_label,
                selected_client_address_label: newProps.selected_client_address_label,
                selected_unit_arr: newProps.selected_unit_arr,
                selectedRentFreePeriodOption: newProps.selectedRentFreePeriodOption,
                selectedPaymentFrequencyOption: newProps.selectedPaymentFrequencyOption,
                proposal_id: newProps.proposal_id,
                proposal_status: newProps.proposal_status,
                selected_type: newProps.initialValues.type,
                selected_unit_type: newProps.cur_selected_unit_type !== null ? newProps.cur_selected_unit_type : newProps.initialValues.unit_type,
            })
            console.log('mapStateToPropscomponentWillReceiveProps', newProps.cur_selected_unit_type, newProps.initialValues.unit_type)
            let pricefeebreakData = {
                base_rent: newProps.initialValues.base_rent,
                annual_community_service_charges: newProps.initialValues.annual_community_service_charges,
                annual_building_service_charges: newProps.initialValues.annual_building_service_charges,
                annual_increment_on_service_charges: newProps.initialValues.annual_increment_on_service_charges,
                rent_free_period: newProps.initialValues.rent_free_period,
            }
            this.setState({ pricefeebreakData: pricefeebreakData })
        }
    }

    init() {
        let clientcriteria = {};
        this.props.actions.fetchAll(PROPOSALSELECTABLECLIENTS, this.state.get_client_list_reqUrl, clientcriteria);
        let unitcriteria = {};
        this.props.actions.fetchAll(PROPOSALSELECTABLEUNITS, this.state.get_unit_list_reqUrl, unitcriteria);
        this.props.actions.fetchAll(PROPOSALWHOLEUNITS, this.state.get_whole_unit_list_reqUrl, unitcriteria);
        // whole_unit_list
        if (this.props.match.params.proposal_id && this.props.match.params.proposal_id > 0) {
            const proposal_id = this.props.match.params.proposal_id;
            this.setState({ proposal_id: proposal_id });
            const reqUrl = 'proposal/getitem';
            this.props.actions.fetchById(PROPOSALVIEW, reqUrl, proposal_id);
        }
    }

    handleClientChange = selectedClientOption => {
        let selected_client_id = selectedClientOption.value;
        this.props.client_list.map((client_item, index) => {
            if (client_item.value === selected_client_id) {
                this.setState({ selected_client_ceo_label: client_item.company_name_ar });
                this.setState({ selected_client_address_label: client_item.address });
            }
        })
        this.setState({ selected_client_id: selected_client_id });
    };

    handleUnitChange = selectedUnitOption => {
        this.setState({ selected_unit_id: selectedUnitOption.value });
    };

    handleRentFreePeriodChange = selectedRentFreePeriodOption => {
        var stateCopy = Object.assign({}, this.state.pricefeebreakData);
        stateCopy.rent_free_period = Object.assign({}, stateCopy.rent_free_period);
        stateCopy.rent_free_period = selectedRentFreePeriodOption.value;
        this.setState({ pricefeebreakData: stateCopy });
        this.setState({ selectedRentFreePeriodOption: selectedRentFreePeriodOption.value });
    };

    handlePaymentFrequencyChange = selectedPaymentFrequencyOption => {
        this.setState({ selectedPaymentFrequencyOption: selectedPaymentFrequencyOption.value });
    };

    onClickAddUnit() {
        if (this.state.selected_unit_id !== null && this.state.selected_unit_id > 0) {
            // this.props.unit_list.map((unit_item, index) => {
            this.props.whole_unit_list.map((unit_item, index) => {
                if (unit_item.value === this.state.selected_unit_id) {
                    if (!this.state.selected_unit_arr.includes(index)) {
                        this.setState({
                            selected_unit_arr: [...this.state.selected_unit_arr, index]
                        })
                    }
                }
            })
        }
    }

    onClickRemoveUnit(index) {
        let selected_unit_arr = this.state.selected_unit_arr;
        selected_unit_arr.splice(index, 1);
        this.setState({ selected_unit_arr: selected_unit_arr });
    }

    saveProposalAsPending() {
        this.setState({ proposal_status: 2 });
    }

    saveProposalAsDraft() {
        this.setState({ proposal_status: 1 });
    }

    goBack() {
        history.goBack();
    }

    submitForm(formProps) {
        formProps.client_id = this.state.selected_client_id;
        formProps.rent_free_period = this.state.selectedRentFreePeriodOption;
        formProps.payment_frequency = this.state.selectedPaymentFrequencyOption;
        let selected_unit_id_arr = [];
        // if (this.state.selected_unit_arr.length === 0) {
        //     alert('Add Unit');
        //     return;
        // }
        this.state.selected_unit_arr.map((selected_index, index) => {
            // selected_unit_id_arr.push(this.props.unit_list[selected_index].value);
            selected_unit_id_arr.push(this.props.whole_unit_list[selected_index].value);
        })
        formProps.unit_ids = selected_unit_id_arr.join(',');
        formProps.proposal_status = this.state.proposal_status;
        formProps.unit_type = this.state.selected_unit_type;

        if (this.state.proposal_status === 1) {
            if (confirm('This data will be saved as draft.') === false) {
                return;
            }
        }

        let api_url = 'proposal/update';
        let backUrl = 'app/proposal/view/' + formProps.proposal_id;
        this.props.actions.submitReduxFormUpdateProposalLease(PROPOSALUPDATE, api_url, formProps, formProps.proposal_id, backUrl);
    }

    onAttatchmentFileChange = e => {
        // this.setState({
        //     selectedFiles: e.target.files[0]
        // });
        var self = this;
        self.setState({ is_fileuploading: true });
        const proposal_id = this.state.proposal_id;
        let api_url = 'uploadproposalattatchfile';
        const formData = new FormData();
        formData.append("attachment_file", e.target.files[0]);
        console.log('formData', formData);
        // self.createNotification('success');
        axios({
            url: SERVER_URL + api_url + '/' + proposal_id,
            method: "POST",
            data: formData
        })
            .then(function (response) {
                // this.createNotification("success");
                if (!response.data.error) {
                    alert(response.data.message);
                }
                console.log(response);
                self.setState({ is_fileuploading: false });
            })
            .catch(function (error) {
                console.log(error);
                alert('Error occured');
                self.setState({ is_fileuploading: false });
            });
    }

    onChangeBaseRent(e) {
        let base_rent = e.target.value;
        var stateCopy = Object.assign({}, this.state.pricefeebreakData);
        stateCopy.base_rent = Object.assign({}, stateCopy.base_rent);
        stateCopy.base_rent = base_rent;
        this.setState({ pricefeebreakData: stateCopy });
    }

    onChangeCSC(e) {
        let annual_community_service_charges = e.target.value;
        var stateCopy = Object.assign({}, this.state.pricefeebreakData);
        stateCopy.annual_community_service_charges = Object.assign({}, stateCopy.annual_community_service_charges);
        stateCopy.annual_community_service_charges = annual_community_service_charges;
        this.setState({ pricefeebreakData: stateCopy });
    }

    onChangeBSC(e) {
        let annual_building_service_charges = e.target.value;
        var stateCopy = Object.assign({}, this.state.pricefeebreakData);
        stateCopy.annual_building_service_charges = Object.assign({}, stateCopy.annual_building_service_charges);
        stateCopy.annual_building_service_charges = annual_building_service_charges;
        this.setState({ pricefeebreakData: stateCopy });
    }

    onChangeISC(e) {
        let annual_increment_on_service_charges = e.target.value;
        var stateCopy = Object.assign({}, this.state.pricefeebreakData);
        stateCopy.annual_increment_on_service_charges = Object.assign({}, stateCopy.annual_increment_on_service_charges);
        stateCopy.annual_increment_on_service_charges = annual_increment_on_service_charges;
        this.setState({ pricefeebreakData: stateCopy });
    }

    handleProposalTypeChange = selectedTypeOption => {
        this.setState({ selected_type: selectedTypeOption.value });
    }

    handleUnitTypeChange = selectedTypeOption => {
        this.setState({ selected_unit_type: selectedTypeOption.value });
        // let unitcriteria = {
        //     unit_type: selectedTypeOption.value
        // };
        // this.props.actions.fetchAll(PROPOSALSELECTABLEUNITS, this.state.get_unit_list_reqUrl, unitcriteria);
    }

    render() {
        if (this.props.selectable_client_list) {
            this.modifyClientList(this.props.selectable_client_list);
        }
        if (this.props.selectable_unit_list) {
            this.modifyUnitList(this.props.selectable_unit_list);
        }
        // let selected_type_label = '';
        // let selected_type_value = 0;
        // if (this.state.selected_type !== null) {
        //     selected_type_label = proposal_types[this.state.selected_type].label;
        //     selected_type_value = proposal_types[this.state.selected_type].value;
        // }
        console.log('here');
        console.log(this.state);
        const { handleSubmit } = this.props;
        return (
            <Fragment>
                <Form onSubmit={handleSubmit(this.submitForm)} encType="multipart/form-data">
                    <Input type="hidden" name="proposal_id" value={this.state.proposal_id} />
                    <Input type="hidden" name="client_id" value={this.state.selected_client_id} />
                    <Input type="hidden" name="proposal_status" value={this.state.proposal_status} />
                    <Row>
                        <Colxx xxs="12">
                            <div className="mb-2">
                                <h1>{this.state.initialValues ? this.state.initialValues.company_name : ""} Edit Proposal</h1>
                                <Separator className="separator mb-5"></Separator>
                                <div className="card mb-5">
                                    <div className="card-body">
                                        <h5 className="card-title">Client</h5>
                                        <Row>
                                            <Colxx className="mb-5 col-12 col-md-6">
                                                <label>Select Client</label>
                                                {this.props.client_list.length > 0 && this.state.selected_client_id_index != null && this.state.selected_client_id_index >= 0 && this.state.selected_client_id_index < this.props.client_list.length ? (
                                                    <Select
                                                        // defaultValue={{
                                                        //     label: this.props.client_list[this.state.selected_client_id_index].label,
                                                        //     value: this.props.client_list[this.state.selected_client_id_index].value
                                                        // }}
                                                        value={this.props.client_list.filter(({ value }) => value === this.props.client_list[this.state.selected_client_id_index].value)}
                                                        onChange={this.handleClientChange}
                                                        options={this.props.client_list} />
                                                ) : (
                                                        <Select
                                                            onChange={this.handleClientChange}
                                                            options={this.props.client_list} />
                                                    )}
                                            </Colxx>
                                            {this.state.selected_client_id > 0 ? (
                                                <Colxx className="mb-5 col-12 col-md-6">
                                                    <p>CEO: {this.state.selected_client_ceo_label}</p>
                                                    <p>Address: {this.state.selected_client_address_label}</p>
                                                </Colxx>
                                            ) : ("")}
                                        </Row>
                                    </div>
                                </div>
                                <Separator className="separator mb-5 mt-5"></Separator>
                                <Row>
                                    <Col md="6">
                                        <Card>
                                            <CardBody>
                                                <CardTitle tag="h5">Proposal Type</CardTitle>
                                                <Row>
                                                    <Col md={6}>
                                                        <label>Select Proposal Type</label>
                                                        {this.state.selected_type !== null ? (
                                                            <Select
                                                                // defaultValue={{
                                                                //     // label: proposal_types[this.state.selected_type].label,
                                                                //     // value: proposal_types[this.state.selected_type].value
                                                                //     value: selected_type_value,
                                                                //     label: selected_type_label,
                                                                // }}
                                                                value={proposal_types.filter(({ value }) => value === this.state.selected_type)}
                                                                onChange={this.handleProposalTypeChange}
                                                                options={proposal_types} />
                                                        ) : (
                                                                <Select
                                                                    onChange={this.handleProposalTypeChange}
                                                                    options={proposal_types} />
                                                            )}
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col md="6">
                                        <Card>
                                            <CardBody>
                                                <CardTitle tag="h5">Unit Type</CardTitle>
                                                <Row>
                                                    <Col md={6}>
                                                        <label>Select Unit Type</label>
                                                        {console.log('mapStateToPropsrender', this.state.selected_unit_type)}
                                                        {this.state.selected_unit_type != null && this.state.selected_unit_type <= unit_type.length ? (
                                                            <Select
                                                                // defaultValue={{
                                                                //     label: unit_type[this.state.selected_unit_type - 1].label,
                                                                //     value: unit_type[this.state.selected_unit_type - 1].value
                                                                // }}
                                                                value={unit_type.filter(({ value }) => value === (this.state.selected_unit_type))}
                                                                onChange={this.handleUnitTypeChange}
                                                                options={unit_type} />
                                                        ) : (
                                                                <Select
                                                                    onChange={this.handleUnitTypeChange}
                                                                    options={unit_type} />
                                                            )}
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                                <Separator className="separator mb-5 mt-5"></Separator>
                                <div className="card mb-5">
                                    <div className="card-body">
                                        <h5 className="card-title">Units</h5>
                                        <Row>
                                            <Colxx className="mb-5 col-12 col-md-6">
                                                <label>Select Unit</label>
                                                <Select
                                                    onChange={this.handleUnitChange}
                                                    options={this.props.unit_list} />
                                            </Colxx>
                                            <Colxx className="mb-5 col-12 col-md-6">
                                                <div className="text-zero top-right-button-container">
                                                    <Button type="button" className="top-right-button btn btn-secondary btn-md" onClick={this.onClickAddUnit}>Add Unit</Button>
                                                </div>
                                            </Colxx>
                                        </Row>
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>ID</th>
                                                    <th>Building</th>
                                                    <th>Floor</th>
                                                    <th>Unit Type</th>
                                                    <th>Area</th>
                                                    <th>&nbsp;</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {console.log('this.state.selected_unit_arr', this.state.selected_unit_arr)}
                                                {this.state.selected_unit_arr.length === 0 ? ("") : this.state.selected_unit_arr.map((added_unit_item_index, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{this.props.whole_unit_list[added_unit_item_index].value}</td>
                                                            <td>{this.props.whole_unit_list[added_unit_item_index].building}</td>
                                                            <td>{this.props.whole_unit_list[added_unit_item_index].floor}</td>
                                                            <td>{this.props.whole_unit_list[added_unit_item_index].unit_type}</td>
                                                            <td>{this.props.whole_unit_list[added_unit_item_index].unit_area}</td>
                                                            <td>
                                                                <Button type="button" className="btn btn-danger btn-xs btn btn-secondary" unit-id={index} onClick={() => this.onClickRemoveUnit(index)}>
                                                                    <div className="glyph-icon simple-icon-trash"></div>
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="card mb-5">
                                    <div className="card-body">
                                        <h5 className="card-title">Terms</h5>
                                        <FormGroup>
                                            <Field type="number" name="base_rent"
                                                component={renderText}
                                                label="Base rent (SAR / ㎡):"
                                                onChange={e => this.onChangeBaseRent(e)}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Field type="number" name="annual_community_service_charges"
                                                component={renderText}
                                                label="Annual Community Service Charges: (SAR)"
                                                onChange={e => this.onChangeCSC(e)}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Field type="number" name="annual_building_service_charges"
                                                component={renderText}
                                                label="Annual Building Service Charges (SAR):"
                                                onChange={e => this.onChangeBSC(e)}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Field type="number" name="annual_increment_on_service_charges"
                                                component={renderText}
                                                label="Annual increment on service charge (%):"
                                                onChange={e => this.onChangeISC(e)}
                                            />
                                        </FormGroup>
                                        <Row>
                                            <Colxx className="mt-2 mb-3 col-12">
                                                <label>Rent Free Period</label>
                                                <Select
                                                    // defaultValue={{
                                                    //     label: this.state.rent_free_period[this.state.selectedRentFreePeriodOption].label,
                                                    //     value: this.state.rent_free_period[this.state.selectedRentFreePeriodOption].value
                                                    // }}
                                                    defaultValue={{
                                                        label: this.state.selectedRentFreePeriodOption + ' Months',
                                                        value: this.state.selectedRentFreePeriodOption
                                                    }}
                                                    onChange={this.handleRentFreePeriodChange}
                                                    options={this.state.rent_free_period} />
                                            </Colxx>
                                        </Row>
                                        <Row>
                                            <Colxx className="mt-2 mb-5 col-12">
                                                <label>Payment Frequency</label>
                                                <Select
                                                    defaultValue={{
                                                        label: this.state.payment_frequency[this.state.selectedPaymentFrequencyOption].label,
                                                        value: this.state.payment_frequency[this.state.selectedPaymentFrequencyOption].value
                                                    }}
                                                    onChange={this.handlePaymentFrequencyChange}
                                                    options={this.state.payment_frequency} />
                                            </Colxx>
                                        </Row>
                                        <Row>
                                            <Colxx className="mt-2 mb-5 col-12">
                                                <label className="mr-3">Attachment PDF File</label>
                                                <input type="file"
                                                    name="send_file"
                                                    accept="application/pdf"
                                                    onChange={this.onAttatchmentFileChange} />
                                            </Colxx>
                                        </Row>
                                    </div>
                                </div>

                                <div className="mb-4"></div>

                                <PriceFeeBreak calcData={this.state.pricefeebreakData}></PriceFeeBreak>

                                {(this.state.initialValues && this.state.initialValues.proposal_status && this.state.initialValues.proposal_status === 1) ? (
                                    <Row>
                                        <Colxx className="mb-5 col-12 col-md-12 text-center">
                                            <Button type="submit" className="top-right-button btn btn-primary btn-md"
                                                onClick={this.saveProposalAsPending}
                                                disabled={this.state.is_fileuploading} >Save As Pending</Button>
                                            <Button type="submit" className="top-right-button btn btn-primary btn-md ml-2"
                                                onClick={this.saveProposalAsDraft}
                                                disabled={this.state.is_fileuploading} >Save As Draft</Button>
                                            <Button type="button" className="top-right-button btn btn-md ml-2"
                                                onClick={this.goBack}
                                                disabled={this.state.is_fileuploading}>Back</Button>
                                            {/* <Button type="submit" className="top-right-button btn btn-md ml-2"
                    onClick={this.saveProposalAsDraft}
                    disabled={this.state.is_fileuploading}>Cancel</Button> */}
                                        </Colxx>
                                    </Row>
                                ) : ("")}

                                {(this.state.initialValues && this.state.initialValues.proposal_status && this.state.initialValues.proposal_status === 2) ? (
                                    <Row>
                                        <Colxx className="mb-5 col-12 col-md-12 text-center">
                                            <Button type="submit" className="top-right-button btn btn-primary btn-md"
                                                onClick={this.saveProposalAsPending}
                                                disabled={this.state.is_fileuploading} >Save As Pending</Button>
                                            <Button type="submit" className="top-right-button btn btn-md ml-2"
                                                onClick={this.saveProposalAsDraft}
                                                disabled={this.state.is_fileuploading}>Save As Draft</Button>
                                            <Button type="button" className="top-right-button btn btn-md ml-2"
                                                onClick={this.goBack}
                                                disabled={this.state.is_fileuploading}>Back</Button>
                                            {/* <Button type="submit" className="top-right-button btn btn-md ml-2"
                    onClick={this.saveProposalAsDraft}
                    disabled={this.state.is_fileuploading}>Cancel</Button> */}
                                        </Colxx>
                                    </Row>
                                ) : ("")}
                            </div>
                        </Colxx>
                    </Row>
                </Form>
            </Fragment>
        );
    }
}

const validateProposalData = values => {
    const errors = {};
    const requiredFields = [
        // "base_rent",
        // "annual_community_service_charges",
        // "annual_building_service_charges",
        // "annual_increment_on_service_charges"
    ];
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = "(The " + field + " field is required.)";
        }
    });
    return errors;
};

function mapStateToProps(state) {
    let client_list_options = [];
    if (state.clientData.selectable_client_list && state.clientData.selectable_client_list.data) {
        for (let i = 0; i < state.clientData.selectable_client_list.data.length; i++) {
            client_list_options.push({
                label: state.clientData.selectable_client_list.data[i].company_name,
                value: state.clientData.selectable_client_list.data[i].id,
                company_name_ar: state.clientData.selectable_client_list.data[i].company_name_ar,
                address: state.clientData.selectable_client_list.data[i].address,
            });
        }
    }
    let unit_list_options = [];
    if (state.clientData.selectable_unit_list && state.clientData.selectable_unit_list.data) {
        for (let i = 0; i < state.clientData.selectable_unit_list.data.length; i++) {
            let unit_type_label = 'Office';
            for (let j = 0; j < unit_type[j]; j++) {
                if (state.clientData.selectable_unit_list.data[i].unit_type === unit_type[j].value) {
                    unit_type_label = unit_type[j].label;
                }
            }
            unit_list_options.push({
                label: state.clientData.selectable_unit_list.data[i].unit_name,
                value: state.clientData.selectable_unit_list.data[i].id,
                building: state.clientData.selectable_unit_list.data[i].building,
                floor: state.clientData.selectable_unit_list.data[i].floor,
                unit_type: unit_type_label,
                unit_area: state.clientData.selectable_unit_list.data[i].unit_area,
            });
        }
    }
    let whole_unit_list_options = [];
    if (state.clientData.whole_unit_list && state.clientData.whole_unit_list.data) {
        for (let i = 0; i < state.clientData.whole_unit_list.data.length; i++) {
            let unit_type_label = 'Office';
            for (let j = 0; j < unit_type[j]; j++) {
                if (state.clientData.whole_unit_list.data[i].unit_type === unit_type[j].value) {
                    unit_type_label = unit_type[j].label;
                }
            }
            whole_unit_list_options.push({
                label: state.clientData.whole_unit_list.data[i].unit_name,
                value: state.clientData.whole_unit_list.data[i].id,
                building: state.clientData.whole_unit_list.data[i].building,
                floor: state.clientData.whole_unit_list.data[i].floor,
                unit_type: unit_type_label,
                unit_area: state.clientData.whole_unit_list.data[i].unit_area,
            });
        }
    }

    let initialValues = null;
    let selected_client_id = -1;
    let selected_client_id_index = null;
    let selected_client_ceo_label = '';
    let selected_client_address_label = '';
    let selected_unit_arr = [];
    let selectedRentFreePeriodOption = 0;
    let selectedPaymentFrequencyOption = 0;
    let proposal_status = 1;
    let proposal_id = -1;
    let cur_selected_unit_type = null;

    if (state.clientData.proposalview && state.clientData.proposalview.data) {
        initialValues = state.clientData.proposalview.data;
        proposal_status = initialValues.proposal_status;
        proposal_id = initialValues.proposal_id;

        if (state.clientData.selectable_client_list && state.clientData.selectable_client_list.data) {
            client_list_options.map((client_item, index) => {
                if (client_item.value === initialValues.client_id) {
                    selected_client_id = initialValues.client_id;
                    selected_client_id_index = index;
                    selected_client_ceo_label = client_item.label;
                    selected_client_address_label = client_item.address;
                }
            })
        }

        let select_unit_ids_arr = initialValues.unit_ids.split(',');
        console.log('select_unit_ids_arr', select_unit_ids_arr)
        for (let i = 0; i < select_unit_ids_arr.length; i++)
            select_unit_ids_arr[i] = parseInt(select_unit_ids_arr[i], 10);

        // unit_list_options.map((unit_item, index) => {
        //     if (select_unit_ids_arr.includes(unit_item.value)) {
        //         selected_unit_arr.push(index);
        //     }
        // })
        whole_unit_list_options.map((unit_item, index) => {
            if (select_unit_ids_arr.includes(unit_item.value)) {
                selected_unit_arr.push(index);
            }
        })

        rent_free_period.map((item, index) => {
            if (item.value === initialValues.rent_free_period) {
                // selectedRentFreePeriodOption = index;
                selectedRentFreePeriodOption = initialValues.rent_free_period;
            }
        })
        payment_frequency.map((item, index) => {
            if (item.value === initialValues.payment_frequency) {
                selectedPaymentFrequencyOption = index;
            }
        })

        // cur_selected_unit_type
        console.log('mapStateToProps', state.clientData.selectable_unit_list.unit_type)
        if (state.clientData.selectable_unit_list && state.clientData.selectable_unit_list.unit_type) {
            cur_selected_unit_type = state.clientData.selectable_unit_list.unit_type;
        }
    }
    return {
        client_list: client_list_options,
        // whole_unit_list: state.clientData.whole_unit_list,
        whole_unit_list: whole_unit_list_options,
        unit_list: unit_list_options,
        initialValues: (initialValues === null) ? null : initialValues,
        selected_client_id: selected_client_id,
        selected_client_id_index: selected_client_id_index,
        selected_client_ceo_label: selected_client_ceo_label,
        selected_client_address_label: selected_client_address_label,
        selected_unit_arr: selected_unit_arr,
        selectedRentFreePeriodOption: selectedRentFreePeriodOption,
        selectedPaymentFrequencyOption: selectedPaymentFrequencyOption,
        proposal_id: proposal_id,
        proposal_status: proposal_status,

        cur_selected_unit_type: cur_selected_unit_type,
    };
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

ProposalEdit = reduxForm({
    form: "ProposalCU_Form",
    validate: validateProposalData,
})(ProposalEdit);

export default connect(mapStateToProps, mapDispatchToProps)(ProposalEdit);