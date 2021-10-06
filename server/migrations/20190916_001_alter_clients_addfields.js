/**
 * Create clients table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.up = function (knex) {
    return knex.schema.table('clients', function (table) {

        table.bool('is_active').default(false);
        
    }).then();
};

/**
 * Drop clients table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.down = function (knex) {
    return knex.schema.table('clients', function (table) {

        table.dropColumn('revenue_sharing');
        
    }).then();
};