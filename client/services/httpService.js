// Import custom utils
import { fetch, fetchByID, store, update, destroy, destroyItem } from '../utils/httpUtil';
import { getPathParam } from '../utils/serializeUtil';

export const fetchEntity = (entityName, criteria) => {
    return fetch(entityName.toLowerCase(), criteria);
};

export const fetchEntityById = (entityName, dataId) => {
    return fetchByID(entityName.toLowerCase(), dataId);
};

export const storeEntity = (entityName, data) => {
    return store(entityName.toLowerCase(), data);
};

export const updateEntity = (entityName, data, dataId) => {
    return update(getPathParam(entityName.toLowerCase(), dataId), data);
};

export const destroyEntity = (entityName, dataId) => {
    return destroy(getPathParam(entityName.toLowerCase(), dataId));
};

export const deleteEntity = (api_url, dataId) => {
    return destroyItem(getPathParam(api_url.toLowerCase(), dataId));
};
