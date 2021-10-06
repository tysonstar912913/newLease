import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Proposal from '../models/proposal.model';
import Client from '../models/clients.model';
import Unit from '../models/units.model';
import User from '../models/user.model';
import { logType, logAction, getLoggedUserID, newlogdata } from './logs.controller';
/****** DOWNLOAD DOCX ******/
var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');
var fs = require('fs');
var path = require('path');
/****** DOWNLOAD DOCX ******/

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
export const payment_frequency = ["Monthly", "Biyearly", "Yearl"];

export function getclientlist(req, res) {
    let order_by_column = 'company_name';
    let order_by_dir = 'ASC';
    let query_builder = Client.forge();
    query_builder.query(function (qb) {
        qb.where('is_active', '=', 1)
        qb.orderBy(order_by_column, order_by_dir);
    }).fetchAll()
        .then(clientlist => res.json({
            error: false,
            success: true,
            data: clientlist.toJSON()
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function getunitlist(req, res) {
    const { unit_type } = req.query;
    let order_by_column = 'unit_name';
    let order_by_dir = 'ASC';
    let query_builder = Unit.forge();
    query_builder.query(function (qb) {
        if (unit_type) {
            qb.where('unit_type', '=', unit_type);
        }
        // WHERE CONDITION : SELECT UNIT_LIST WHERE UNIT_STATUS=1:->AVAILABLE
        qb.where('unit_status', '=', 1);
        qb.orderBy(order_by_column, order_by_dir);
    }).fetchAll()
        .then(unitlist => res.json({
            error: false,
            success: true,
            unit_type: unit_type,
            data: unitlist.toJSON()
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function getwholeunitlist(req, res) {
    const { unit_type } = req.query;
    let order_by_column = 'unit_name';
    let order_by_dir = 'ASC';
    let query_builder = Unit.forge();
    query_builder.query(function (qb) {
        if (unit_type) {
            qb.where('unit_type', '=', unit_type);
        }

        qb.orderBy(order_by_column, order_by_dir);
    }).fetchAll()
        .then(unitlist => res.json({
            error: false,
            success: true,
            data: unitlist.toJSON()
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function getuserlist(req, res) {
    let order_by_column = 'first_name';
    let order_by_dir = 'ASC';
    let query_builder = User.forge();
    query_builder.query(function (qb) {
        qb.orderBy(order_by_column, order_by_dir);
    }).fetchAll()
        .then(userlist => res.json({
            error: false,
            success: true,
            data: userlist.toJSON()
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function newitem(req, res) {
    const { client_id, unit_ids, base_rent, annual_community_service_charges,
        annual_building_service_charges, annual_increment_on_service_charges,
        payment_frequency, rent_free_period, proposal_status, type, revenue_sharing, attachment_path, create_user_id, unit_type } = req.body;

    Proposal.forge({
        client_id, unit_ids, base_rent, annual_community_service_charges,
        annual_building_service_charges, annual_increment_on_service_charges,
        payment_frequency, rent_free_period, proposal_status, revenue_sharing, attachment_path, create_user_id, type, unit_type
    }, { hasTimestamps: true }).save()
        // .then(proposal => res.json({
        //     error: false,
        //     data: proposal.toJSON(),
        //     message: 'New proposal is inserted.'
        // }))
        .then(proposal => {
            const inserted_data = proposal.toJSON();
            if (req.headers['x-xsrf-token']) {
                const user_id = getLoggedUserID(req.headers['x-xsrf-token']);
                if (user_id !== null && user_id > 0) {
                    if (inserted_data.proposal_status != 1) {
                        let log_data = {
                            user_id: user_id,
                            type: logType['proposal'],
                            action: '',
                            data_id: inserted_data.id
                        }
                        if (inserted_data.proposal_status == 2) {
                            log_data.action = logAction['proposal_submit'];
                        }
                        if (inserted_data.proposal_status == 3) {
                            log_data.action = logAction['proposal_sign'];
                        }
                        if (inserted_data.proposal_status == 4) {
                            log_data.action = logAction['proposal_cancel'];
                        }
                        newlogdata(log_data);
                    }

                    if (inserted_data.proposal_status === 1 || inserted_data.proposal_status === 2) {
                        const unit_id_list = unit_ids.split(',');

                        for (let i = 0, len = unit_id_list.length; i < len; i++) {
                            const each_unit_id = unit_id_list[i];
                            Unit.forge({ id: each_unit_id })
                                .fetch({ require: true })
                                .then(unit => unit.save({
                                    unit_status: 2, // not available
                                }, { hasTimestamps: true }));
                        }
                    }
                }
            }
            res.json({
                error: false,
                data: inserted_data,
                message: 'New proposal is created.',
            })
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function getlist(req, res) {
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
        cellPending: {
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
        cellSigned: {
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
        cellCanceled: {
            fill: {
                fgColor: {
                    rgb: 'c43d4b'
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
        proposal_id: { // <- the key should match the actual data key
            displayName: 'ID', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 50 // <- width in pixels
        },
        client_name: { // <- the key should match the actual data key
            displayName: 'Client Name', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 120 // <- width in pixels
        },
        created_at: { // <- the key should match the actual data key
            displayName: 'Date', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 100 // <- width in pixels
        },
        base_rent: { // <- the key should match the actual data key
            displayName: 'Base Rent', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 90 // <- width in pixels
        },
        annual_community_service_charges: { // <- the key should match the actual data key
            displayName: 'Annual Community Service Charges: (SAR)', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 340 // <- width in pixels
        },
        annual_building_service_charges: { // <- the key should match the actual data key
            displayName: 'Annual Building Service Charges (SAR):', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 340 // <- width in pixels
        },
        annual_increment_on_service_charges: { // <- the key should match the actual data key
            displayName: 'Annual increment on service charge (%):', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 340 // <- width in pixels
        },
        proposal_status: { // <- the key should match the actual data key
            displayName: 'Status', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            cellStyle: function (value, row) { // <- style renderer function
                switch (row.proposal_status) {
                    case 'Pending':
                        return styles.cellPending;
                    case 'Signed':
                        return styles.cellSigned;
                    case 'Canceled':
                        return styles.cellCanceled;
                    default:
                        return {};
                }
            },
            width: 100 // <- width in pixels
        },
    }
    const { order_by_column, order_by_dir, limit_start_num, limit_count, criteria_status, criteria_user_id, criteria_create_user_id, unit_type } = req.query;
    let searchKeyword = req.query.searchKeyword;
    searchKeyword = '%' + req.query.searchKeyword + '%';

    let count_query_builder = Proposal.forge();
    count_query_builder.query(function (count_query_builder) {
        // count_query_builder.select('proposal.id AS proposal_id', 'proposal.*', 'clients.id AS client_id', 'clients.*')
        //     .leftJoin('clients', 'proposal.client_id', 'clients.id');
        count_query_builder.select().leftJoin('clients', 'proposal.client_id', 'clients.id').leftJoin('users', 'proposal.create_user_id', 'users.id');
        if (req.query.searchKeyword != '') {
            count_query_builder.where('company_name', 'LIKE', searchKeyword);
        }

        if (criteria_status) {
            count_query_builder.where('proposal_status', '=', criteria_status);
        }

        if (criteria_user_id) {
            count_query_builder.where('proposal.client_id', '=', criteria_user_id);
        }

        if (criteria_create_user_id) {
            count_query_builder.where('proposal.create_user_id', '=', criteria_create_user_id);
        }

        if (unit_type) {
            count_query_builder.where('proposal.unit_type', '=', unit_type);
        }

    }).count('proposal.id').then(function (total_count) {
        let pageSize = 1;
        pageSize = parseInt(total_count / limit_count);
        if ((total_count % limit_count) == 0) {
            pageSize = parseInt(total_count / limit_count);
        }
        else {
            pageSize = parseInt(total_count / limit_count) + 1;
        }
        let query_builder = Proposal.forge();
        query_builder.query(function (qb) {
            qb.select('proposal.id AS proposal_id', 'proposal.*', 'clients.id AS client_id', 'clients.*', 'proposal.updated_at AS proposal_updated_at', 'users.first_name', 'users.last_name')
                .leftJoin('clients', 'proposal.client_id', 'clients.id')
                .leftJoin('users', 'proposal.create_user_id', 'users.id');
            if (req.query.searchKeyword != '') {
                qb.where('company_name', 'LIKE', searchKeyword);
            }

            if (criteria_status) {
                qb.where('proposal_status', '=', criteria_status);
            }

            if (criteria_user_id) {
                qb.where('proposal.client_id', '=', criteria_user_id);
            }

            if (criteria_create_user_id) {
                qb.where('proposal.create_user_id', '=', criteria_create_user_id);
            }

            if (unit_type) {
                qb.where('proposal.unit_type', '=', unit_type);
            }
            qb.orderBy(order_by_column, order_by_dir).offset(limit_start_num * limit_count).limit(limit_count);
        })
            .fetchAll()
            // .then(proposallist => res.json({
            //     total_count: total_count,
            //     pageSize: pageSize,
            //     error: false,
            //     success: true,
            //     data: proposallist.toJSON()
            // }))
            .then(proposallist => {
                console.log('req.query.excel_download', req.query.excel_download)
                if (req.query.excel_download === true) {
                    const proposal_list = proposallist.toJSON();
                    const dataset = [];
                    for (let i = 0; i < proposal_list.length; i++) {
                        let proposal_item = {
                            proposal_id: proposal_list[i].proposal_id,
                            client_name: proposal_list[i].company_name,
                            created_at: proposal_list[i].proposal_updated_at,
                            base_rent: proposal_list[i].base_rent,
                            annual_community_service_charges: proposal_list[i].annual_community_service_charges,
                            annual_building_service_charges: proposal_list[i].annual_building_service_charges,
                            annual_increment_on_service_charges: proposal_list[i].annual_increment_on_service_charges,
                        }
                        switch (proposal_list[i].proposal_status) {
                            case 1:
                                proposal_item.proposal_status = 'Draft';
                                break;
                            case 2:
                                proposal_item.proposal_status = 'Pending';
                                break;
                            case 3:
                                proposal_item.proposal_status = 'Signed';
                                break;
                            case 4:
                                proposal_item.proposal_status = 'Canceled';
                                break;
                            default:
                                proposal_item.proposal_status = 'Draft';
                                break;
                        }
                        dataset.push(proposal_item);
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
                    res.attachment('proposallist.xlsx'); // This is sails.js specific (in general you need to set headers)
                    return res.send(report);
                    // return res.download(report);
                }
                else {
                    res.json({
                        total_count: total_count,
                        pageSize: pageSize,
                        error: false,
                        success: true,
                        data: proposallist.toJSON()
                    })
                }
            })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: err
            }));
    })
}

export function getitem(req, res) {
    const proposal_id = req.query.id;
    if (proposal_id > 0) {
        let query_builder = Proposal.forge();
        query_builder.query(function (qb) {
            qb.select('proposal.id AS proposal_id', 'proposal.*', 'clients.*', 'proposal.updated_at AS proposal_updated_at')
                .leftJoin('clients', 'proposal.client_id', 'clients.id');
            if (req.query.searchKeyword != '') {
                qb.where('proposal.id', '=', proposal_id);
            }
        }).fetch().then(proposal => {
            if (!proposal) {
                res.status(HttpStatus.NOT_FOUND).json({
                    error: true,
                    data: {}
                });
            } else {
                let proposal_item = proposal.toJSON();
                let unit_ids_str = proposal_item.unit_ids;
                let unit_ids_arr = unit_ids_str.split(',');
                let unit_query_builder = Unit.forge();
                unit_query_builder.query(function (qb) {
                    for (let i = 0; i < unit_ids_arr.length; i++) {
                        qb.orWhere('id', '=', unit_ids_arr[i]);
                    }
                }).fetchAll().then(units => {
                    if (!units) {
                        res.status(HttpStatus.NOT_FOUND).json({
                            error: true,
                            data: {}
                        });
                    }
                    else {
                        var attachment_file_name = '../../download/proposalattachment/' + proposal_item.attachment_path;
                        const attachment_file_path = path.resolve(__dirname, attachment_file_name);
                        try {
                            if (fs.existsSync(attachment_file_path)) {
                                //file exists
                                proposal_item['is_existattachmentfile'] = true;
                            }
                            else {
                                proposal_item['is_existattachmentfile'] = false;
                            }
                        } catch (err) {
                            console.error(err)
                            proposal_item['is_existattachmentfile'] = false;
                        }

                        proposal_item['proposal_unit_data'] = units.toJSON();
                        res.json({
                            error: false,
                            data: proposal_item
                        });
                    }
                })
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
    const { client_id, unit_ids, base_rent, annual_community_service_charges, annual_building_service_charges, annual_increment_on_service_charges, payment_frequency, rent_free_period, proposal_status, unit_type } = req.body;
    Proposal.forge({ id: req.params.id })
        .fetch({ require: true })
        .then(proposal => {
            let prev_unit_ids = proposal.get('unit_ids');
            proposal.save({
                client_id: client_id || proposal.get('client_id'),
                unit_ids: unit_ids || proposal.get('unit_ids'),
                base_rent: base_rent || proposal.get('base_rent'),
                annual_community_service_charges: annual_community_service_charges || proposal.get('annual_community_service_charges'),
                annual_building_service_charges: annual_building_service_charges || proposal.get('annual_building_service_charges'),
                annual_increment_on_service_charges: annual_increment_on_service_charges || proposal.get('annual_increment_on_service_charges'),
                payment_frequency: payment_frequency || proposal.get('payment_frequency'),
                rent_free_period: rent_free_period || proposal.get('rent_free_period'),
                proposal_status: proposal_status || proposal.get('proposal_status'),
                unit_type: unit_type || proposal.get('unit_type'),
            }, { hasTimestamps: true }).then(() => {
                const inserted_data = proposal.toJSON();
                if (req.headers['x-xsrf-token']) {
                    const user_id = getLoggedUserID(req.headers['x-xsrf-token']);
                    if (user_id !== null && user_id > 0) {
                        if (inserted_data.proposal_status != 1) {
                            let log_data = {
                                user_id: user_id,
                                type: logType['proposal'],
                                action: '',
                                data_id: inserted_data.id
                            }
                            if (inserted_data.proposal_status == 2) {
                                log_data.action = logAction['proposal_submit'];
                            }
                            if (inserted_data.proposal_status == 3) {
                                log_data.action = logAction['proposal_sign'];
                            }
                            if (inserted_data.proposal_status == 4) {
                                log_data.action = logAction['proposal_cancel'];
                            }
                            newlogdata(log_data);
                        }
                    }
                }

                if (inserted_data.proposal_status === 1 || inserted_data.proposal_status === 2) {
                    const prev_unit_id_list = prev_unit_ids.split(',');
                    for (let i = 0, len = prev_unit_id_list.length; i < len; i++) {
                        const each_prev_unit_id = prev_unit_id_list[i];
                        Unit.forge({ id: each_prev_unit_id })
                            .fetch({ require: true })
                            .then(unit => unit.save({
                                unit_status: 1, // available
                            }, { hasTimestamps: true }));
                    }

                    const unit_id_list = unit_ids.split(',');
                    for (let i = 0, len = unit_id_list.length; i < len; i++) {
                        const each_unit_id = unit_id_list[i];
                        Unit.forge({ id: each_unit_id })
                            .fetch({ require: true })
                            .then(unit => unit.save({
                                unit_status: 2, // not available
                            }, { hasTimestamps: true }));
                    }
                }
                res.json({
                    error: false,
                    data: inserted_data,
                    message: 'This proposal is updated correctly.'
                })
            })
                .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: true,
                    message: 'Proposal updating is failed !'
                }))
        }
            // .then(proposal => proposal.save({
            //     client_id: client_id || proposal.get('client_id'),
            //     unit_ids: unit_ids || proposal.get('unit_ids'),
            //     base_rent: base_rent || proposal.get('base_rent'),
            //     annual_community_service_charges: annual_community_service_charges || proposal.get('annual_community_service_charges'),
            //     annual_building_service_charges: annual_building_service_charges || proposal.get('annual_building_service_charges'),
            //     annual_increment_on_service_charges: annual_increment_on_service_charges || proposal.get('annual_increment_on_service_charges'),
            //     payment_frequency: payment_frequency || proposal.get('payment_frequency'),
            //     rent_free_period: rent_free_period || proposal.get('rent_free_period'),
            //     proposal_status: proposal_status || proposal.get('proposal_status'),
            // }, { hasTimestamps: true })
            // .then(() => {
            //     const inserted_data = proposal.toJSON();
            //     if (req.headers['x-xsrf-token']) {
            //         const user_id = getLoggedUserID(req.headers['x-xsrf-token']);
            //         if (user_id !== null && user_id > 0) {
            //             if (inserted_data.proposal_status != 1) {
            //                 let log_data = {
            //                     user_id: user_id,
            //                     type: logType['proposal'],
            //                     action: '',
            //                     data_id: inserted_data.id
            //                 }
            //                 if (inserted_data.proposal_status == 2) {
            //                     log_data.action = logAction['proposal_submit'];
            //                 }
            //                 if (inserted_data.proposal_status == 3) {
            //                     log_data.action = logAction['proposal_sign'];
            //                 }
            //                 if (inserted_data.proposal_status == 4) {
            //                     log_data.action = logAction['proposal_cancel'];
            //                 }
            //                 newlogdata(log_data);
            //             }
            //         }
            //     }
            //     res.json({
            //         error: false,
            //         data: inserted_data,
            //         message: 'This proposal is updated correctly.'
            //     })
            // })
            // .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            //     error: true,
            //     message: 'Proposal updating is failed !'
            // }))
        )
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function deleteitem(req, res) {
    Proposal.forge({ id: req.params.id })
        .fetch({ require: true })
        .then(unit => unit.destroy()
            .then(() => res.json({
                error: false,
                data: { message: 'Proposal deleted successfully.' }
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

export function updatestatusitem(req, res) {
    const {
        proposal_status
    } = req.body;
    Proposal.forge({ id: req.params.id })
        .fetch({ require: true })
        .then(proposal => proposal.save({
            proposal_status: proposal_status || proposal.get('proposal_status'),
        }, { hasTimestamps: true })
            .then(() => {
                const inserted_data = proposal.toJSON();
                if (req.headers['x-xsrf-token']) {
                    const user_id = getLoggedUserID(req.headers['x-xsrf-token']);
                    if (user_id !== null && user_id > 0) {
                        if (inserted_data.proposal_status != 1) {
                            let log_data = {
                                user_id: user_id,
                                type: logType['proposal'],
                                action: '',
                                data_id: inserted_data.id
                            }
                            if (inserted_data.proposal_status == 2) {
                                log_data.action = logAction['proposal_submit'];
                            }
                            if (inserted_data.proposal_status == 3) {
                                log_data.action = logAction['proposal_sign'];
                            }
                            if (inserted_data.proposal_status == 4) {
                                log_data.action = logAction['proposal_cancel'];
                            }
                            newlogdata(log_data);
                        }
                    }
                }
                res.json({
                    error: false,
                    data: inserted_data,
                    message: 'Proposal Status is updated.'
                })
            })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message: 'Proposal Status updating is failed !'
            }))
        )
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function downloaddocx(req, res) {
    const { id } = req.query;
    const proposal_id = id;
    if (proposal_id > 0) {
        let query_builder = Proposal.forge();
        query_builder.query(function (qb) {
            qb.select('proposal.id AS proposal_id', 'proposal.*', 'clients.id AS client_id', 'clients.*', 'proposal.updated_at AS proposal_updated_at')
                .leftJoin('clients', 'proposal.client_id', 'clients.id');
            if (req.query.searchKeyword != '') {
                qb.where('proposal.id', '=', proposal_id);
            }

        }).fetch().then(proposal => {
            if (!proposal) {
                res.status(HttpStatus.NOT_FOUND).json({
                    error: true,
                    data: {}
                });
            } else {
                let proposal_item = proposal.toJSON();
                let unit_ids_str = proposal_item.unit_ids;
                let unit_ids_arr = unit_ids_str.split(',');
                console.log(unit_ids_arr);
                let unit_query_builder = Unit.forge();
                unit_query_builder.query(function (qb) {
                    for (let i = 0; i < unit_ids_arr.length; i++) {
                        qb.orWhere('id', '=', unit_ids_arr[i]);
                    }
                }).fetchAll().then(units => {
                    if (!units) {
                        res.status(HttpStatus.NOT_FOUND).json({
                            error: true,
                            data: {}
                        });
                    }
                    else {
                        proposal_item['proposal_unit_data'] = units.toJSON();
                        console.log(proposal_item);
                        proposal_item['total_service_charge'] = proposal_item['annual_building_service_charges'] + proposal_item['annual_community_service_charges'];
                        proposal_item['payment_frequency_str'] = payment_frequency[proposal_item['payment_frequency']];
                        let annual_increment_on_service_charges = parseFloat(proposal_item['annual_increment_on_service_charges']) * 0.01;
                        proposal_item['pricefeebreakdata'] = [{
                            index: 1,
                            base_rent: proposal_item['base_rent'],
                            bsc: proposal_item['annual_building_service_charges'],
                            mcsc: proposal_item['annual_community_service_charges'],
                            bsc_str: proposal_item['annual_building_service_charges'],
                            mcsc_str: proposal_item['annual_community_service_charges'],
                            total_rent: parseFloat(proposal_item['annual_building_service_charges']) + parseFloat(proposal_item['annual_community_service_charges']),
                            months: 12
                        }];
                        // for (let i = 1; i < parseInt(proposal_item['term_years']); i++) {
                        for (let i = 1; i < 5; i++) {
                            let pricefeebreakitem = {
                                index: i + 1,
                                base_rent: proposal_item['base_rent'],
                                bsc: proposal_item['pricefeebreakdata'][i - 1].bsc + proposal_item['pricefeebreakdata'][i - 1].bsc * annual_increment_on_service_charges,
                                mcsc: proposal_item['pricefeebreakdata'][i - 1].mcsc + proposal_item['pricefeebreakdata'][i - 1].mcsc * annual_increment_on_service_charges,
                                total_rent: parseFloat(proposal_item['annual_building_service_charges']) + parseFloat(proposal_item['annual_community_service_charges']),
                                months: proposal_item['pricefeebreakdata'][i - 1].months + 12,
                            }
                            pricefeebreakitem.bsc_str = parseFloat(pricefeebreakitem.bsc).toFixed(2);
                            pricefeebreakitem.mcsc_str = parseFloat(pricefeebreakitem.mcsc).toFixed(2);
                            proposal_item['pricefeebreakdata'].push(pricefeebreakitem);
                        }
                        //Load the docx file as a binary
                        var content = fs.readFileSync(path.resolve(__dirname, '../../templates/proposaldetail_template.docx'), 'binary');
                        var zip = new PizZip(content);
                        var doc = new Docxtemplater();
                        doc.loadZip(zip);

                        doc.setData(proposal_item);

                        try {
                            // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                            doc.render()
                        }
                        catch (error) {
                            var e = {
                                message: error.message,
                                name: error.name,
                                stack: error.stack,
                                properties: error.properties,
                            }
                            console.log(JSON.stringify({ error: e }));
                            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                            throw error;
                        }
                        var buf = doc.getZip().generate({ type: 'nodebuffer' });
                        var dir = path.resolve(__dirname, '../../download');
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir);
                        }
                        // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
                        var download_filename = '../../download/proposal-detail-' + proposal_item.proposal_id + '.docx';
                        fs.writeFileSync(path.resolve(__dirname, download_filename), buf);
                        const file = path.resolve(__dirname, download_filename);
                        res.download(file); // Set disposition and send it.
                    }
                })
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

// https://www.npmjs.com/package/node-excel-export
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
        cellPending: {
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
        cellSigned: {
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
        cellCanceled: {
            fill: {
                fgColor: {
                    rgb: 'c43d4b'
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
        proposal_id: { // <- the key should match the actual data key
            displayName: 'ID', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 50 // <- width in pixels
        },
        client_name: { // <- the key should match the actual data key
            displayName: 'Client Name', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 120 // <- width in pixels
        },
        created_at: { // <- the key should match the actual data key
            displayName: 'Date', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 100 // <- width in pixels
        },
        base_rent: { // <- the key should match the actual data key
            displayName: 'Base Rent', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 90 // <- width in pixels
        },
        annual_community_service_charges: { // <- the key should match the actual data key
            displayName: 'Annual Community Service Charges: (SAR)', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 340 // <- width in pixels
        },
        annual_building_service_charges: { // <- the key should match the actual data key
            displayName: 'Annual Building Service Charges (SAR):', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 340 // <- width in pixels
        },
        annual_increment_on_service_charges: { // <- the key should match the actual data key
            displayName: 'Annual increment on service charge (%):', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 340 // <- width in pixels
        },
        proposal_status: { // <- the key should match the actual data key
            displayName: 'Status', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            cellStyle: function (value, row) { // <- style renderer function
                switch (row.proposal_status) {
                    case 'Pending':
                        return styles.cellPending;
                    case 'Signed':
                        return styles.cellSigned;
                    case 'Canceled':
                        return styles.cellCanceled;
                    default:
                        return {};
                }
            },
            width: 100 // <- width in pixels
        },
    }

    const { order_by_column, order_by_dir, criteria_status, criteria_user_id } = req.query;
    let searchKeyword = req.query.searchKeyword;
    searchKeyword = '%' + req.query.searchKeyword + '%';
    let query_builder = Proposal.forge();
    query_builder.query(function (qb) {
        qb.select('proposal.id AS proposal_id', 'proposal.*', 'clients.id AS client_id', 'clients.*', 'proposal.updated_at AS proposal_updated_at')
            .leftJoin('clients', 'proposal.client_id', 'clients.id');
        if (req.query.searchKeyword != '') {
            qb.where('company_name', 'LIKE', searchKeyword);
        }
        qb.orderBy(order_by_column, order_by_dir);

        if (criteria_status && criteria_status != 'null') {
            qb.where('proposal_status', '=', criteria_status);
        }

        if (criteria_user_id && criteria_user_id != 'null') {
            qb.where('proposal.client_id', '=', criteria_user_id);
        }
    })
        .fetchAll().then(proposallist => {
            const proposal_list = proposallist.toJSON();
            const dataset = [];
            for (let i = 0; i < proposal_list.length; i++) {
                let proposal_item = {
                    proposal_id: proposal_list[i].proposal_id,
                    client_name: proposal_list[i].company_name,
                    created_at: proposal_list[i].proposal_updated_at,
                    base_rent: proposal_list[i].base_rent,
                    annual_community_service_charges: proposal_list[i].annual_community_service_charges,
                    annual_building_service_charges: proposal_list[i].annual_building_service_charges,
                    annual_increment_on_service_charges: proposal_list[i].annual_increment_on_service_charges,
                }
                switch (proposal_list[i].proposal_status) {
                    case 1:
                        proposal_item.proposal_status = 'Draft';
                        break;
                    case 2:
                        proposal_item.proposal_status = 'Pending';
                        break;
                    case 3:
                        proposal_item.proposal_status = 'Signed';
                        break;
                    case 4:
                        proposal_item.proposal_status = 'Canceled';
                        break;
                    default:
                        proposal_item.proposal_status = 'Draft';
                        break;
                }
                dataset.push(proposal_item);
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
            res.attachment('proposallist.xlsx'); // This is sails.js specific (in general you need to set headers)
            return res.send(report);
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function downloadattachmentfile(req, res) {
    const { id } = req.query;
    const proposal_id = id;
    if (proposal_id > 0) {
        let query_builder = Proposal.forge({ id: proposal_id });
        query_builder.query(function (qb) {
            // qb.where('proposal.id', '=', proposal_id);
        }).fetch().then(proposal => {
            if (!proposal) {
                res.status(HttpStatus.NOT_FOUND).json({
                    error: true,
                    data: {}
                });
            } else {
                let proposal_item = proposal.toJSON();
                var download_filename = '../../download/proposalattachment/' + proposal_item.attachment_path;
                const file = path.resolve(__dirname, download_filename);
                res.download(file); // Set disposition and send it.
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