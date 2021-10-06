import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Clients from '../models/clients.model';
import { logType, logAction, getLoggedUserID, newlogdata } from './logs.controller';
import knex from '../config/knex';

/****** DOWNLOAD EXCEL ******/
const excel = require('node-excel-export');
/****** DOWNLOAD EXCEL ******/

/**
 * Returns inserting result if valid client data is provided
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function newclient(req, res) {
    const { address, client_status, client_type, company_name, company_name_ar, cr_number, vat_rno, contact_person_name, contact_person_pos, contact_person_phone, is_active } = req.body;

    Clients.forge({
        company_name,
        company_name_ar,
        cr_number,
        vat_rno,
        address,
        client_type,
        client_status,
        contact_person_name,
        contact_person_pos,
        contact_person_phone,
        is_active,
    }, { hasTimestamps: true }).save()
        .then(client => {
            const inserted_data = client.toJSON();
            if (req.headers['x-xsrf-token']) {
                const user_id = getLoggedUserID(req.headers['x-xsrf-token']);
                if (user_id !== null && user_id > 0) {
                    let log_data = {
                        user_id: user_id,
                        type: logType['client'],
                        action: logAction['client_create'],
                        data_id: inserted_data.id
                    }
                    newlogdata(log_data);
                }
            }
            res.json({
                error: false,
                data: inserted_data,
                message: 'New client is created.'
            })
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function getlist(req, res) {
    const { order_by_column, order_by_dir, limit_start_num, limit_count } = req.query;
    let searchKeyword = req.query.searchKeyword;

    let count_query_builder = Clients.forge();
    searchKeyword = '%' + req.query.searchKeyword + '%';
    count_query_builder = count_query_builder.query('where', 'company_name', 'LIKE', searchKeyword);
    count_query_builder.count('id').then(function (total_count) {
        let pageSize = 1;
        pageSize = parseInt(total_count / limit_count);
        if ((total_count % limit_count) == 0) {
            pageSize = parseInt(total_count / limit_count);
        }
        else {
            pageSize = parseInt(total_count / limit_count) + 1;
        }

        let query_builder = Clients.forge();
        var client_id_colid = knex.ref('clients.id'); // <-- [1]
        var subquery1 = knex('proposal').count('*')
            .where('client_id', client_id_colid).as('client_count_in_proposal');

        query_builder = query_builder.query('where', 'company_name', 'LIKE', searchKeyword);
        query_builder.query(function (qb) {
            qb.select('*', subquery1);
            qb.orderBy(order_by_column, order_by_dir).offset(limit_start_num * limit_count).limit(limit_count);
        }).fetchAll()
            .then(clientlist => res.json({
                total_count: total_count,
                pageSize: pageSize,
                error: false,
                success: true,
                data: clientlist.toJSON()
            }))
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: err
            }));
    })
}

export function getitem(req, res) {
    const client_id = req.query.id;
    console.log(client_id);
    if (client_id > 0) {
        Clients.forge({ id: client_id })
            .fetch()
            .then(client => {
                if (!client) {
                    res.status(HttpStatus.NOT_FOUND).json({
                        error: true,
                        data: {}
                    });
                } else {
                    res.json({
                        error: false,
                        data: client.toJSON()
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
    Clients.forge({ id: req.params.id })
        .fetch({ require: true })
        .then(client => client.save({
            company_name: req.body.company_name || client.get('company_name'),
            company_name_ar: req.body.company_name_ar || client.get('company_name_ar'),
            cr_number: req.body.cr_number || client.get('cr_number'),
            vat_rno: req.body.vat_rno || client.get('vat_rno'),
            address: req.body.address || client.get('address'),
            client_type: req.body.client_type || client.get('client_type'),
            client_status: req.body.client_status || client.get('client_status'),
            contact_person_name: req.body.contact_person_name || client.get('contact_person_name'),
            contact_person_pos: req.body.contact_person_pos || client.get('contact_person_pos'),
            contact_person_phone: req.body.contact_person_phone || client.get('contact_person_phone'),
            is_active: req.body.is_active || client.get('is_active'),
        }, { hasTimestamps: true })
            // .then(() => res.json({
            //     error: false,
            //     data: client.toJSON()
            // }))
            .then(() => {
                const inserted_data = client.toJSON();
                if (req.headers['x-xsrf-token']) {
                    const user_id = getLoggedUserID(req.headers['x-xsrf-token']);
                    if (user_id !== null && user_id > 0) {
                        let log_data = {
                            user_id: user_id,
                            type: logType['client'],
                            action: logAction['client_update'],
                            data_id: inserted_data.id
                        }
                        newlogdata(log_data);
                    }
                }
                res.json({
                    error: false,
                    data: inserted_data,
                    message: 'This client is updated correctly.'
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
    Clients.forge({ id: req.params.id })
        .fetch({ require: true })
        .then(client => client.destroy()
            .then(() => res.json({
                error: false,
                data: { message: 'Client deleted successfully.' }
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
        company_name: { // <- the key should match the actual data key
            displayName: 'company_name', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 120 // <- width in pixels
        },
        company_name_ar: { // <- the key should match the actual data key
            displayName: 'Arabic Name', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 120 // <- width in pixels
        },
        cr_number: { // <- the key should match the actual data key
            displayName: 'CR Number', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 120 // <- width in pixels
        },
        vat_rno: { // <- the key should match the actual data key
            displayName: 'VAT RNO', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 120 // <- width in pixels
        },
        address: { // <- the key should match the actual data key
            displayName: 'Address', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 120 // <- width in pixels
        },
        created_at: { // <- the key should match the actual data key
            displayName: 'Join Date', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 120 // <- width in pixels
        },
        client_type: { // <- the key should match the actual data key
            displayName: 'client_type', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 120 // <- width in pixels
        },
        client_status: { // <- the key should match the actual data key
            displayName: 'client_status', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 120 // <- width in pixels
        },
    }

    const { order_by_column, order_by_dir } = req.query;
    let searchKeyword = req.query.searchKeyword;

    let query_builder = Clients.forge();
    searchKeyword = '%' + req.query.searchKeyword + '%';
    query_builder = query_builder.query('where', 'company_name', 'LIKE', searchKeyword);

    query_builder.query(function (qb) {
        qb.orderBy(order_by_column, order_by_dir);
    })
        .fetchAll().then(clientlist => {
            const client_list = clientlist.toJSON();
            const dataset = [];
            for (let i = 0; i < client_list.length; i++) {
                let client_item = {
                    id: client_list[i].id,
                    company_name: client_list[i].company_name,
                    company_name_ar: client_list[i].company_name_ar,
                    cr_number: client_list[i].cr_number,
                    vat_rno: client_list[i].vat_rno,
                    address: client_list[i].address,
                    created_at: client_list[i].created_at,
                }
                switch (client_list[i].client_status) {
                    case 1:
                        client_item.client_status = 'Client';
                        break;
                    case 2:
                        client_item.client_status = 'Prospect';
                        break;
                    default:
                        client_item.client_status = 'Client';
                        break;
                }
                switch (client_list[i].client_type) {
                    case 1:
                        client_item.client_type = 'Government';
                        break;
                    case 2:
                        client_item.client_type = 'Private';
                        break;
                    case 3:
                        client_item.client_type = 'Individual';
                        break;
                    default:
                        client_item.client_type = 'Government';
                        break;
                }
                dataset.push(client_item);
            }

            const report = excel.buildExport(
                [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                    {
                        name: 'Sheet', // <- Specify sheet name (optional)
                        specification: specification, // <- Report specification
                        data: dataset // <-- Report data
                    }
                ]
            );

            // You can then return this straight
            res.attachment('clientlist.xlsx'); // This is sails.js specific (in general you need to set headers)
            return res.send(report);
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}