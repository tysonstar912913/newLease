/**
 * Create clients table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.up = function (knex) {
    return knex.schema.table('lease', function (table) {
        
        table.integer('create_lease_user_id').unsigned().notNullable();;
        
    }).then();
};

/**
 * Drop clients table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.down = function (knex) {
    return knex.schema.table('lease', function (table) {

        table.dropColumn('create_lease_user_id');
        
    }).then();
};