/**
 * Create clients table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.up = function (knex) {
    return knex.schema.table('proposal', function (table) {
        
        table.integer('unit_type').default(1);          // 1:Office 2:Residential 3:Retail
        
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

        table.dropColumn('unit_type');
        
    }).then();
};