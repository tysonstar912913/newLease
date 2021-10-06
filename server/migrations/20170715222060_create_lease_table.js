/**
 * Create lease table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.up = function (knex) {
    return knex.schema.createTable('lease', function (table) {
        table.increments('id').primary().unsigned();
        table.integer('proposal_id').notNullable();
        table.date('effective_date').notNullable();
        table.date('commencement_date').notNullable();
        table.integer('term_years').default(0);
        table.integer('allocated_car_parks');
        table.integer('unallocated_car_parks');
        table.float('base_rent').default(0.0);
        table.float('escalation_rate').default(0.0);
        table.float('security_deposit').default(0.0);
        table.float('total_design_review_fee').default(0.0);
        table.float('annual_community_service_charges').default(0.0);
        table.float('annual_building_service_charges').default(0.0);
        table.float('annual_increment_on_service_charges').default(0.0);
        table.integer('rent_free_period').default(0);
        table.integer('payment_frequency').default(0);
        table.integer('performance_bond_amount').default(0);
        table.integer('reinstatement_condition').default(0);
        table.string('permitted_useof_premises');
        table.integer('lease_status').default(1);    // 1: draft 2: Pending 3: Signed 4: Canceled        
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
    return knex.schema.dropTable('lease');
};