import jwtDecode from 'jwt-decode';
import { getLocalStorage, clearLocalStorage } from './storageUtil';

export let cleanLocalStorage = () => {
    return clearLocalStorage('token');
};

export let isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000) { // Checking if token is expired.
            return true;
        }

        return false;
    } catch (e) {
        return false;
    }
};

export let getToken = () => {
    return getLocalStorage('token');
};

export let isAuthenticated = () => {
    return !!getToken() && !isTokenExpired(getToken());
};

export let getDecodedTokeData = () => {
    let token = getLocalStorage('token');
    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (e) {
        return false;
    }
};

export let isAdminAuthenticated = () => {
    try {
        let token = getToken();
        const decoded = jwtDecode(token);
        if (decoded.status === 1 || decoded.status === true) {
            return true;
        }
        else {
            return false;
        }
    } catch (e) {
        return false;
    }
};