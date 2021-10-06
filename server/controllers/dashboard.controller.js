import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import Clients from '../models/clients.model';
import Units from '../models/units.model';
import Proposal from '../models/proposal.model';
import Lease from '../models/lease.model';

/**
 * Returns inserting result if valid unit data is provided
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function getdashboarddata(req, res) {
    let client_count = 0;
    let prospect_count = 0;
    let total_proposal_count = 0;
    let signed_lease_count = 0;
    let total_units_count = 0;

    let leased_units_count = 0;

    Clients.forge().where('client_status', 1).count('id')
        .then(qb_client_count => {
            if (qb_client_count) {
                client_count = qb_client_count;
            }
            Clients.forge().where('client_status', 2).count('id')
                .then(qb_prospect_count => {
                    if (qb_prospect_count) {
                        prospect_count = qb_prospect_count;
                    }
                    Proposal.forge().count()
                        .then(qb_total_proposal_count => {
                            if (qb_total_proposal_count) {
                                total_proposal_count = qb_total_proposal_count;
                            }
                            Lease.forge().where('lease_status', 3).count()
                                .then(qb_signed_lease_count => {
                                    if (qb_signed_lease_count) {
                                        signed_lease_count = qb_signed_lease_count;
                                    }
                                    Units.forge().count()
                                        .then(qb_total_units_count => {
                                            if (qb_total_units_count) {
                                                total_units_count = qb_total_units_count;
                                            }
                                            let leased_unit_query_builder = Lease.forge();
                                            leased_unit_query_builder.query(function (qb) {
                                                qb.select('proposal.unit_ids')
                                                    .leftJoin('proposal', 'lease.proposal_id', 'proposal.id')
                                                    .where('lease.lease_status', '=', 3);
                                            })
                                                .fetchAll().then(unit_ids => {
                                                    console.log(unit_ids.toJSON());
                                                    let unit_ids_arr = unit_ids.toJSON();
                                                    let optimized_unit_id_array = [];
                                                    for (let i = 0; i < unit_ids_arr.length; i++) {
                                                        let unit_id_str = unit_ids_arr[i].unit_ids;
                                                        let buffer = unit_id_str.split(',');
                                                        for (let j = 0 ; j < buffer.length ; j ++) {
                                                            if (!optimized_unit_id_array.includes(buffer[j])) {
                                                                optimized_unit_id_array.push(buffer[j]);
                                                            }
                                                        }
                                                    }
                                                    console.log(optimized_unit_id_array);
                                                    let leased_units_count = optimized_unit_id_array.length;

                                                    res.json({
                                                        error: false,
                                                        data: {
                                                            client_count: client_count,
                                                            prospect_count: prospect_count,
                                                            total_proposal_count: total_proposal_count,
                                                            signed_lease_count: signed_lease_count,
                                                            total_units_count: total_units_count,
                                                            leased_units_count: leased_units_count
                                                        }
                                                    });
                                                })
                                                .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                                                    error: err
                                                }));
                                        })
                                        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                                            error: err
                                        }));
                                })
                                .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                                    error: err
                                }));
                        })
                        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                            error: err
                        }));
                })
                .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: err
                }));
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function getdashboardproposalsdata(req, res) {
    let signed_proposals_count = 0;
    let pending_proposals_count = 0;
    Proposal.forge().where('proposal_status', 3).count('id')
        .then(qb_signed_proposals_count => {
            if (qb_signed_proposals_count) {
                signed_proposals_count = qb_signed_proposals_count;
            }
            Proposal.forge().where('proposal_status', 2).count('id')
                .then(qb_pending_proposals_count => {
                    if (qb_pending_proposals_count) {
                        pending_proposals_count = qb_pending_proposals_count;
                    }
                    res.json({
                        error: false,
                        data: {
                            signed_proposals_count: signed_proposals_count,
                            pending_proposals_count: pending_proposals_count,
                        }
                    });
                })
                .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: err
                }));

        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function getdashboardleasesdata(req, res) {
    let signed_leases_count = 0;
    let pending_leases_count = 0;
    Lease.forge().where('lease_status', 3).count('id')
        .then(qb_signed_leases_count => {
            if (qb_signed_leases_count) {
                signed_leases_count = qb_signed_leases_count;
            }
            Lease.forge().where('lease_status', 2).count('id')
                .then(qb_pending_leases_count => {
                    if (qb_pending_leases_count) {
                        pending_leases_count = qb_pending_leases_count;
                    }
                    res.json({
                        error: false,
                        data: {
                            signed_leases_count: signed_leases_count,
                            pending_leases_count: pending_leases_count,
                        }
                    });
                })
                .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: err
                }));

        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function getdashboardunitdata(req, res) {
    let available_unit_count = 0;
    let notavailable_unit_count = 0;
    Units.forge().where('unit_status', 1).count('id')
        .then(qb_available_unit_count => {
            if (qb_available_unit_count) {
                available_unit_count = qb_available_unit_count;
            }
            Units.forge().where('unit_status', 2).count('id')
                .then(qb_notavailable_unit_count => {
                    if (qb_notavailable_unit_count) {
                        notavailable_unit_count = qb_notavailable_unit_count;
                    }
                    res.json({
                        error: false,
                        data: {
                            available_unit_count: available_unit_count,
                            notavailable_unit_count: notavailable_unit_count,
                        }
                    });
                })
                .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: err
                }));

        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

// export function getlist(req, res) {
//     const { order_by_column, order_by_dir, limit_start_num, limit_count, criteria_building, criteria_floor, criteria_status } = req.query;
//     let count_query_builder = Units.forge();
//     if (criteria_building) {
//         count_query_builder = count_query_builder.query('where', 'building', '=', criteria_building);
//     }
//     if (criteria_floor) {
//         count_query_builder = count_query_builder.query('where', 'floor', '=', criteria_floor);
//     }
//     if (criteria_status) {
//         count_query_builder = count_query_builder.query('where', 'unit_status', '=', criteria_status);
//     }
//     count_query_builder.count('id').then(function (total_count) {
//         let pageSize = 1;
//         pageSize = parseInt(total_count / limit_count);
//         if ((total_count % limit_count) == 0) {
//             pageSize = parseInt(total_count / limit_count);
//         }
//         else {
//             pageSize = parseInt(total_count / limit_count) + 1;
//         }

//         let query_builder = Units.forge();
//         if (criteria_building) {
//             query_builder = query_builder.query('where', 'building', '=', criteria_building);
//         }
//         if (criteria_floor) {
//             query_builder = query_builder.query('where', 'floor', '=', criteria_floor);
//         }
//         if (criteria_status) {
//             query_builder = query_builder.query('where', 'unit_status', '=', criteria_status);
//         }
//         query_builder.query(function (qb) {
//             qb.orderBy(order_by_column, order_by_dir).offset(limit_start_num * limit_count).limit(limit_count);
//         }).fetchAll()
//             .then(unitlist => res.json({
//                 total_count: total_count,
//                 pageSize: pageSize,
//                 error: false,
//                 success: true,
//                 data: unitlist.toJSON()
//             }))
//             .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//                 error: err
//             }));
//     })
// }

// export function getitem(req, res) {
//     const unit_id = req.query.id;
//     if (unit_id > 0) {
//         Units.forge({ id: unit_id })
//             .fetch()
//             .then(unit => {
//                 if (!unit) {
//                     res.status(HttpStatus.NOT_FOUND).json({
//                         error: true,
//                         data: {}
//                     });
//                 } else {
//                     res.json({
//                         error: false,
//                         data: unit.toJSON()
//                     });
//                 }
//             })
//             .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//                 error: err
//             }));
//     }
//     else {
//         res.json({
//             error: true,
//             data: null
//         })
//     }
// }

// export function updateitem(req, res) {
//     Units.forge({ id: req.params.id })
//         .fetch({ require: true })
//         .then(unit => unit.save({
//             unit_type: req.body.unit_type || unit.get('unit_type'),
//             unit_name: req.body.unit_name || unit.get('unit_name'),
//             unit_area: req.body.unit_area || unit.get('unit_area'),
//             building: req.body.building || unit.get('building'),
//             floor: req.body.floor || unit.get('floor'),
//             unit_status: req.body.unit_status || unit.get('unit_status'),
//             number_of_bedrooms: req.body.number_of_bedrooms || unit.get('number_of_bedrooms'),
//             number_of_bathrooms: req.body.number_of_bathrooms || unit.get('number_of_bathrooms'),
//             number_of_livingrooms: req.body.number_of_livingrooms || unit.get('number_of_livingrooms'),
//             number_of_diningrooms: req.body.number_of_diningrooms || unit.get('number_of_diningrooms'),
//             number_of_kitchens: req.body.number_of_kitchens || unit.get('number_of_kitchens'),
//             number_of_laundry: req.body.number_of_laundry || unit.get('number_of_laundry'),
//             number_of_maidrooms: req.body.number_of_maidrooms || unit.get('number_of_maidrooms'),
//             number_of_duplex: req.body.number_of_duplex || unit.get('number_of_duplex'),
//             number_of_atrium: req.body.number_of_atrium || unit.get('number_of_atrium'),
//             number_of_terraces: req.body.number_of_terraces || unit.get('number_of_terraces'),
//             number_of_pools: req.body.number_of_pools || unit.get('number_of_pools'),
//             number_of_lobbies: req.body.number_of_lobbies || unit.get('number_of_lobbies'),
//         }, { hasTimestamps: true })
//             .then(() => res.json({
//                 error: false,
//                 data: unit.toJSON()
//             }))
//             .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//                 error: true,
//                 data: { message: err.message }
//             }))
//         )
//         .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//             error: err
//         }));
// }

// export function deleteitem(req, res) {
//     Units.forge({ id: req.params.id })
//         .fetch({ require: true })
//         .then(unit => unit.destroy()
//             .then(() => res.json({
//                 error: false,
//                 data: { message: 'Unit deleted successfully.' }
//             }))
//             .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//                 error: true,
//                 data: { message: err.message }
//             }))
//         )
//         .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//             error: err
//         }));
// }