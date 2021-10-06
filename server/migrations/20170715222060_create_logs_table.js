/**
 * Create logs table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.up = function (knex) {
    return knex.schema.createTable('logs', function (table) {
        table.increments('id').primary().unsigned();
        table.integer('user_id').notNullable();
        /** 
         * Type : target category
         * 1: CLIENT
         * 2: UNIT
         * 3: PROPOSAL
         * 4: LEASE
        */
        table.integer('type').notNullable();
        /** 
         * Action : operate category
         * 
         * CLIENT_CREATE: WHEN YOU CREATE NEW CLIENT
         * CLIENT_UPDATE: WHEN YOU UPDATE THE CLIENT
         * 
         * UNIT_CREATE: WHEN YOU CREATE NEW UNIT
         * UNIT_UPDATE: WHEN YOU UPDATE THE UNIT
         * 
         * PROPOSAL_SUBMIT: WHEN YOU CREATE PENDING PROPOSAL
         * PROPOSAL_SIGN: WHEN YOU SIGN PROPOSAL
         * PROPOSAL_CANCEL: WHEN YOU CANCEL PROPOSAL
         * 
         * LEASE_SUBMIT: WHEN YOU CREATE PENDING LEASE
         * LEASE_SIGN: WHEN YOU SIGN LEASE
         * LEASE_CANCEL: WHEN YOU CANCEL LEASE
        */
        table.string('action').notNullable();
        table.integer('data_id').notNullable();
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
    return knex.schema.dropTable('logs');
};