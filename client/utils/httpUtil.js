import { httpBase } from './httpBaseUtil';

export const fetch = (endpoint, criteria) => {
    return httpBase()
        .get(endpoint, { params: criteria });
};

export const fetchByID = (endpoint, dataId) => {
    return httpBase()
        .get(endpoint, { params: { id: dataId } });
};

export const store = (endpoint, data) => {
    return httpBase()
        .post(endpoint, data);
};

export const update = (endpoint, data) => {
    return httpBase()
        .put(endpoint, data);
};

export const destroy = (endpoint) => {
    return httpBase()
        .delete(endpoint);
};

export const destroyItem = (endpoint) => {
    return httpBase()
        .delete(endpoint);
};