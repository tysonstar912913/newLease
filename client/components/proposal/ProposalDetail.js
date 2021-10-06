import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import { Colxx } from '../../components/common/CustomBootstrap';
import { Button, Card, CardTitle, CardBody } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { PROPOSALUPDATE, PROPOSALVIEW, LOGLIST } from '../../constants/entity';
import * as crudAction from '../../actions/crudAction';
import { payment_frequency, proposal_types } from '../../constants/defaultValues';
import PriceFeeBreak from './PriceFeeBreak';
import LogContent from '../../components/common/LogContent';
import { isAdminAuthenticated } from '../../utils/jwtUtil';
import { SERVER_URL } from '../../config/config';

class ProposalDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            proposalItemData: null,
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

    }

    componentDidMount() {
        const reqUrl = 'proposal/getitem';
        this.setState({ id: this.props.match.params.id });
        this.props.actions.fetchById(PROPOSALVIEW, reqUrl, this.props.match.params.id);
        this.getLogList(this.props.match.params.id);
    }

    getLogList(data_id) {
        const reqUrl = 'logs/getloglist';
        const criteria = {
            order_by_column: 'logs.created_at',
            order_by_dir: 'DESC',
            type: 3,
            data_id: data_id
        }
        this.props.actions.fetchAll(LOGLIST, reqUrl, criteria);
    }

    componentWillReceiveProps(newProps) {
        const { proposalItemData } = newProps;
        if (proposalItemData) {
            this.setState({ proposalItemData: proposalItemData.data })
            let pricefeebreakData = {
                base_rent: proposalItemData.data.base_rent,
                annual_community_service_charges: proposalItemData.data.annual_community_service_charges,
                annual_building_service_charges: proposalItemData.data.annual_building_service_charges,
                annual_increment_on_service_charges: proposalItemData.data.annual_increment_on_service_charges,
                rent_free_period: proposalItemData.data.rent_free_period,
            }
            this.setState({ pricefeebreakData: pricefeebreakData })
            this.setState({ isLoading: true });
        }
    }

    SaveAsSign(proposal_id) {
        let formProps = {
            proposal_status: 3,
        }
        let api_url = 'proposal/updatestatus';
        let backUrl = 'app/proposal/view/' + formProps.proposal_id;
        this.props.actions.submitReduxFormUpdateProposalLease(PROPOSALUPDATE, api_url, formProps, proposal_id, backUrl);
    }

    SaveAsCancel(proposal_id) {
        let formProps = {
            proposal_status: 4,
        }
        let api_url = 'proposal/updatestatus';
        let backUrl = 'app/proposal/view/' + formProps.proposal_id;
        this.props.actions.submitReduxFormUpdateProposalLease(PROPOSALUPDATE, api_url, formProps, proposal_id, backUrl);
    }

    render() {
        let payment_frequency = '';
        let edit_page_url = '/';
        if (this.state.proposalItemData) {
            for (let i = 0; i < this.state.payment_frequency.length; i++) {
                if (this.state.payment_frequency[i].value === this.state.proposalItemData.payment_frequency) {
                    payment_frequency = this.state.payment_frequency[i].label;
                }
            }
            if (this.state.proposalItemData.proposal_status === 1) {
                edit_page_url = '/app/proposal/edit/' + this.state.proposalItemData.proposal_id;
            }
        }

        return !this.state.isLoading ? (
            <div className="loading" />
        ) : (
                <Fragment>
                    {this.state.proposalItemData !== null ? (
                        <Row>
                            <Colxx xxs="12">
                                <div className="mb-2">
                                    <h1>{this.state.proposalItemData.company_name} Proposal Detail </h1>
                                    <div className="text-zero top-right-button-container">
                                        {(this.state.proposalItemData.proposal_status === 1) && (
                                            <NavLink to={`/app/proposal/edit/${this.state.proposalItemData.proposal_id}`} className="top-right-button btn btn-primary btn-lg">Edit</NavLink>
                                        )}
                                        {(this.state.proposalItemData.proposal_status === 2) && (
                                            <div>
                                                <NavLink to={`/app/proposal/edit/${this.state.proposalItemData.proposal_id}`} className="top-right-button btn btn-primary btn-lg">Edit</NavLink>
                                                <Button type="submit" className="top-right-button btn btn-primary btn-lg"
                                                    onClick={() => this.SaveAsSign(this.state.proposalItemData.proposal_id)}>Sign</Button>
                                                <Button type="submit" className="top-right-button btn btn-primary btn-lg"
                                                    onClick={() => this.SaveAsCancel(this.state.proposalItemData.proposal_id)}>Cancel</Button>
                                            </div>
                                        )}

                                        {(this.state.isAdmin && this.state.proposalItemData.proposal_status === 3) && (
                                            <div>
                                                <Button type="submit" className="top-right-button btn btn-primary btn-lg"
                                                    onClick={() => this.SaveAsCancel(this.state.proposalItemData.proposal_id)}>Cancel</Button>
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
                                                <p className="card-text"> <strong>Name</strong> {this.state.proposalItemData.company_name} </p>
                                            </div>
                                        </div>
                                    </Colxx>
                                </Row>
                                <Row>
                                    <Colxx xxs="12">
                                        <Card className="mb-4">
                                            <CardBody>
                                                <CardTitle tag="h5">Type : {proposal_types.filter((each_proposal) =>
                                                    (each_proposal.value === this.state.proposalItemData.type)).reduce((acc, each_proposal) => acc + each_proposal.label, '')}
                                                </CardTitle>
                                            </CardBody>
                                        </Card>
                                    </Colxx>
                                </Row>
                                <Row>
                                    <Colxx xxs="12">
                                        <div className="card mb-4">
                                            <div className="card-body">
                                                <h5 className="card-title">Terms</h5>
                                                <p className="card-text"> <strong>Base Rent</strong> {this.state.proposalItemData.base_rent} </p>
                                                <p className="card-text"> <strong>Building Service Charge</strong> {this.state.proposalItemData.annual_building_service_charges} </p>
                                                <p className="card-text"> <strong>Community Service Charge</strong> {this.state.proposalItemData.annual_community_service_charges} </p>
                                                <p className="card-text"> <strong>Service Charge Increment (%)</strong> {this.state.proposalItemData.annual_increment_on_service_charges} </p>
                                                <p className="card-text"> <strong>Free Rent Period (in months)</strong> {this.state.proposalItemData.rent_free_period} Months </p>
                                                <p className="card-text"> <strong>Payment Frequency</strong> {payment_frequency} </p>
                                                <p className="card-text"> <strong>Revenue Sharing</strong> {(this.state.proposalItemData.revenue_sharing === 1) ? 'Yes' : 'No'} </p>
                                                {this.state.proposalItemData.attachment_path !== null && this.state.proposalItemData.is_existattachmentfile ? (
                                                    <p className="card-text">
                                                        <strong>Attatchment File</strong>
                                                        <a href={`/api/proposal/downloadattachmentfile?id=${this.state.proposalItemData.proposal_id}`} className="btn btn-primary ml-2"><i className="iconsminds-download"></i> Download</a>
                                                    </p>
                                                ) : ("")}
                                            </div>
                                        </div>
                                    </Colxx>
                                </Row>
                                {this.state.proposalItemData.proposal_unit_data && this.state.proposalItemData.proposal_unit_data.length > 0 ? (
                                    this.state.proposalItemData.proposal_unit_data.map((unit_item_data, index) => {
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

                                <PriceFeeBreak calcData={this.state.pricefeebreakData}></PriceFeeBreak>
                                <LogContent loglist={(this.props.loglist && this.props.loglist.success && this.props.loglist.data) ? this.props.loglist.data : null}></LogContent>

                                <Row className="mt-5">
                                    <Colxx xxs="8">
                                        <div className="text-zero">
                                            <a href={`/api/proposal/downloaddocx?id=${this.state.proposalItemData.proposal_id}`} className="bottom-left-button btn btn-secondary btn-lg">Download Docx</a>
                                        </div>
                                    </Colxx>
                                    <Colxx xxs="4">
                                        <div className="text-zero top-right-button-container">
                                            {this.state.proposalItemData.proposal_status === 3 ? (
                                                <NavLink to={`/app/lease/new/${this.state.proposalItemData.proposal_id}`} className="bottom-right-button btn btn-primary btn-lg">Generate Lease</NavLink>
                                            ) : ('')}
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
        proposalItemData: state.clientData.proposalview,
        loglist: state.clientData.loglist,
    };
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProposalDetail);