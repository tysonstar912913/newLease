import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import {
    Form,
    FormGroup,
    Button,
    CustomInput
} from 'reactstrap';
import Select from 'react-select';
import renderText from '../common/form/renderText';
import * as crudAction from '../../actions/crudAction';
import {
    PROPOSALSELECTABLECLIENTS, PROPOSALSELECTABLEUNITS,
    PROPOSALNEWITEM
} from '../../constants/entity';
import { unit_type, rent_free_period, payment_frequency, proposal_types } from '../../constants/defaultValues';
import { Input } from '@material-ui/core';
import PriceFeeBreak from './PriceFeeBreak';
import axios from 'axios';
import { SERVER_URL } from '../../config/config';
import history from '../../utils/history';
import { getDecodedTokeData } from '../../utils/jwtUtil';

class ProposalNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            get_client_list_reqUrl: 'proposal/getclientlist',
            get_unit_list_reqUrl: 'proposal/getunitlist',
            client_list: this.props.client_list || [],
            selected_client_id: parseInt(this.props.match.params.client_id) || -1,
            selected_client_ceo_label: '',
            selected_client_address_label: '',
            selected_client_id_index: null,
            selected_type: null,
            selected_unit_type: null,
            unit_list: this.props.client_list || [],
            selected_unit_id: null,
            selected_unit_arr: [],
            rent_free_period: rent_free_period,
            selectedRentFreePeriodOption: 0,
            payment_frequency: payment_frequency,
            selectedPaymentFrequencyOption: 0,
            proposal_status: 1,
            pricefeebreakData: {
                base_rent: 0,
                annual_community_service_charges: 0,
                annual_building_service_charges: 0,
                annual_increment_on_service_charges: 0,
                rent_free_period: 0,
            },
            revenue_sharing: 1,
            uploaded_attatchment_filename: null,
            // isSaved: false,
            // shouldBlockNavigation: false,
            loginUser: getDecodedTokeData()
        };
        
        this.submitForm = this.submitForm.bind(this);
        this.onClickAddUnit = this.onClickAddUnit.bind(this);
        this.saveProposalAsPending = this.saveProposalAsPending.bind(this);
        this.saveProposalAsDraft = this.saveProposalAsDraft.bind(this);
        this.goBack = this.goBack.bind(this);
        // this.onClickRemoveUnit = this.onClickRemoveUnit.bind(this);
        
        if (this.props.match.params.client_id) {
            this.setState({ selected_client_id: this.props.match.params.client_id });
        }
        this.init();
    }

    componentDidMount() {

    }

    componentWillReceiveProps(newProps) {
        if (newProps.client_list && newProps.client_list.data) {
            this.setState({
                unit_list: newProps.client_list
            })
        }
        if (newProps.unit_list && newProps.unit_list.data) {
            this.setState({
                unit_list: newProps.unit_list
            })
        }
    }

    init() {
        let clientcriteria = {};
        this.props.actions.fetchAll(PROPOSALSELECTABLECLIENTS, this.state.get_client_list_reqUrl, clientcriteria);
        let unitcriteria = {};
        this.props.actions.fetchAll(PROPOSALSELECTABLEUNITS, this.state.get_unit_list_reqUrl, unitcriteria);
    }

    handleClientChange = selectedClientOption => {
        let selected_client_id = selectedClientOption.value;
        this.props.client_list.map((client_item) => {
            if (client_item.value === selected_client_id) {
                this.setState({ selected_client_ceo_label: client_item.company_name_ar });
                this.setState({ selected_client_address_label: client_item.address });
            }
        })
        this.setState({ selected_client_id: selected_client_id });
    };

    handleProposalTypeChange = selectedTypeOption => {
        this.setState({ selected_type: selectedTypeOption.value });
    }

    handleUnitTypeChange = selectedTypeOption => {
        this.setState({ selected_unit_type: selectedTypeOption.value });
        let unitcriteria = {
            unit_type: selectedTypeOption.value
        };
        this.props.actions.fetchAll(PROPOSALSELECTABLEUNITS, this.state.get_unit_list_reqUrl, unitcriteria);
    }

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

    handlePaymentFrequencyChange = selectedPaymentFrequencyOption => {
        this.setState({ selectedPaymentFrequencyOption: selectedPaymentFrequencyOption.value });
    };

    onClickAddUnit() {
        if (this.state.selected_unit_id !== null && this.state.selected_unit_id > 0) {
            this.props.unit_list.map((unit_item, index) => {
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
        formProps.create_user_id = this.state.loginUser.id;
        formProps.client_id = this.state.selected_client_id;
        formProps.rent_free_period = this.state.selectedRentFreePeriodOption;
        formProps.payment_frequency = this.state.selectedPaymentFrequencyOption;
        let selected_unit_id_arr = [];
        // if (this.state.selected_unit_arr.length === 0) {
        //     alert('Add Unit');
        //     return;
        // }
        this.state.selected_unit_arr.map((selected_index) => {
            selected_unit_id_arr.push(this.props.unit_list[selected_index].value);
        })
        formProps.unit_ids = selected_unit_id_arr.join(',');
        formProps.proposal_status = this.state.proposal_status;
        formProps.type = this.state.selected_type;
        formProps.unit_type = this.state.selected_unit_type;
        formProps.revenue_sharing = this.state.revenue_sharing;
        formProps.attachment_path = this.state.uploaded_attatchment_filename;

        if (this.state.proposal_status === 1) {
            if (confirm('This data will be saved as draft.') === false) {
                return;
            }
        }
        let api_url = 'proposal/newitem';
        this.props.actions.submitReduxForm(PROPOSALNEWITEM, api_url, formProps);
    }

    onAttatchmentFileChange = e => {
        let api_url = 'uploadnewproposalattatchfile';
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
        if (this.props.selectable_client_list) {
            this.modifyClientList(this.props.selectable_client_list);
        }
        if (this.props.selectable_unit_list) {
            this.modifyUnitList(this.props.selectable_unit_list);
        }
        let selected_client_id_index = this.state.selected_client_id_index > 0 ? this.state.selected_client_id_index : -1;
        if (this.props.match.params.client_id && this.props.client_list) {
            this.props.client_list.map((client_item, index) => {
                if ((client_item.value === this.state.selected_client_id)
                    && (this.state.selected_client_ceo_label == '' || this.state.selected_client_address_label == '')) {
                    this.setState({ selected_client_ceo_label: client_item.company_name_ar });
                    this.setState({ selected_client_address_label: client_item.address });
                    this.setState({ selected_client_id_index: index });
                    selected_client_id_index = index;
                }
            })
        }
        const { handleSubmit } = this.props;

        return (
            <Fragment>
                {/* <Prompt when={this.state.shouldBlockNavigation} message='You have unsaved changes, are you sure you want to leave?'>
                </Prompt> */}
                <Form onSubmit={handleSubmit(this.submitForm)}>
                    <Input type="hidden" name="client_id" value={this.state.selected_client_id} />
                    <Input type="hidden" name="proposal_status" value={this.state.proposal_status} />
                    <Row>
                        <Colxx xxs="12">
                            <div className="mb-2">
                                <h1>New Proposal</h1>
                                <Separator className="separator mb-5"></Separator>
                                <Row>
                                    <Col md="6">
                                        <Card>
                                            <CardBody>
                                                <CardTitle tag="h5">Client</CardTitle>
                                                <Row>
                                                    {(this.props.match.params.client_id &&
                                                        this.props.match.params.client_id > 0 &&
                                                        this.props.client_list.length > 0 &&
                                                        selected_client_id_index > 0) && (
                                                            <Col md={6}>
                                                                <p>Client: {this.props.client_list[selected_client_id_index].label}</p>
                                                            </Col>
                                                        )}

                                                    {(!this.props.match.params.client_id &&
                                                        this.props.client_list.length > 0) && (
                                                            <Col md={6}>
                                                                <label>Select Client</label>
                                                                <Select
                                                                    onChange={this.handleClientChange}
                                                                    options={this.props.client_list} />
                                                            </Col>
                                                        )}
                                                    {this.state.selected_client_id > 0 && (
                                                        <Col md={6}>
                                                            <p>CEO: {this.state.selected_client_ceo_label}</p>
                                                            <p>Address: {this.state.selected_client_address_label}</p>
                                                        </Col>
                                                    )}
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                                <Separator className="separator mb-5 mt-5"></Separator>
                                <Row>
                                    <Col md="6">
                                        <Card>
                                            <CardBody>
                                                <CardTitle tag="h5">Proposal Type</CardTitle>
                                                <Row>
                                                    <Col md={6}>
                                                        <label>Select Proposal Type</label>
                                                        <Select
                                                            onChange={this.handleProposalTypeChange}
                                                            options={proposal_types} />
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
                                                        <Select
                                                            onChange={this.handleUnitTypeChange}
                                                            options={unit_type} />
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                                <Separator className="separator mb-5 mt-5"></Separator>
                                {(this.state.selected_client_id > 0 && this.state.selected_type !== null) && (
                                    <div>
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
                                                        {this.state.selected_unit_arr.length === 0 ? ('') : this.state.selected_unit_arr.map((added_unit_item_index, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{this.props.unit_list[added_unit_item_index].value}</td>
                                                                    <td>{this.props.unit_list[added_unit_item_index].building}</td>
                                                                    <td>{this.props.unit_list[added_unit_item_index].floor}</td>
                                                                    <td>{this.props.unit_list[added_unit_item_index].unit_type}</td>
                                                                    <td>{this.props.unit_list[added_unit_item_index].unit_area}</td>
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
                                                    <Row>
                                                        <Col md={6}>
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
                                                        </Col>
                                                        <Col md={6}>
                                                            <label>Payment Frequency</label>
                                                            <Select
                                                                defaultValue={{
                                                                    label: this.state.payment_frequency[this.state.selectedPaymentFrequencyOption].label,
                                                                    value: this.state.payment_frequency[this.state.selectedPaymentFrequencyOption].value
                                                                }}
                                                                onChange={this.handlePaymentFrequencyChange}
                                                                options={this.state.payment_frequency} />
                                                        </Col>
                                                        <Colxx xxs="12">
                                                            <CustomInput
                                                                type="checkbox"
                                                                id="chkRevenueSharing"
                                                                label="Revenue Sharing"
                                                                checked={this.state.revenue_sharing === 1}
                                                                onChange={e => this.setState({ revenue_sharing: e.target.checked ? 1 : 0 })}
                                                            />
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
                                                </FormGroup>
                                            </div>
                                        </div>

                                        <PriceFeeBreak calcData={this.state.pricefeebreakData}></PriceFeeBreak>

                                        <Row>
                                            <Colxx className="mb-5 col-12 col-md-12 text-center">
                                                <Button type="submit" className="top-right-button btn btn-primary btn-md" onClick={this.saveProposalAsPending}>Save As Pending</Button>
                                                <Button type="submit" className="top-right-button btn btn-primary btn-md ml-2" onClick={this.saveProposalAsDraft}>Save As Draft</Button>
                                                {/* <Button type="submit" className="top-right-button btn btn-md ml-2" onClick={this.saveProposalAsDraft}>Cancel</Button> */}
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

const validateProposalData = values => {
    const errors = {};
    const requiredFields = [
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
    return {
        client_list: client_list_options,
        unit_list: unit_list_options,
    };
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

ProposalNew = reduxForm({
    form: 'ProposalCU_Form',
    validate: validateProposalData,
})(ProposalNew);

export default connect(mapStateToProps, mapDispatchToProps)(ProposalNew);