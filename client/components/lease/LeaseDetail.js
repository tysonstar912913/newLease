import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Button, Card, CardTitle, CardBody, CardText } from 'reactstrap';
import { Colxx } from '../../components/common/CustomBootstrap';
import { NavLink } from 'react-router-dom';
import { LEASEVIEW, LEASEUPDATE, LOGLIST } from '../../constants/entity';
import * as crudAction from '../../actions/crudAction';
import { payment_frequency } from '../../constants/defaultValues';
import PriceFeeBreak from './PriceFeeBreak';
import LogContent from '../../components/common/LogContent';
import { isAdminAuthenticated } from '../../utils/jwtUtil';
import { SERVER_URL } from '../../config/config';
import axios from 'axios';

class LeaseDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            leaseItemData: null,
            payment_frequency: payment_frequency,

            pricefeebreakData: {
                base_rent: 0,
                annual_community_service_charges: 0,
                annual_building_service_charges: 0,
                annual_increment_on_service_charges: 0,
                rent_free_period: 0,
            },
            isAdmin: isAdminAuthenticated(),
            isLoading: false
        };
        this.onAttatchmentFileChange = this.onAttatchmentFileChange.bind(this);
    }

    componentDidMount() {
        const reqUrl = 'lease/getitem';
        this.setState({ id: this.props.match.params.id });
        this.props.actions.fetchById(LEASEVIEW, reqUrl, this.props.match.params.id);
        this.getLogList(this.props.match.params.id);
    }

    getLogList(data_id) {
        const reqUrl = 'logs/getloglist';
        const criteria = {
            order_by_column: 'logs.created_at',
            order_by_dir: 'DESC',
            type: 4,
            data_id: data_id
        }
        this.props.actions.fetchAll(LOGLIST, reqUrl, criteria);
    }

    componentWillReceiveProps(newProps) {
        const { leaseItemData } = newProps;
        if (leaseItemData) {
            this.setState({ leaseItemData: leaseItemData.data })
            let pricefeebreakData = {
                base_rent: leaseItemData.data.base_rent,
                annual_community_service_charges: leaseItemData.data.annual_community_service_charges,
                annual_building_service_charges: leaseItemData.data.annual_building_service_charges,
                annual_increment_on_service_charges: leaseItemData.data.annual_increment_on_service_charges,
                rent_free_period: leaseItemData.data.rent_free_period,
            }
            this.setState({ pricefeebreakData: pricefeebreakData });
            this.setState({ isLoading: true });
        }
    }

    SaveAsSign(lease_id, proposal_id) {
        let formProps = {
            lease_status: 3,
            proposal_id: proposal_id
        }
        let api_url = 'lease/updatestatus';
        let backUrl = 'app/lease/view/' + formProps.lease_id;
        this.props.actions.submitReduxFormUpdateProposalLease(LEASEUPDATE, api_url, formProps, lease_id, backUrl);
    }

    SaveAsCancel(lease_id, proposal_id) {
        let formProps = {
            lease_status: 4,
            proposal_id: proposal_id
        }
        let api_url = 'lease/updatestatus';
        let backUrl = 'app/lease/view/' + formProps.lease_id;
        this.props.actions.submitReduxFormUpdateProposalLease(LEASEUPDATE, api_url, formProps, lease_id, backUrl);
    }

    onAttatchmentFileChange = e => {
        var self = this;
        const lease_id = this.state.leaseItemData.lease_id;
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
                if (!response.data.error) {
                    alert(response.data.message);
                    const reqUrl = 'lease/getitem';
                    self.props.actions.fetchById(LEASEVIEW, reqUrl, lease_id);
                }
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
                alert('Error occured');
            });
    }

    render() {
        let payment_frequency = '';
        if (this.state.leaseItemData) {
            for (let i = 0; i < this.state.payment_frequency.length; i++) {
                if (this.state.payment_frequency[i].value === this.state.leaseItemData.payment_frequency) {
                    payment_frequency = this.state.payment_frequency[i].label;
                }
            }
        }

        return !this.state.isLoading ? (
            <div className="loading" />
        ) : (
                <Fragment>
                    {this.state.leaseItemData !== null ? (
                        <Row>
                            <Colxx xxs="12">
                                <div className="mb-2">
                                    <h1>{this.state.leaseItemData.company_name} Lease Detail </h1>
                                    <div className="text-zero top-right-button-container">
                                        {(this.state.leaseItemData.lease_status === 1) && (
                                            <NavLink to={`/app/lease/edit/${this.state.leaseItemData.lease_id}`} className="top-right-button btn btn-primary btn-lg">Edit</NavLink>
                                        )}
                                        {(this.state.leaseItemData.lease_status === 2) && (
                                            <div>
                                                <NavLink to={`/app/lease/edit/${this.state.leaseItemData.lease_id}`} className="top-right-button btn btn-primary btn-lg">Edit</NavLink>
                                                <Button type="submit" className="top-right-button btn btn-primary btn-lg"
                                                    onClick={() => this.SaveAsSign(this.state.leaseItemData.lease_id, this.state.leaseItemData.proposal_id)}>Sign</Button>
                                                <Button type="submit" className="top-right-button btn btn-primary btn-lg"
                                                    onClick={() => this.SaveAsCancel(this.state.leaseItemData.lease_id, this.state.leaseItemData.proposal_id)}>Cancel</Button>
                                            </div>
                                        )}

                                        {(this.state.isAdmin && this.state.leaseItemData.lease_status === 3) && (
                                            <div>
                                                <Button type="submit" className="top-right-button btn btn-primary btn-lg"
                                                    onClick={() => this.SaveAsCancel(this.state.leaseItemData.lease_id, this.state.leaseItemData.proposal_id)}>Cancel</Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="separator mb-5" />
                                <Row>
                                    <Colxx xxs="12">
                                        <div className="card mb-4">
                                            <div className="card-body">
                                                <h5 className="card-title">Client Details</h5>
                                                <p className="card-text"> <strong>Company Name</strong> {this.state.leaseItemData.company_name} </p>
                                            </div>
                                        </div>
                                    </Colxx>
                                </Row>
                                <Row>
                                    <Colxx xxs="12">
                                        <Card>
                                            <CardBody>
                                                <CardTitle tag="h5">Date</CardTitle>
                                                <CardText><p><strong>Effective Date</strong>{" : "}{this.state.leaseItemData.effective_date.substring(0, 10)}</p><p><strong>Commencement Date</strong>{" : "}{this.state.leaseItemData.commencement_date.substring(0, 10)}</p><p><strong>Term</strong>{" : "}{this.state.leaseItemData.term_years} Years</p></CardText>
                                            </CardBody>
                                        </Card>
                                    </Colxx>
                                </Row>
                                <Row>
                                    <Colxx xxs="12">
                                        <div className="card mb-4">
                                            <div className="card-body">
                                                <h5 className="card-title">Terms</h5>
                                                <p className="card-text"> <strong>Base Rent</strong> {this.state.leaseItemData.base_rent} </p>
                                                {/* <p className="card-text"> <strong>Base Rent Modifier</strong> 0 </p> */}
                                                <p className="card-text"> <strong>Free Rent Period (in months)</strong> {this.state.leaseItemData.rent_free_period} Months </p>
                                                <p className="card-text"> <strong>Building Service Charge</strong> {this.state.leaseItemData.annual_building_service_charges} </p>
                                                <p className="card-text"> <strong>Community Service Charge</strong> {this.state.leaseItemData.annual_community_service_charges} </p>
                                                <p className="card-text"> <strong>Service Charge Increment (%)</strong> {this.state.leaseItemData.annual_increment_on_service_charges} </p>
                                                {this.state.leaseItemData.attachment_path !== null && this.state.leaseItemData.is_existattachmentfile ? (
                                                    <p className="card-text">
                                                        <strong>Attatchment File</strong>
                                                        <a href={`/api/lease/downloadattachmentfile?id=${this.state.leaseItemData.lease_id}`} className="btn btn-primary ml-2"><i className="iconsminds-download"></i> Download</a>
                                                    </p>
                                                ) : ("")}
                                                {this.state.leaseItemData.lease_status === 3 ? (
                                                    <Row>
                                                        <Colxx className="mt-2 col-12">
                                                            <label className="mr-3">Attachment PDF File</label>
                                                            <input type="file"
                                                                name="send_file"
                                                                accept="application/pdf"
                                                                onChange={this.onAttatchmentFileChange} />
                                                        </Colxx>
                                                    </Row>
                                                ) : ("")}
                                            </div>
                                        </div>
                                    </Colxx>
                                </Row>
                                <Row>
                                    <Colxx className="col-12 mb-4">
                                        <h2> Units </h2>
                                    </Colxx>
                                </Row>
                                {this.state.leaseItemData.proposal_unit_data && this.state.leaseItemData.proposal_unit_data.length > 0 ? (
                                    this.state.leaseItemData.proposal_unit_data.map((unit_item_data, index) => {
                                        return (
                                            <Row key={index}>
                                                <Colxx xxs="12">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <h5 className="card-title">Unit {unit_item_data.unit_name}</h5>
                                                            <p className="card-text"> <strong>Building</strong> {unit_item_data.building} </p>
                                                            <p className="card-text"> <strong>Floor</strong> {unit_item_data.floor} </p>
                                                            <p className="card-text"> <strong>Area</strong> {unit_item_data.unit_area} </p>
                                                        </div>
                                                    </div>
                                                </Colxx>
                                            </Row>
                                        )
                                    })
                                ) : ('')}

                                <div className="mb-4"></div>

                                <PriceFeeBreak calcData={this.state.pricefeebreakData} total_design_review_fee={this.state.leaseItemData.total_design_review_fee}></PriceFeeBreak>
                                <LogContent loglist={(this.props.loglist && this.props.loglist.success && this.props.loglist.data) ? this.props.loglist.data : null}></LogContent>

                                <div className="mb-4"></div>

                                <Row>
                                    <Colxx xxs="12">
                                        <div className="text-zero">
                                            <a href={`/api/lease/downloaddocx?id=${this.state.leaseItemData.lease_id}`} className="bottom-left-button btn btn-secondary btn-lg">Download Docx</a>
                                        </div>
                                    </Colxx>
                                </Row>
                            </Colxx>
                        </Row>
                    ) : ('')}
                </Fragment>
            );
    }
}

function mapStateToProps(state) {
    return {
        leaseItemData: state.clientData.leaseview,
        loglist: state.clientData.loglist,
    };
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaseDetail);