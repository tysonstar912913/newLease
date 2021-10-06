/**
 * Create clients table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.up = function (knex) {
    return knex.schema.createTable('clients', function (table) {

        table.increments('id').primary().unsigned();
        table.string('company_name').notNullable();
        table.string('company_name_ar').notNullable();
        table.string('cr_number').notNullable();
        table.string('vat_rno').notNullable();
        table.text('address');
        table.integer('client_type').default(1);
        table.integer('client_status').default(1);
        table.string('contact_person_name');
        table.string('contact_person_pos');
        table.string('contact_person_phone');

        table.timestamps(true, true);
        // table.timestamp('created_at').defaultTo(knex.fn.now());
        // table.timestamp('updated_at').defaultTo(knex.fn.now());
    }).then();
};

/**
 * Drop clients table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.down = function (knex) {
    return knex.schema.dropTable('clients');
};