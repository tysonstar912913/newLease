import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import GradientWithRadialProgressCard from '../../components/common/cards/GradientWithRadialProgressCard';
import * as crudAction from '../../actions/crudAction';
import { DASHBOARDPROGRESSDATA, DASHBOARDLEASESDATA, DASHBOARDPROPOSALSDATA, DASHBOARDUNITSDATA, LOGDASHBOARDLIST } from '../../constants/entity';
import LogDashboardContent from "../../components/common/LogDashboardContent";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            get_list_api_url: 'dashboard/getdashboarddata',
            get_dashboardproposalsdata_api_url: 'dashboard/getdashboardproposalsdata',
            get_dashboardleasesdata_api_url: 'dashboard/getdashboardleasesdata',
            get_dashboardunitdata_api_url: 'dashboard/getdashboardunitdata',
            dashboardprogressdata: null,
            dashboardproposalsdata: null,
            dashboardleasesdata: null,
            dashboardunitsdata: null,
            isLoading: false
        };
        const reqUrl = this.state.get_list_api_url;
        const criteria = {};
        this.props.actions.fetchAll(DASHBOARDPROGRESSDATA, reqUrl, criteria);
        this.props.actions.fetchAll(DASHBOARDPROPOSALSDATA, this.state.get_dashboardproposalsdata_api_url, criteria);
        this.props.actions.fetchAll(DASHBOARDLEASESDATA, this.state.get_dashboardleasesdata_api_url, criteria);
        this.props.actions.fetchAll(DASHBOARDUNITSDATA, this.state.get_dashboardunitdata_api_url, criteria);
    }

    componentDidMount() {
        // this.getLogList();
    }

    getLogList() {
        const reqUrl = 'logs/getdashboardlist';
        const criteria = {
            order_by_column: 'logs.created_at',
            order_by_dir: 'DESC',
        }
        this.props.actions.fetchAll(LOGDASHBOARDLIST, reqUrl, criteria);
    }

    componentWillReceiveProps(newProps) {
        if (newProps) {
            const { dashboardprogressdata, dashboardproposalsdata, dashboardleasesdata, dashboardunitsdata } = newProps;
            if (dashboardprogressdata) {
                this.setState({ dashboardprogressdata: dashboardprogressdata.data });
                this.setState({ isLoading: true });
            }
            if (dashboardproposalsdata) {
                this.setState({ dashboardproposalsdata: dashboardproposalsdata.data });
                this.setState({ isLoading: true });
            }
            if (dashboardleasesdata) {
                this.setState({ dashboardleasesdata: dashboardleasesdata.data });
                this.setState({ isLoading: true });
            }
            if (dashboardunitsdata) {
                this.setState({ dashboardunitsdata: dashboardunitsdata.data });
                this.setState({ isLoading: true });
            }

        }
    }

    render() {
        let client_count = 0;
        let prospect_count = 0;
        let client_percent = 0;
        let total_proposal_count = 0;
        let signed_lease_count = 0;
        let lease_percent = 0;

        // let total_units_count = 0;
        // let leased_units_count = 0;
        // let unit_percent = 0;
        let available_unit_count = 0;
        let notavailable_unit_count = 0;
        let unit_percent = 0;

        if (this.state.dashboardprogressdata !== null && this.state.dashboardunitsdata !== null) {
            client_count = this.state.dashboardprogressdata.client_count;
            prospect_count = this.state.dashboardprogressdata.prospect_count;
            if ((client_count + prospect_count) != 0) {
                client_percent = Math.round(client_count * 100 / (client_count + prospect_count));
            }
            total_proposal_count = this.state.dashboardprogressdata.total_proposal_count;
            signed_lease_count = this.state.dashboardprogressdata.signed_lease_count;
            if ((signed_lease_count + total_proposal_count) != 0) {
                lease_percent = Math.round(signed_lease_count * 100 / (signed_lease_count + total_proposal_count));
            }
            // total_units_count = this.state.dashboardprogressdata.total_units_count;
            // leased_units_count = this.state.dashboardprogressdata.leased_units_count;
            // if ((leased_units_count + total_units_count) != 0) {
            //     unit_percent = Math.round(leased_units_count * 100 / (leased_units_count + total_units_count));
            // }
            
            available_unit_count = this.state.dashboardunitsdata.available_unit_count;
            notavailable_unit_count = this.state.dashboardunitsdata.notavailable_unit_count;
            if ((available_unit_count + notavailable_unit_count) != 0) {
                unit_percent = Math.round(available_unit_count * 100 / (available_unit_count + notavailable_unit_count));
            }
        }

        let signed_proposals_count = 0;
        let pending_proposals_count = 0;
        let proposal_percent = 0;
        if (this.state.dashboardproposalsdata != null) {
            signed_proposals_count = this.state.dashboardproposalsdata.signed_proposals_count;
            pending_proposals_count = this.state.dashboardproposalsdata.pending_proposals_count;
            if ((signed_proposals_count + pending_proposals_count) != 0) {
                proposal_percent = Math.round(signed_proposals_count * 100 / (signed_proposals_count + pending_proposals_count));
            }
        }
        let signed_leases_count = 0;
        let pending_leases_count = 0;
        let signed_pending_lease_percent = 0;
        if (this.state.dashboardleasesdata != null) {
            signed_leases_count = this.state.dashboardleasesdata.signed_leases_count;
            pending_leases_count = this.state.dashboardleasesdata.pending_leases_count;
            if ((signed_leases_count + pending_leases_count) != 0) {
                signed_pending_lease_percent = Math.round(signed_leases_count * 100 / (signed_leases_count + pending_leases_count));
            }
        }
        return !this.state.isLoading ? (
            <div className="loading" />
        ) : (
                <Fragment>
                    <Row>
                        <Colxx xxs="12">
                            <h1>Dashboard </h1>
                            <div className="separator mb-5"></div>
                        </Colxx>
                    </Row>
                    <Row>
                        <Colxx lg="12" xl="4" >
                            <GradientWithRadialProgressCard
                                icon="iconsminds-conference"
                                title={`${client_count} Clients`}
                                detail={`${prospect_count} prospects`}
                                percent={client_percent}
                                progressText={`${client_percent} %`}
                            ></GradientWithRadialProgressCard>
                        </Colxx>
                        <Colxx lg="12" xl="4" >
                            {/* <GradientWithRadialProgressCard
                                icon="iconsminds-office"
                                title={`${leased_units_count} leased Units`}
                                detail={`${total_units_count} total`}
                                percent={unit_percent}
                                // progressText={`${leased_units_count} / ${total_units_count}`}
                                progressText={`${unit_percent} %`}
                            ></GradientWithRadialProgressCard> */}
                            <GradientWithRadialProgressCard
                                icon="iconsminds-office"
                                title={`${available_unit_count} Available Units`}
                                detail={`${notavailable_unit_count} Not Available`}
                                percent={unit_percent}
                                progressText={`${unit_percent} %`}
                            ></GradientWithRadialProgressCard>
                        </Colxx>
                        <Colxx lg="12" xl="4" >
                            <GradientWithRadialProgressCard
                                icon="iconsminds-handshake"
                                title={`${signed_lease_count} Leases`}
                                detail={`${total_proposal_count} proposals`}
                                percent={lease_percent}
                                progressText={`${signed_lease_count} / ${total_proposal_count}`}
                            ></GradientWithRadialProgressCard>
                        </Colxx>
                        <Colxx lg="12" xl="4" className="mt-2" >
                            <GradientWithRadialProgressCard
                                icon="iconsminds-file-edit"
                                title={`${signed_proposals_count} Signed Proposals`}
                                detail={`${pending_proposals_count} Pending Proposals`}
                                percent={proposal_percent}
                                progressText={`${proposal_percent} %`}
                            ></GradientWithRadialProgressCard>
                        </Colxx>
                        <Colxx lg="12" xl="4" className="mt-2" >
                            <GradientWithRadialProgressCard
                                icon="iconsminds-handshake"
                                title={`${signed_leases_count} Signed Leases`}
                                detail={`${pending_leases_count} Pending Leases`}
                                percent={signed_pending_lease_percent}
                                progressText={`${signed_pending_lease_percent} %`}
                            ></GradientWithRadialProgressCard>
                        </Colxx>
                    </Row>
                    <Separator className="mt-5 mb-5"></Separator>
                    {/* <LogDashboardContent loglist={(this.props.logdashboardlist && this.props.logdashboardlist.success && this.props.logdashboardlist.data) ? this.props.logdashboardlist.data : null}></LogDashboardContent> */}
                    <LogDashboardContent></LogDashboardContent>
                </Fragment>
            )
    }
}

function mapStateToProps(state) {
    return {
        dashboardprogressdata: state.clientData.dashboardprogressdata,
        dashboardproposalsdata: state.clientData.dashboardproposalsdata,
        dashboardleasesdata: state.clientData.dashboardleasesdata,
        dashboardunitsdata: state.clientData.dashboardunitsdata,
        // logdashboardlist: state.clientData.logdashboardlist,
    };
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Object.assign({}, crudAction), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);