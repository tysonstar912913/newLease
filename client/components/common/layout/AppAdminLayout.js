import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import TopNav from '../../../containers/navs/Topnav';
import Sidebar from '../../../containers/navs/Sidebar';
import { defaultMenuType } from '../../../constants/defaultValues';

// import NotificationContainer from '../../../components/common/react-notifications/NotificationContainer';

class AppAdminLayout extends Component {

  render() {
    const { containerClassnames } = this.props;

    return (
      <div id="app-container" className={containerClassnames}>
        {/* <NotificationContainer /> */}
        <TopNav history={this.props.history} />
        <Sidebar />
        <main>
          <div className="container-fluid">
            {this.props.children}
          </div>
        </main>
      </div>
    );
  }
}
// const mapStateToProps = ({ menu }) => {
//     const { containerClassnames } = menu;    
//     // const containerClassnames = defaultMenuType;
//     return { containerClassnames };
// };
// const mapActionToProps={}

// export default withRouter(connect(
//     mapStateToProps,
//     mapActionToProps
// )(AppAdminLayout));

const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};
const mapActionToProps = {}

export default withRouter(connect(
  mapStateToProps,
  mapActionToProps
)(AppAdminLayout));
