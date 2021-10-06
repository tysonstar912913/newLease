/**
 * Create clients table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.up = function (knex) {
    return knex.schema.table('users', function (table) {
        
        table.bool('is_allowed').default(false);
        
    }).then();
};

/**
 * Drop clients table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.down = function (knex) {
    return knex.schema.table('users', function (table) {

        table.dropColumn('is_allowed');
        
    }).then();
};