import React, { Component, Fragment } from 'react';
import { Prompt } from 'react-router'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from "redux-form";
import { Row } from 'reactstrap';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import {
    Label,
    Form,
    FormGroup,
    Button
} from "reactstrap";
import Select from "react-select";
import { Input } from '@material-ui/core';
import renderText from "../common/form/renderText";
import * as crudAction from '../../actions/crudAction';
import { PROPOSALSELECTABLEPROPOSALS, PROPOSALVIEW, LEASEVIEW, LEASEUPDATE } from '../../constants/entity';
import PriceFeeBreak from './PriceFeeBreak';
import { reinstatement_condition, rent_free_period, payment_frequency, unit_type } from '../../constants/defaultValues';
import axios from 'axios';
import { SERVER_URL } from '../../config/config';
import history from '../../utils/history';

function convertISOtoDate(datetime, type) {
    let retVal = '';
    if (type === true) {
        const parseTimestamp = Date.parse(datetime);
        const timestamp = new Date(parseTimestamp);
        let month = parseInt(timestamp.getMonth()) + 1;
        let retVal = timestamp.getFullYear() + '-' + month + '-' + timestamp.getDate();
        return retVal;
    }
    else {
        const parseTimestamp = Date.parse(datetime);
        const timestamp = new Date(parseTimestamp);
        let month = parseInt(timestamp.getMonth()) + 1;
        let retVal = month + '/' + timestamp.getDate() + '/' + timestamp.getFullYear();
        return retVal;
    }
}

class LeaseEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            get_proposal_list_reqUrl: 'lease/getproposallist',
            proposal_list: this.props.proposal_list || [],
            selected_proposal_id: parseInt(this.props.match.params.proposal_id) || -1,
            selected_proposalitem_label: '',
            leaseItemData: this.props.leaseItemData || null,
            rent_free_period: rent_free_period,
            selectedRentFreePeriodOption: this.props.selectedRentFreePeriodOption || 0,
            payment_frequency: payment_frequency,
            selectedPaymentFrequencyOption: this.props.selectedPaymentFrequencyOption || 0,
            reinstatement_condition: reinstatement_condition,
            selectedReinstatementConditionOption: this.props.selectedReinstatementConditionOption || 0,
            total_design_review_fee_changed_value: this.props.total_design_review_fee_changed_value || 0,

            lease_status: 1,
            lease_id: this.props.lease_id || -1,

            pricefeebreakData: {
                base_rent: 0,
                annual_community_service_charges: 0,
                annual_building_service_charges: 0,
                annual_increment_on_service_charges: 0,
                rent_free_period: 0,
                total_design_review_fee: 0,
            },
            unit_type: unit_type,

            initialValues: null,
            is_fileuploading: false,
            /****** WORKFLOW ******/

        };
        this.submitForm = this.submitForm.bind(this);
        this.saveProposalAsPending = this.saveProposalAsPending.bind(this);
        this.saveProposalAsDraft = this.saveProposalAsDraft.bind(this);
        this.goBack = this.goBack.bind(this);
        this.onAttatchmentFileChange = this.onAttatchmentFileChange.bind(this);

        this.init();
    }

    componentDidMount() {

    }

    componentWillReceiveProps(newProps) {
        if (newProps.proposal_list && newProps.proposal_list.data) {
            this.setState({
                proposal_list: newProps.proposal_list
            })
        }
        const { leaseItemData } = newProps;
        if (leaseItemData) {
            this.setState({ initialValues: leaseItemData.data })
            this.setState({ leaseItemData: leaseItemData.data })
            let label = leaseItemData.data.proposal_id + ' - ' + leaseItemData.data.company_name + ' - ' + convertISOtoDate(leaseItemData.data.lease_updated_at, false);
            this.setState({ selected_proposalitem_label: label });
            this.setState({
                proposal_list: newProps.proposal_list,
                initialValues: newProps.initialValues,
                lease_status: newProps.lease_status,
                lease_id: newProps.lease_id,
                selected_proposal_id: newProps.selected_proposal_id,
                selected_proposal_id_index: newProps.selected_proposal_id_index,
                selectedRentFreePeriodOption: newProps.selectedRentFreePeriodOption,
                selectedPaymentFrequencyOption: newProps.selectedPaymentFrequencyOption,
                selectedReinstatementConditionOption: newProps.selectedReinstatementConditionOption,
                total_design_review_fee_changed_value: newProps.total_design_review_fee_changed_value,
            })

            let pricefeebreakData = {
                base_rent: leaseItemData.data.base_rent,
                annual_community_service_charges: leaseItemData.data.annual_community_service_charges,
                annual_building_service_charges: leaseItemData.data.annual_building_service_charges,
                annual_increment_on_service_charges: leaseItemData.data.annual_increment_on_service_charges,
                rent_free_period: leaseItemData.data.rent_free_period,
            }
            this.setState({ pricefeebreakData: pricefeebreakData })
        }
    }

    init() {
        let clientcriteria = {};
        this.props.actions.fetchAll(PROPOSALSELECTABLEPROPOSALS, this.state.get_proposal_list_reqUrl, clientcriteria);

        if (this.props.match.params.lease_id && this.props.match.params.lease_id > 0) {
            const lease_id = this.props.match.params.lease_id;
            this.setState({ lease_id: lease_id });
            const reqUrl = 'lease/getitem';
            this.props.actions.fetchById(LEASEVIEW, reqUrl, lease_id);
        }
    }

    handleProposalChange = selectedProposalOption => {
        let selected_proposal_id = selectedProposalOption.value;
        this.setState({ selected_proposal_id: selected_proposal_id });
        this.get_selected_proposal_data(selected_proposal_id);
    };

    onChangeBaseRent(e) {
        let base_rent = e.target.value;
        var stateCopy = Object.assign({}, this.state.pricefeebreakData);
        stateCopy.base_rent = Object.assign({}, stateCopy.base_rent);
        stateCopy.base_rent = base_rent;
        this.setState({ pricefeebreakData: stateCopy });
    }

    onChangeTotalDesignReviewFee(e) {
        let total_design_review_fee = e.target.value;
        this.setState({ total_design_review_fee_changed_value: total_design_review_fee });
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

    handleRentFreePeriodChange = selectedRentFreePeriodOption => {
        var stateCopy = Object.assign({}, this.state.pricefeebreakData);
        stateCopy.rent_free_period = Object.assign({}, stateCopy.rent_free_period);
        stateCopy.rent_free_period = selectedRentFreePeriodOption.value;
        this.setState({ pricefeebreakData: stateCopy });
        this.setState({ selectedRentFreePeriodOption: selectedRentFreePeriodOption.value });
    };

    handleReinstatementConditionChange = selectedReinstatementConditionOption => {
        var stateCopy = Object.assign({}, this.state.pricefeebreakData);
        stateCopy.selectedReinstatementConditionOption = Object.assign({}, stateCopy.rent_free_period);
        stateCopy.selectedReinstatementConditionOption = selectedReinstatementConditionOption.value;
        this.setState({ pricefeebreakData: stateCopy });
        this.setState({ selectedReinstatementConditionOption: selectedReinstatementConditionOption.value });
    };

    handlePaymentFrequencyChange = selectedPaymentFrequencyOption => {
        this.setState({ selectedPaymentFrequencyOption: selectedPaymentFrequencyOption.value });
    };

    saveProposalAsPending() {
        this.setState({ lease_status: 2 });
    }

    saveProposalAsDraft() {
        this.setState({ lease_status: 1 });
    }

    goBack() {
        history.goBack();
    }

    submitForm(formProps) {
        formProps.rent_free_period = this.state.selectedRentFreePeriodOption;
        formProps.payment_frequency = this.state.selectedPaymentFrequencyOption;
        formProps.reinstatement_condition = this.state.selectedReinstatementConditionOption;
        formProps.lease_status = this.state.lease_status;
        if (this.state.lease_status === 1) {
            if (confirm('This data will be saved as draft.') === false) {
                return;
            }
        }
        let api_url = 'lease/update';
        let backUrl = 'app/lease/view/' + formProps.lease_id;
        this.props.actions.submitReduxFormUpdateProposalLease(LEASEUPDATE, api_url, formProps, formProps.lease_id, backUrl);
    }

    onAttatchmentFileChange = e => {
        // this.setState({
        //     selectedFiles: e.target.files[0]
        // });
        var self = this;
        self.setState({ is_fileuploading: true });
        const lease_id = this.state.lease_id;
        let api_url = 'uploadleaseattatchfile';
        const formData = new FormData();
        formData.append("attachment_file", e.target.files[0]);
        console.log('formData', formData);
        axios({
            url: SERVER_URL + api_url + '/' + lease_id,
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

    render() {
        let unit_total_area = 0;
        const { handleSubmit } = this.props;
        return (
            <Fragment>
                <Form onSubmit={handleSubmit(this.submitForm)}>
                    {/* <Input type="hidden" name="lease_id" value={this.state.selected_lease_id} />
                    <Input type="hidden" name="proposal_id" value={this.state.proposal_id} />
                    <Input type="hidden" name="lease_status" value={this.state.lease_status} /> */}
                    <Row>
                        <Colxx xxs="12">
                            <div className="mb-2">
                                <h1>{this.state.initialValues ? this.state.initialValues.company_name : ""} Edit Proposal</h1>
                                <Separator className="separator mb-5"></Separator>
                                <div className="card mb-5">
                                    <div className="card-body">
                                        <h5 className="card-title">Proposal</h5>
                                        <Row>
                                            {this.state.proposal_list.length > 0 && this.state.selected_proposal_id_index >= 0 ? (
                                                <Colxx className="mb-5 col-12 col-md-6">
                                                    <label>Select Proposal</label>
                                                    <p>Proposal ID : {this.state.selected_proposalitem_label}</p>
                                                    {/* <Select
                                                        // defaultValue={{
                                                        //     label: this.state.proposal_list[this.state.selected_proposal_id_index].label,
                                                        //     value: this.state.proposal_list[this.state.selected_proposal_id_index].value
                                                        // }}
                                                        onChange={this.handleProposalChange}
                                                        options={this.state.proposal_list} /> */}
                                                </Colxx>
                                            ) : (
                                                    <Colxx className="mb-5 col-12 col-md-6">
                                                        <label>Select Proposal</label>
                                                        <Select
                                                            onChange={this.handleProposalChange}
                                                            options={this.props.proposal_list} />
                                                    </Colxx>
                                                )}
                                        </Row>
                                    </div>
                                </div>
                                <div className="card mb-5">
                                    <div className="card-body">
                                        <h5 className="card-title">Units</h5>
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>ID</th>
                                                    <th>Building</th>
                                                    <th>Floor</th>
                                                    <th>Unit Type</th>
                                                    <th>Area</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.leaseItemData && this.state.leaseItemData.proposal_unit_data && this.state.leaseItemData.proposal_unit_data.length > 0 ? this.state.leaseItemData.proposal_unit_data.map((unit_item, index) => {
                                                    unit_total_area = unit_total_area + parseFloat(unit_item.unit_area);
                                                    let unit_type_label = '';
                                                    for (let i = 0; i < this.state.unit_type.length; i++) {
                                                        if (this.state.unit_type[i].value == unit_item.unit_type) {
                                                            unit_type_label = this.state.unit_type[i].label;
                                                        }
                                                    }
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{unit_item.id}</td>
                                                            <td>{unit_item.building}</td>
                                                            <td>{unit_item.floor}</td>
                                                            <td>{unit_type_label}</td>
                                                            <td>{unit_item.unit_area}㎡</td>
                                                        </tr>
                                                    )
                                                }) : ("")}
                                                {this.state.leaseItemData && this.state.leaseItemData.proposal_unit_data && this.state.leaseItemData.proposal_unit_data.length > 0 ? (
                                                    <tr>
                                                        <td colSpan="5" className="text-right">Total : </td>
                                                        <td>{unit_total_area}㎡</td>
                                                    </tr>
                                                ) : ("")}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="card mb-5">
                                    <div className="card-body">
                                        <h5 className="card-title">Dates</h5>
                                        <FormGroup>
                                            <Field type="text" name="effective_date"
                                                component={renderText}
                                                label="Effective Date"
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Field type="text" name="commencement_date"
                                                component={renderText}
                                                label="Commencement Date"
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Field type="number" name="term_years"
                                                component={renderText}
                                                label="Term (years):"
                                            />
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className="card mb-5">
                                    <div className="card-body">
                                        <h5 className="card-title">Car Parks</h5>
                                        <FormGroup>
                                            <Field type="number" name="allocated_car_parks"
                                                component={renderText}
                                                label="Allocated Car Parks"
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Field type="number" name="unallocated_car_parks"
                                                component={renderText}
                                                label="Unallocated Car Parks"
                                            />
                                        </FormGroup>
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
                                            <Field type="number" name="escalation_rate"
                                                component={renderText}
                                                label="Escalation Rate (%):"
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Field type="number" name="security_deposit"
                                                component={renderText}
                                                label="Security Deposit: (SAR)"
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Field type="number" name="total_design_review_fee"
                                                component={renderText}
                                                label="Total Design Review Fee: (SAR)"
                                                onChange={e => this.onChangeTotalDesignReviewFee(e)}
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
                                                    defaultValue={{
                                                        label: this.state.rent_free_period[this.state.selectedRentFreePeriodOption].label,
                                                        value: this.state.rent_free_period[this.state.selectedRentFreePeriodOption].value
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
                                        <FormGroup>
                                            <Field type="number" name="performance_bond_amount"
                                                component={renderText}
                                                label="Performance Bond Amount"
                                            />
                                        </FormGroup>
                                        <Row>
                                            <Colxx className="mt-2 mb-3 col-12">
                                                <label>Reinstatement Condition</label>
                                                <Select
                                                    defaultValue={{
                                                        label: this.state.reinstatement_condition[this.state.selectedReinstatementConditionOption].label,
                                                        value: this.state.reinstatement_condition[this.state.selectedReinstatementConditionOption].value
                                                    }}
                                                    onChange={this.handleReinstatementConditionChange}
                                                    options={this.state.reinstatement_condition} />
                                            </Colxx>
                                        </Row>
                                        <FormGroup>
                                            <Field type="text" name="permitted_useof_premises"
                                                component={renderText}
                                                label="Permitted Use of The Premises"
                                            />
                                        </FormGroup>
                                        {/* <Row>
                                            <Colxx className="mt-2 mb-5 col-12">
                                                <label className="mr-3">Attachment PDF File</label>
                                                <input type="file"
                                                    name="send_file"
                                                    accept="application/pdf"
                                                    onChange={this.onAttatchmentFileChange} />
                                            </Colxx>
                                        </Row> */}
                                    </div>
                                </div>
                                <PriceFeeBreak calcData={this.state.pricefeebreakData} total_design_review_fee={this.state.total_design_review_fee_changed_value}></PriceFeeBreak>

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
                                        {/* <Button type="submit" className="top-right-button btn btn-primary btn-md" onClick={this.saveProposalAsPending}>Save</Button> */}
                                        {/* <Button type="submit" className="top-right-button btn btn-md" onClick={this.saveProposalAsDraft}>Cancel</Button> */}
                                    </Colxx>
                                </Row>
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
    let initialValues = null;
    let selected_proposal_id = -1;
    let selected_proposal_id_index = null;
    let selectedRentFreePeriodOption = 0;
    let selectedPaymentFrequencyOption = 0;
    let selectedReinstatementConditionOption = 0;
    let total_design_review_fee_changed_value = 0;
    let lease_status = 1;
    let lease_id = -1;
    let proposal_list_options = [];
    if (state.clientData.selectable_proposal_list && state.clientData.selectable_proposal_list.data) {
        for (let i = 0; i < state.clientData.selectable_proposal_list.data.length; i++) {
            proposal_list_options.push({
                label: state.clientData.selectable_proposal_list.data[i].label,
                value: state.clientData.selectable_proposal_list.data[i].value,
                proposal_id: state.clientData.selectable_proposal_list.data[i].proposal_id,
            });
        }
    }
    if (state.clientData.leaseview && state.clientData.leaseview.data) {
        initialValues = state.clientData.leaseview.data;
        initialValues.effective_date = convertISOtoDate(initialValues.effective_date, true);
        initialValues.commencement_date = convertISOtoDate(initialValues.commencement_date, true);
        lease_status = initialValues.lease_status;
        lease_id = initialValues.lease_id;
        total_design_review_fee_changed_value = initialValues.total_design_review_fee;

        if (state.clientData.selectable_proposal_list && state.clientData.selectable_proposal_list.data) {
            proposal_list_options.map((proposal_item, index) => {
                if (proposal_item.value === initialValues.proposal_id) {
                    selected_proposal_id = initialValues.proposal_id;
                    selected_proposal_id_index = index;
                }
            })
        }

        rent_free_period.map((item, index) => {
            if (item.value === initialValues.rent_free_period) {
                selectedRentFreePeriodOption = index;
            }
        })
        payment_frequency.map((item, index) => {
            if (item.value === initialValues.payment_frequency) {
                selectedPaymentFrequencyOption = index;
            }
        })

        reinstatement_condition.map((item, index) => {
            if (item.value === initialValues.reinstatement_condition) {
                selectedReinstatementConditionOption = index;
            }
        })
    }

    let retVal = {
        proposal_list: proposal_list_options,
        leaseItemData: state.clientData.leaseview,
        selected_proposal_id: selected_proposal_id,
        selected_proposal_id_index: selected_proposal_id_index,
        selectedRentFreePeriodOption: selectedRentFreePeriodOption,
        selectedPaymentFrequencyOption: selectedPaymentFrequencyOption,
        selectedReinstatementConditionOption: selectedReinstatementConditionOption,
        total_design_review_fee_changed_value: total_design_review_fee_changed_value,
        initialValues: initialValues,
        lease_status: lease_status,
        lease_id: lease_id,
    }
    return retVal;
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

LeaseEdit = reduxForm({
    form: "LeaseCU_Form",
    validate: validateProposalData,
})(LeaseEdit);

export default connect(mapStateToProps, mapDispatchToProps)(LeaseEdit);