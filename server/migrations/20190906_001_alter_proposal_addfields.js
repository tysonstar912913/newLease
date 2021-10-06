/**
 * Create clients table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.up = function (knex) {
    return knex.schema.table('proposal', function (table) {

        table.bool('revenue_sharing').default(false);
        table.integer('type').default(1);
        table.string('attachment_path');
        
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

        table.dropColumn('revenue_sharing');
        table.dropColumn('type');
        table.dropColumn('attachment_path');
        
    }).then();
};