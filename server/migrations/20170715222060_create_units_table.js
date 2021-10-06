/**
 * Create units table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.up = function (knex) {
    return knex.schema.createTable('units', function (table) {
        table.increments('id').primary().unsigned();
        table.integer('unit_type').default(1);          // 1:Office 2:Residential 3:Retail
        table.string('unit_name').notNullable();
        table.string('unit_area').notNullable();
        table.integer('building').default(1);
        table.integer('floor').default(1);
        table.integer('unit_status').default(1);        // 1:Available, 2:Not Available, 3:Pending Proposal, 4:Pending Lease, 5:Leased
        table.integer('number_of_bedrooms').default(0);
        table.integer('number_of_bathrooms').default(0);
        table.integer('number_of_livingrooms').default(0);
        table.integer('number_of_diningrooms').default(0);
        table.integer('number_of_kitchens').default(0);
        table.integer('number_of_laundry').default(0);
        table.integer('number_of_maidrooms').default(0);
        table.integer('number_of_duplex').default(0);
        table.integer('number_of_atrium').default(0);
        table.integer('number_of_terraces').default(0);
        table.integer('number_of_pools').default(0);
        table.integer('number_of_lobbies').default(0);
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
    return knex.schema.dropTable('units');
};