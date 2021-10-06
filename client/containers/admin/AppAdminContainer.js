import React, { Component } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import AppAdminLayout from '../../components/common/layout/AppAdminLayout';
/***** 404 Page *****/
import NotFound from '../../components/error/NotFound';
/***** Admin *****/
import AuthenticationAdmin from './AuthenticationAdmin';
import Admin from '../../components/admin/Admin';
import UserDetail from '../../components/admin/UserDetail';
/***** Dashboard *****/
import Dashboard from '../../components/dashboard/Dashboard';
/***** Clients *****/
import Clients from '../../components/clients/Clients';
import ClientDetail from '../../components/clients/ClientDetail';
/***** Units *****/
import Units from '../../components/units/Units';
import UnitDetail from '../../components/units/UnitDetail';
/***** Proposal *****/
import Proposal from '../../components/proposal/Proposal';
import ProposalNew from '../../components/proposal/ProposalNew';
import ProposalDetail from '../../components/proposal/ProposalDetail';
import ProposalEdit from '../../components/proposal/ProposalEdit';
/***** Lease *****/
import Lease from '../../components/lease/Lease';
import LeaseNew from '../../components/lease/LeaseNew';
import LeaseDetail from '../../components/lease/LeaseDetail';
import LeaseEdit from '../../components/lease/LeaseEdit';

// import NotificationContainer from '../../components/common/react-notifications/NotificationContainer';

class AppAdminContainer extends Component {
  render() {
    const { match } = this.props;

    return (
      <AppAdminLayout>
        <Switch>
          <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
          <Route path={`${match.url}/dashboard`} component={Dashboard} />
          <Route path={`${match.url}/clients`} component={Clients} />
          <Route path={`${match.url}/client/view/:id`} component={ClientDetail} />
          <Route path={`${match.url}/units`} component={Units} />
          <Route path={`${match.url}/unit/view/:id`} component={UnitDetail} />

          <Route path={`${match.url}/proposal/list`} component={Proposal} />
          <Route path={`${match.url}/proposal/add`} component={ProposalNew} />
          <Route path={`${match.url}/proposal/new/:client_id`} component={ProposalNew} />
          <Route path={`${match.url}/proposal/view/:id`} component={ProposalDetail} />
          <Route path={`${match.url}/proposal/edit/:proposal_id`} component={ProposalEdit} />

          <Route path={`${match.url}/lease/list`} component={Lease} />
          <Route path={`${match.url}/lease/add`} component={LeaseNew} />
          <Route path={`${match.url}/lease/new/:proposal_id`} component={LeaseNew} />
          <Route path={`${match.url}/lease/view/:id`} component={LeaseDetail} />
          <Route path={`${match.url}/lease/edit/:lease_id`} component={LeaseEdit} />

          <AuthenticationAdmin path="/app/admins" component={Admin} />
          <AuthenticationAdmin path="/app/admin/view/:id" component={UserDetail} />
          <Route path="/error" exact component={NotFound} />
          <Redirect to="/error" />
        </Switch>
      </AppAdminLayout>
    );
  }
}

const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(AppAdminContainer)
);