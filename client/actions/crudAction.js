import history from '../utils/history';
import { CLIENTNEWITEM, UNITNEWITEM, PROPOSALNEWITEM, LEASENEWITEM, USERNEWITEM } from '../constants/entity';
import { LOGLIST } from '../constants/entity';
/**
 * Import all commonAction as an object.
 */
import * as commonAction from './commonAction';

/**
 * Import all httpService as an object.
 */
import * as httpService from '../services/httpService';


/**
 * CRUD actions for the application.
 * Every time an action that requires the API is called, it first dispatch an "apiRequest" action.
 */

export const fetchAll = (entity, reqUrl, criteria) => {
    return dispatch => {
        return httpService.fetchEntity(reqUrl, criteria).then((response) => {
            dispatch(commonAction.fetch(entity, response.data));
        })
            .catch((error) => {
                dispatch(commonAction.failure(error));
            });
    };
};

export const fetchById = (entity, reqUrl, dataId) => {
    return dispatch => {
        return httpService.fetchEntityById(reqUrl, dataId).then((response) => {
            dispatch(commonAction.selectItem(entity, response.data));
        })
            .catch((error) => {
                dispatch(commonAction.failure(error));
            });
    };
};

export const storeItem = (entity, data) => {
    return dispatch => {
        return httpService.storeEntity(entity, data).then((response) => {
            history.goBack();
        })
            .catch((error) => {
                dispatch(commonAction.failure(error));
            });
    };
};

export const updateItem = (entity, data, id) => {
    return dispatch => {
        return httpService.updateEntity(entity, data, id).then((response) => {
            history.goBack();
        })
            .catch((error) => {
                dispatch(commonAction.failure(error));
            });
    };
};

export const destroyItem = (entity, id, data) => {
    return dispatch => {
        return httpService.destroyEntity(entity, id).then((response) => {
            dispatch(fetchAll(entity, data));
        })
            .catch((error) => {
                dispatch(commonAction.failure(error));
            });
    };
};

export const deleteItem = (entity, api_url, id, dispatchListData) => {
    return dispatch => {
        return httpService.deleteEntity(api_url, id).then((response) => {
            alert(response.data.data.message);
            if (!response.data.error) {
                dispatch(fetchAll(dispatchListData.entity, dispatchListData.reqUrl, dispatchListData.criteria));
            }
        })
            .catch((error) => {
                dispatch(commonAction.failure(error));
            });
    };
};

export const submitForm = (entity, data, id) => {
    return dispatch => {
        if (id) {
            dispatch(updateItem(entity, data, id));
        } else {
            dispatch(storeItem(entity, data));
        }
    };
};

export const submitReduxForm = (entity, api_url, data, id, refreshDispathchData, refreshLoglistCriteria) => {
    return dispatch => {
        if (id) {
            dispatch(updateItemReduxForm(entity, api_url, data, id, refreshDispathchData, refreshLoglistCriteria));
        } else {
            dispatch(storeItemReduxForm(entity, api_url, data));
        }
    };
};

export const submitReduxFormUpdateProposalLease = (entity, api_url, data, id, backUrl) => {
    return dispatch => {
        if (id) {
            return httpService.updateEntity(api_url, data, id).then((response) => {
                if (!response.data.error) {
                    alert(response.data.message);
                    history.goBack();
                }
                else {
                    alert(response.data.message);
                }
            })
                .catch((error) => {
                    dispatch(commonAction.failure(error));
                });
        }
    };
};

export const updateItemReduxForm = (entity, api_url, data, id, refreshDispathchData, refreshLoglistCriteria) => {
    return dispatch => {
        return httpService.updateEntity(api_url, data, id).then((response) => {
            if (!response.data.error) {
                alert(response.data.message);
            }
            dispatch(fetchById(refreshDispathchData.entity, refreshDispathchData.reqUrl, id));
            console.log('refreshLoglistCriteria', refreshLoglistCriteria);
            dispatch(fetchAll(LOGLIST, refreshLoglistCriteria.reqUrl, refreshLoglistCriteria));
        })
            .catch((error) => {
                dispatch(commonAction.failure(error));
            });
    };
};

export const storeItemReduxForm = (entity, api_url, data) => {
    return dispatch => {
        return httpService.storeEntity(api_url, data).then((response) => {
            if (!response.data.error) {
                // alert('Success !');
                alert(response.data.message);
            }
            if (response.data.data) {
                let godetailpage = '/';
                switch (entity) {
                    case CLIENTNEWITEM:
                        if (response.data.data) {
                            godetailpage = '/app/client/view/' + response.data.data.id;
                        }
                        break;
                    case UNITNEWITEM:
                        if (response.data.data) {
                            godetailpage = '/app/unit/view/' + response.data.data.id;
                        }
                        break;
                    case PROPOSALNEWITEM:
                        if (response.data.data) {
                            godetailpage = '/app/proposal/view/' + response.data.data.id;
                        }
                        break;
                    case LEASENEWITEM:
                        if (response.data.data) {
                            godetailpage = '/app/lease/view/' + response.data.data.id;
                        }
                        break;
                    case USERNEWITEM:
                        if (response.data.data) {
                            godetailpage = '/app/admin/view/' + response.data.data.id;
                        }
                        break;
                    default:
                        history.go(0);
                        break;
                }
                history.push(godetailpage);
            }
        })
            .catch((error) => {
                dispatch(commonAction.failure(error));
            });
    };
};

export const storeUserItemReduxForm = (entity, api_url, data) => {
    return dispatch => {
        return httpService.storeEntity(api_url, data).then((response) => {
            if (!response.data.error) {
                alert(response.data.message);
                let godetailpage = '/app/admin/view/' + response.data.data.id;
                history.push(godetailpage);
            }
            else {
                alert(response.data.message);
            }
        })
            .catch((error) => {
                dispatch(commonAction.failure(error));
            });
    };
};

export const updateUserItemReduxForm = (entity, api_url, data, id, refreshDispathchData) => {
    return dispatch => {
        return httpService.updateEntity(api_url, data, id).then((response) => {
            if (!response.data.error) {
                alert(response.data.message);
                dispatch(fetchById(refreshDispathchData.entity, refreshDispathchData.reqUrl, id));
            }
            else {
                alert(response.data.message);
            }
        })
            .catch((error) => {
                dispatch(commonAction.failure(error));
            });
    };
};