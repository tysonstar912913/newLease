import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Row } from 'reactstrap';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import {
    Form,
    FormGroup,
    Button,
    Label
} from 'reactstrap';
import DatePicker from 'react-datepicker';

import Select from 'react-select';
import { Input } from '@material-ui/core';
import renderText from '../common/form/renderText';
import * as crudAction from '../../actions/crudAction';
import { PROPOSALSELECTABLEPROPOSALS, PROPOSALVIEW, LEASENEWITEM } from '../../constants/entity';
import { reinstatement_condition, rent_free_period, payment_frequency, unit_type } from '../../constants/defaultValues';
import PriceFeeBreak from './PriceFeeBreak';
import axios from 'axios';
import { SERVER_URL } from '../../config/config';
import history from '../../utils/history';
import { getDecodedTokeData } from '../../utils/jwtUtil';

import "react-datepicker/dist/react-datepicker.css";

class LeaseNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            get_proposal_list_reqUrl: 'lease/getproposallist',
            proposal_list: this.props.proposal_list || [],
            selected_proposal_id: parseInt(this.props.match.params.proposal_id) || -1,
            selected_proposalitem_label: null,
            proposalItemData: this.props.proposalItemData || null,
            rent_free_period: rent_free_period,
            selectedRentFreePeriodOption: 0,
            payment_frequency: payment_frequency,
            selectedPaymentFrequencyOption: 0,
            reinstatement_condition: reinstatement_condition,
            selectedReinstatementConditionOption: 0,
            lease_status: 1,
            pricefeebreakData: {
                base_rent: 0,
                annual_community_service_charges: 0,
                annual_building_service_charges: 0,
                annual_increment_on_service_charges: 0,
                rent_free_period: 0,
                total_design_review_fee: 0,
            },
            total_design_review_fee_changed_value: '',
            unit_type: unit_type,
            effective_date: new Date(),
            commencement_date: new Date(),
            uploaded_attatchment_filename: null,
            loginUser: getDecodedTokeData()
        };

        this.submitForm = this.submitForm.bind(this);
        this.saveProposalAsPending = this.saveProposalAsPending.bind(this);
        this.saveProposalAsDraft = this.saveProposalAsDraft.bind(this);
        this.goBack = this.goBack.bind(this);
        this.init();
    }

    componentDidMount() {

    }

    convertISOtoDate(datetime) {
        const parseTimestamp = Date.parse(datetime);
        const timestamp = new Date(parseTimestamp);
        let month = parseInt(timestamp.getMonth()) + 1;
        let retVal = month + '/' + timestamp.getDate() + '/' + timestamp.getFullYear();

        return retVal;
    }

    componentWillReceiveProps(newProps) {
        if (newProps.proposal_list && newProps.proposal_list.data) {
            this.setState({
                proposal_list: newProps.proposal_list
            });
        }
        const { proposalItemData } = newProps;
        if (proposalItemData) {
            this.setState({ initialValues: proposalItemData.data });
            this.setState({ proposalItemData: proposalItemData.data });
            this.setState({ selectedRentFreePeriodOption: proposalItemData.data.rent_free_period });
            this.setState({ selectedPaymentFrequencyOption: proposalItemData.data.payment_frequency });

            let label = proposalItemData.data.proposal_id + ' - ' + proposalItemData.data.company_name + ' - ' + this.convertISOtoDate(proposalItemData.data.proposal_updated_at);
            this.setState({ selected_proposalitem_label: label });

            let pricefeebreakData = {
                base_rent: proposalItemData.data.base_rent,
                annual_community_service_charges: proposalItemData.data.annual_community_service_charges,
                annual_building_service_charges: proposalItemData.data.annual_building_service_charges,
                annual_increment_on_service_charges: proposalItemData.data.annual_increment_on_service_charges,
                rent_free_period: proposalItemData.data.rent_free_period,
            };
            this.setState({ pricefeebreakData: pricefeebreakData });
        }
    }

    init() {
        let clientcriteria = {};
        this.props.actions.fetchAll(PROPOSALSELECTABLEPROPOSALS, this.state.get_proposal_list_reqUrl, clientcriteria);
        if (this.state.selected_proposal_id > 0) {
            this.get_selected_proposal_data(this.state.selected_proposal_id);
        }
    }

    handleProposalChange = selectedProposalOption => {
        let selected_proposal_id = selectedProposalOption.value;
        this.setState({ selected_proposal_id: selected_proposal_id });
        this.get_selected_proposal_data(selected_proposal_id);
    };

    get_selected_proposal_data(proposal_id) {
        const reqUrl = 'proposal/getitem';
        this.props.actions.fetchById(PROPOSALVIEW, reqUrl, proposal_id);
    }

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
        formProps.create_lease_user_id = this.state.loginUser.id;
        formProps.rent_free_period = this.state.selectedRentFreePeriodOption;
        formProps.payment_frequency = this.state.selectedPaymentFrequencyOption;
        formProps.lease_status = this.state.lease_status;
        formProps.reinstatement_condition = this.state.selectedReinstatementConditionOption;
        if (this.state.lease_status === 1) {
            if (confirm('This data will be saved as draft.') === false) {
                return;
            }
        }
        formProps.effective_date = this.state.effective_date.toISOString().slice(0, 19).replace('T', ' ');
        formProps.commencement_date = this.state.commencement_date.toISOString().slice(0, 19).replace('T', ' ');
        formProps.attachment_path = this.state.uploaded_attatchment_filename;
        let api_url = 'lease/newitem';
        this.props.actions.submitReduxForm(LEASENEWITEM, api_url, formProps);
    }

    handleChange = date => {
        this.setState({
            effective_date: date
        });
    };

    onAttatchmentFileChange = e => {
        let api_url = 'uploadnewleaseattatchfile';
        const formData = new FormData();
        formData.append("attachment_file", e.target.files[0]);
        console.log('formData', formData);
        var self = this;
        axios({
            url: SERVER_URL + api_url,
            method: "POST",
            data: formData
        })
            .then(function (response) {
                console.log(response);
                if (!response.data.error) {
                    // alert(response.data.message);
                    self.setState({ uploaded_attatchment_filename: response.data.uploaded_filename })
                }
            })
            .catch(function (error) {
                console.log(error);
                alert('Error occured');
            });
    }

    render() {
        let unit_total_area = 0;
        const { handleSubmit } = this.props;

        return (
            <Fragment>
                <Form onSubmit={handleSubmit(this.submitForm)}>
                    <Input type="hidden" name="client_id" value={this.state.selected_client_id} />
                    <Input type="hidden" name="proposal_status" value={this.state.proposal_status} />
                    <Row>
                        <Colxx xxs="12">
                            <div className="mb-2">
                                <h1>New Lease</h1>
                                <Separator className="separator mb-5"></Separator>
                                <div className="card mb-5">
                                    <div className="card-body">
                                        <h5 className="card-title">Proposal</h5>
                                        <Row>
                                            {(this.props.match.params.proposal_id &&
                                                this.props.match.params.proposal_id > 0) && (
                                                    <Colxx className="mb-5 col-12 col-md-6">
                                                        <p>Proposal ID: {this.state.selected_proposalitem_label}</p>
                                                    </Colxx>
                                                )}

                                            {(!this.props.match.params.proposal_id &&
                                                this.props.proposal_list.length > 0) && (
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
                                {(this.state.selected_proposal_id > 0) && (
                                    <div>
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
                                                        {this.state.proposalItemData && this.state.proposalItemData.proposal_unit_data && this.state.proposalItemData.proposal_unit_data.length > 0 ? this.state.proposalItemData.proposal_unit_data.map((unit_item, index) => {
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
                                                                    {/* <td>{this.state.unit_type[unit_item.unit_type]}</td> */}
                                                                    <td>{unit_type_label}</td>
                                                                    <td>{unit_item.unit_area}㎡</td>
                                                                </tr>
                                                            );
                                                        }) : ('')}
                                                        {this.state.proposalItemData && this.state.proposalItemData.proposal_unit_data && this.state.proposalItemData.proposal_unit_data.length > 0 ? (
                                                            <tr>
                                                                <td colSpan="5" className="text-right">Total : </td>
                                                                <td>{unit_total_area}㎡</td>
                                                            </tr>
                                                        ) : ('')}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="card mb-5">
                                            <div className="card-body">
                                                <h5 className="card-title">Dates</h5>
                                                <FormGroup>
                                                    <Label for="">Effective Date</Label>
                                                    <DatePicker
                                                        name="effective_date"
                                                        dateFormat="yyyy-MM-dd"
                                                        selected={this.state.effective_date}
                                                        onChange={(date) => this.setState({ effective_date: date })} />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="">Commencement Date</Label>
                                                    <DatePicker
                                                        name="commencement_date"
                                                        dateFormat="yyyy-MM-dd"
                                                        selected={this.state.commencement_date}
                                                        onChange={(date) => this.setState({ commencement_date: date })} />
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
                                                    <Field type="number" name="escalation_rate"
                                                        component={renderText}
                                                        label="Escalation Rate (%):"
                                                    />
                                                    <Field type="number" name="security_deposit"
                                                        component={renderText}
                                                        label="Security Deposit: (SAR)"
                                                    />
                                                    <Field type="number" name="total_design_review_fee"
                                                        component={renderText}
                                                        label="Total Design Review Fee: (SAR)"
                                                        onChange={e => this.onChangeTotalDesignReviewFee(e)}
                                                    />
                                                    <Field type="number" name="annual_community_service_charges"
                                                        component={renderText}
                                                        label="Annual Community Service Charges: (SAR)"
                                                        onChange={e => this.onChangeCSC(e)}
                                                    />
                                                    <Field type="number" name="annual_building_service_charges"
                                                        component={renderText}
                                                        label="Annual Building Service Charges (SAR):"
                                                        onChange={e => this.onChangeBSC(e)}
                                                    />
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
                                                            // defaultValue={{
                                                            //     label: this.state.rent_free_period[this.state.selectedRentFreePeriodOption].label,
                                                            //     value: this.state.rent_free_period[this.state.selectedRentFreePeriodOption].value
                                                            // }}
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

                                        <PriceFeeBreak calcData={this.state.pricefeebreakData} total_design_review_fee={this.state.total_design_review_fee_changed_value} ></PriceFeeBreak>
                                        <Row>
                                            <Colxx className="mb-5 col-12 col-md-12 text-center">
                                                <Button type="submit" className="top-right-button btn btn-primary btn-md" onClick={this.saveProposalAsPending}>Save As Pending</Button>
                                                <Button type="submit" className="top-right-button btn btn-primary btn-md ml-2" onClick={this.saveProposalAsDraft}>Save As Draft</Button>
                                                {/* <Button type="submit" className="top-right-button btn btn-md" onClick={this.saveProposalAsDraft}>Cancel</Button> */}
                                                <Button type="button" className="top-right-button btn btn-md ml-2"
                                                    onClick={this.goBack}
                                                    disabled={this.state.is_fileuploading}>Back</Button>
                                            </Colxx>
                                        </Row>
                                    </div>
                                )}
                            </div>
                        </Colxx>
                    </Row>
                </Form>
            </Fragment>
        );
    }
}

function validatedate(inputText) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!inputText.match(regEx)) { return false; }  // Invalid format
    var d = new Date(inputText);
    var dNum = d.getTime();
    if (!dNum && dNum !== 0) { return false; } // NaN value, Invalid date

    return d.toISOString().slice(0, 10) === inputText;
}

const validateLeaseData = values => {
    const errors = {};
    const requiredFields = [
        // 'effective_date',
        // 'commencement_date',
        // 'term_years',
        // 'base_rent',
        // 'annual_community_service_charges',
        // 'annual_building_service_charges',
        // 'annual_increment_on_service_charges'
    ];
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = '(The ' + field + ' field is required.)';
        }
    });
    const dateFields = [
        'effective_date',
        'commencement_date',
    ];
    dateFields.forEach(field => {
        if (!validatedate(String(values[field]))) {
            errors[field] = '(The ' + field + ' field is date value. ex : 2019-08-25)';
        }
    });

    return errors;
};

function mapStateToProps(state) {
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
    let retVal = {
        proposal_list: proposal_list_options,
        proposalItemData: state.clientData.proposalview,
    };
    if (state.clientData.proposalview && state.clientData.proposalview.data) {
        retVal.initialValues = state.clientData.proposalview.data;
    }

    return retVal;
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

LeaseNew = reduxForm({
    form: 'LeaseCU_Form',
    validate: validateLeaseData,
    enableReinitialize: true,
})(LeaseNew);

export default connect(mapStateToProps, mapDispatchToProps)(LeaseNew);