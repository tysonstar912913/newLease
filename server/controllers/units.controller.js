import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Units from '../models/units.model';
import Proposal from '../models/proposal.model';
import { logType, logAction, getLoggedUserID, newlogdata } from './logs.controller';
import knex from '../config/knex';

/****** DOWNLOAD EXCEL ******/
const excel = require('node-excel-export');
/****** DOWNLOAD EXCEL ******/

/**
 * Returns inserting result if valid unit data is provided
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function newitem(req, res) {
    const { unit_type, unit_name, unit_area, building, floor, unit_status, number_of_bedrooms, number_of_bathrooms, number_of_livingrooms, number_of_diningrooms, number_of_kitchens, number_of_laundry, number_of_maidrooms, number_of_duplex, number_of_atrium, number_of_terraces, number_of_pools, number_of_lobbies } = req.body;

    Units.forge({
        unit_type, unit_name, unit_area, building, floor, unit_status, number_of_bedrooms, number_of_bathrooms, number_of_livingrooms, number_of_diningrooms, number_of_kitchens, number_of_laundry, number_of_maidrooms, number_of_duplex, number_of_atrium, number_of_terraces, number_of_pools, number_of_lobbies
    }, { hasTimestamps: true }).save()
        .then(unit => {
            const inserted_data = unit.toJSON();
            if (req.headers['x-xsrf-token']) {
                const user_id = getLoggedUserID(req.headers['x-xsrf-token']);
                if (user_id !== null && user_id > 0) {
                    let log_data = {
                        user_id: user_id,
                        type: logType['unit'],
                        action: logAction['unit_create'],
                        data_id: inserted_data.id
                    }
                    newlogdata(log_data);
                }
            }
            res.json({
                error: false,
                data: inserted_data,
                message: 'New unit is created.'
            })
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function getlist(req, res) {
    const { order_by_column, order_by_dir, limit_start_num, limit_count, criteria_building, criteria_floor, criteria_status, unit_type } = req.query;
    let count_query_builder = Units.forge();
    if (criteria_building) {
        count_query_builder = count_query_builder.query('where', 'building', '=', criteria_building);
    }
    if (criteria_floor) {
        count_query_builder = count_query_builder.query('where', 'floor', '=', criteria_floor);
    }
    if (criteria_status) {
        count_query_builder = count_query_builder.query('where', 'unit_status', '=', criteria_status);
    }
    if (unit_type) {
        count_query_builder = count_query_builder.query('where', 'unit_type', '=', unit_type);
    }
    count_query_builder.count('id').then(function (total_count) {
        let pageSize = 1;
        pageSize = parseInt(total_count / limit_count);
        if ((total_count % limit_count) == 0) {
            pageSize = parseInt(total_count / limit_count);
        }
        else {
            pageSize = parseInt(total_count / limit_count) + 1;
        }

        let query_builder = Units.forge();
        var units_id_colid = knex.ref('units.id'); // <-- [1]
        var subquery1 = knex('proposal').count('*')
            .where('unit_ids', units_id_colid).as('units_count_in_proposal');

        if (criteria_building) {
            query_builder = query_builder.query('where', 'building', '=', criteria_building);
        }
        if (criteria_floor) {
            query_builder = query_builder.query('where', 'floor', '=', criteria_floor);
        }
        if (criteria_status) {
            query_builder = query_builder.query('where', 'unit_status', '=', criteria_status);
        }
        if (unit_type) {
            query_builder = query_builder.query('where', 'unit_type', '=', unit_type);
        }
        query_builder.query(function (qb) {
            qb.select('*', subquery1);
            qb.orderBy(order_by_column, order_by_dir).offset(limit_start_num * limit_count).limit(limit_count);
        }).fetchAll()
            .then(unitlist => res.json({
                total_count: total_count,
                pageSize: pageSize,
                error: false,
                success: true,
                data: unitlist.toJSON()
            }))
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: err
            }));
    })
}

export function getitem(req, res) {
    const unit_id = req.query.id;
    if (unit_id > 0) {
        Units.forge({ id: unit_id })
            .fetch()
            .then(unit => {
                if (!unit) {
                    res.status(HttpStatus.NOT_FOUND).json({
                        error: true,
                        data: {}
                    });
                } else {
                    res.json({
                        error: false,
                        data: unit.toJSON()
                    });
                }
            })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: err
            }));
    }
    else {
        res.json({
            error: true,
            data: null
        })
    }
}

export function updateitem(req, res) {
    Units.forge({ id: req.params.id })
        .fetch({ require: true })
        .then(unit => unit.save({
            unit_type: req.body.unit_type || unit.get('unit_type'),
            unit_name: req.body.unit_name || unit.get('unit_name'),
            unit_area: req.body.unit_area || unit.get('unit_area'),
            building: req.body.building || unit.get('building'),
            floor: req.body.floor || unit.get('floor'),
            unit_status: req.body.unit_status || unit.get('unit_status'),
            number_of_bedrooms: req.body.number_of_bedrooms || unit.get('number_of_bedrooms'),
            number_of_bathrooms: req.body.number_of_bathrooms || unit.get('number_of_bathrooms'),
            number_of_livingrooms: req.body.number_of_livingrooms || unit.get('number_of_livingrooms'),
            number_of_diningrooms: req.body.number_of_diningrooms || unit.get('number_of_diningrooms'),
            number_of_kitchens: req.body.number_of_kitchens || unit.get('number_of_kitchens'),
            number_of_laundry: req.body.number_of_laundry || unit.get('number_of_laundry'),
            number_of_maidrooms: req.body.number_of_maidrooms || unit.get('number_of_maidrooms'),
            number_of_duplex: req.body.number_of_duplex || unit.get('number_of_duplex'),
            number_of_atrium: req.body.number_of_atrium || unit.get('number_of_atrium'),
            number_of_terraces: req.body.number_of_terraces || unit.get('number_of_terraces'),
            number_of_pools: req.body.number_of_pools || unit.get('number_of_pools'),
            number_of_lobbies: req.body.number_of_lobbies || unit.get('number_of_lobbies'),
        }, { hasTimestamps: true })
            .then(() => {
                const inserted_data = unit.toJSON();
                if (req.headers['x-xsrf-token']) {
                    const user_id = getLoggedUserID(req.headers['x-xsrf-token']);
                    if (user_id !== null && user_id > 0) {
                        let log_data = {
                            user_id: user_id,
                            type: logType['unit'],
                            action: logAction['unit_update'],
                            data_id: inserted_data.id
                        }
                        newlogdata(log_data);
                    }
                }
                res.json({
                    error: false,
                    data: inserted_data,
                    message: 'This unit is updated correctly.'
                })
            })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                data: { message: err.message }
            }))
        )
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function deleteitem(req, res) {
    Units.forge({ id: req.params.id })
        .fetch({ require: true })
        .then(unit => unit.destroy()
            .then(() => res.json({
                error: false,
                data: { message: 'Unit deleted successfully.' }
            }))
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                data: { message: err.message }
            }))
        )
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function downloadexcel(req, res) {
    const styles = {
        headerDark: {
            fill: {
                fgColor: {
                    rgb: 'FF000000'
                }
            },
            font: {
                color: {
                    rgb: 'FFFFFFFF'
                },
                sz: 14,
                bold: true,
                // underline: true
            }
        },
        cellavailable: {
            fill: {
                fgColor: {
                    rgb: '922c88'
                }
            },
            font: {
                color: {
                    rgb: 'FFFFFFFF'
                },
                bold: true,
            }
        },
        cellnotavailable: {
            fill: {
                fgColor: {
                    rgb: 'd4d4d4'
                }
            },
            font: {
                color: {
                    rgb: '000'
                },
                bold: true,
            }
        },
        cellpendingproposal: {
            fill: {
                fgColor: {
                    rgb: '4556ac'
                }
            },
            font: {
                color: {
                    rgb: 'FFFFFFFF'
                },
                bold: true,
            }
        },
        cellpendinglease: {
            fill: {
                fgColor: {
                    rgb: 'b69329'
                }
            },
            font: {
                color: {
                    rgb: 'FFFFFFFF'
                },
                bold: true,
            }
        },
        cellleased: {
            fill: {
                fgColor: {
                    rgb: '3e884f'
                }
            },
            font: {
                color: {
                    rgb: 'FFFFFFFF'
                },
                bold: true,
            }
        },
    };
    //Here you specify the export structure
    const specification = {
        id: { // <- the key should match the actual data key
            displayName: 'ID', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 50 // <- width in pixels
        },
        unit_name: { // <- the key should match the actual data key
            displayName: 'unit_name', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 120 // <- width in pixels
        },
        unit_status: { // <- the key should match the actual data key
            displayName: 'Status', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            cellStyle: function (value, row) { // <- style renderer function
                switch (row.unit_status) {
                    case 'Available':
                        return styles.cellavailable;
                    case 'Not Available':
                        return styles.cellnotavailable;
                    case 'Pending Proposal':
                        return styles.cellpendingproposal;
                    case 'Pending Lease':
                        return styles.cellpendinglease;
                    case 'Leased':
                        return styles.cellleased;
                    default:
                        return {};
                }
            },
            width: 100 // <- width in pixels
        },
        unit_type: { // <- the key should match the actual data key
            displayName: 'unit_type', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 90 // <- width in pixels
        },
        unit_area: { // <- the key should match the actual data key
            displayName: 'unit_area', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 90 // <- width in pixels
        },
        building: { // <- the key should match the actual data key
            displayName: 'building', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 75 // <- width in pixels
        },
        floor: { // <- the key should match the actual data key
            displayName: 'floor', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 50 // <- width in pixels
        },
    }

    const { order_by_column, order_by_dir, limit_start_num, limit_count, criteria_building, criteria_floor, criteria_status } = req.query;
    let query_builder = Units.forge();
    query_builder.query(function (qb) {
        if (criteria_building && criteria_building != 'null') {
            query_builder = query_builder.query('where', 'building', '=', criteria_building);
        }
        if (criteria_floor && criteria_floor != 'null') {
            query_builder = query_builder.query('where', 'floor', '=', criteria_floor);
        }
        if (criteria_status && criteria_status != 'null') {
            query_builder = query_builder.query('where', 'unit_status', '=', criteria_status);
        }

        qb.orderBy(order_by_column, order_by_dir);
    })
        .fetchAll().then(unitlist => {
            const unit_list = unitlist.toJSON();
            const dataset = [];
            for (let i = 0; i < unit_list.length; i++) {
                let unit_item = {
                    id: unit_list[i].id,
                    unit_name: unit_list[i].unit_name,
                    unit_area: unit_list[i].unit_area,
                    building: unit_list[i].building,
                    floor: unit_list[i].floor,
                }
                switch (unit_list[i].unit_status) {
                    case 1:
                        unit_item.unit_status = 'Available';
                        break;
                    case 2:
                        unit_item.unit_status = 'Not Available';
                        break;
                    case 3:
                        unit_item.unit_status = 'Pending Proposal';
                        break;
                    case 4:
                        unit_item.unit_status = 'Pending Lease';
                        break;
                    case 5:
                        unit_item.unit_status = 'Leased';
                        break;
                    default:
                        unit_item.unit_status = 'Available';
                        break;
                }
                switch (unit_list[i].unit_type) {
                    case 1:
                        unit_item.unit_type = 'Office';
                        break;
                    case 2:
                        unit_item.unit_type = 'Residental';
                        break;
                    case 3:
                        unit_item.unit_type = 'Retail';
                        break;
                    default:
                        unit_item.unit_type = 'Office';
                        break;
                }
                dataset.push(unit_item);
            }

            const report = excel.buildExport(
                [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                    {
                        name: 'Report', // <- Specify sheet name (optional)
                        specification: specification, // <- Report specification
                        data: dataset // <-- Report data
                    }
                ]
            );

            // You can then return this straight
            res.attachment('unitlist.xlsx'); // This is sails.js specific (in general you need to set headers)
            return res.send(report);
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}