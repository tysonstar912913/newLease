/**
 * Create Proposal table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.up = function (knex) {
    return knex.schema.createTable('proposal', function (table) {
        table.increments('id').primary().unsigned();
        table.integer('client_id').notNullable();
        table.string('unit_ids').notNullable();
        table.float('base_rent').default(0.0);
        table.float('annual_community_service_charges').default(0.0);
        table.float('annual_building_service_charges').default(0.0);
        table.float('annual_increment_on_service_charges').default(0.0);
        table.integer('rent_free_period').default(0);
        table.integer('payment_frequency').default(0);
        table.integer('proposal_status').default(1);    // 1: draft 2: Pending 3: Signed 4: Canceled
        table.timestamps(true, true);
    }).then();
};

/**
 * Drop units table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.down = function (knex) {
    return knex.schema.dropTable('proposal');
};