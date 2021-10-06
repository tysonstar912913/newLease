import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";
import AppLocale from '../../lang';
import MainRouter from '../../routers/routes';
import NotificationContainer from '../../components/common/react-notifications/NotificationContainer';

class AppContainer extends Component {

    render() {
        const { locale, loginUser } = this.props;
        const currentAppLocale = AppLocale['en'];

        return (
            <IntlProvider
                locale={currentAppLocale.locale}
                messages={currentAppLocale.messages}>
                <React.Fragment>
                    {/* <NotificationContainer /> */}
                    <MainRouter authUser={loginUser} />
                </React.Fragment>
            </IntlProvider>
        );
    }
}

export default hot(module)(AppContainer);