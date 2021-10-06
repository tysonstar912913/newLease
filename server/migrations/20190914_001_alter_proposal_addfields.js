/**
 * Create clients table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.up = function (knex) {
    return knex.schema.table('proposal', function (table) {
        
        table.integer('create_user_id').unsigned().notNullable();;
        
    }).then();
};

/**
 * Drop clients table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.down = function (knex) {
    return knex.schema.table('proposal', function (table) {

        table.dropColumn('create_user_id');
        
    }).then();
};