import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';

import store, { history } from './store/configureStore';
import { verifyToken } from './services/tokenService';
import App from './containers/app/AppContainer';

import './assets/css/vendor/bootstrap.min.css';
import './assets/css/vendor/bootstrap.rtl.only.min.css';

const mountNode = document.getElementById('root');
const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: blueGrey
    }
});

// Used to log in if token is valid
store.dispatch(verifyToken());
/*
*/
const color = 'light.purple';

let render = () => {
    import('./assets/css/sass/themes/gogo.' + color + '.scss').then(x => {
        // require('./AppRenderer');
        ReactDOM.render(
            <MuiThemeProvider theme={theme}>
                <Provider store={store}>
                    <ConnectedRouter history={history}>
                        <IntlProvider>
                            <App />
                        </IntlProvider>
                    </ConnectedRouter>
                </Provider>
            </MuiThemeProvider>,
            mountNode
        );
    });
};
render();