import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Lease from '../models/lease.model';
import Proposal from '../models/proposal.model';
import Client from '../models/clients.model';
import Unit from '../models/units.model';
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

function convertISOtoDate(datetime) {
    const parseTimestamp = Date.parse(datetime);
    const timestamp = new Date(parseTimestamp);
    let month = parseInt(timestamp.getMonth()) + 1;
    let retVal = month + '/' + timestamp.getDate() + '/' + timestamp.getFullYear();
    return retVal;
}

export function getproposallist(req, res) {
    let query_builder = Proposal.forge();
    query_builder.query(function (qb) {
        qb.select('proposal.id AS proposal_id', 'proposal.*', 'clients.id AS client_id', 'clients.*', 'proposal.updated_at AS proposal_updated_at').leftJoin('clients', 'proposal.client_id', 'clients.id');
        if (true || req.query.searchKeyword != '') {
            // search_key_getproposallist_inleasenewpage
            qb.where('proposal_status', '=', '3');
        }

        // qb.orderBy(order_by_column, order_by_dir).offset(limit_start_num * limit_count).limit(limit_count);
    }).fetchAll()
        .then(proposallist => {
            let proposal_list = proposallist.toJSON();
            let retVal = [];
            let index = 1;
            for (let i = 0; i < proposal_list.length; i++) {
                let proposal_item = {
                    proposal_id: proposal_list[i].proposal_id,
                    value: proposal_list[i].proposal_id,
                }
                let label = proposal_list[i].proposal_id + ' - ' + proposal_list[i].company_name + ' - ' + convertISOtoDate(proposal_list[i].proposal_updated_at);
                proposal_item.label = label;
                retVal.push(proposal_item);
                index++;
            }
            res.json({
                error: false,
                success: true,
                data: retVal
            })
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function newitem(req, res) {
    const {
        proposal_id, effective_date, commencement_date, term_years, allocated_car_parks, unallocated_car_parks, base_rent, escalation_rate, security_deposit, total_design_review_fee, annual_community_service_charges, annual_building_service_charges, annual_increment_on_service_charges, payment_frequency, rent_free_period, performance_bond_amount, reinstatement_condition, permitted_useof_premises, lease_status, attachment_path, create_lease_user_id
    } = req.body;

    Lease.forge({ proposal_id, effective_date, commencement_date, term_years, allocated_car_parks, unallocated_car_parks, base_rent, escalation_rate, security_deposit, total_design_review_fee, annual_community_service_charges, annual_building_service_charges, annual_increment_on_service_charges, payment_frequency, rent_free_period, performance_bond_amount, reinstatement_condition, permitted_useof_premises, lease_status, attachment_path, create_lease_user_id }, { hasTimestamps: true }).save()
        // .then(proposal => res.json({
        //     error: false,
        //     data: proposal.toJSON(),
        //     message: 'New lease is inserted.'
        // }))
        .then(lease => {
            const inserted_data = lease.toJSON();
            if (req.headers['x-xsrf-token']) {
                const user_id = getLoggedUserID(req.headers['x-xsrf-token']);
                if (user_id !== null && user_id > 0) {
                    if (inserted_data.lease_status != 1) {
                        let log_data = {
                            user_id: user_id,
                            type: logType['lease'],
                            action: '',
                            data_id: inserted_data.id
                        }
                        if (inserted_data.lease_status == 2) {
                            log_data.action = logAction['lease_submit'];
                        }
                        if (inserted_data.lease_status == 3) {
                            log_data.action = logAction['lease_sign'];
                        }
                        if (inserted_data.lease_status == 4) {
                            log_data.action = logAction['lease_cancel'];
                        }
                        newlogdata(log_data);
                    }
                }
            }
            res.json({
                error: false,
                data: inserted_data,
                message: 'New lease is created.'
            })
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function getlist(req, res) {
    const { order_by_column, order_by_dir, limit_start_num, limit_count, criteria_status, criteria_user_id, criteria_create_user_id } = req.query;
    let searchKeyword = req.query.searchKeyword;
    searchKeyword = '%' + req.query.searchKeyword + '%';

    let count_query_builder = Lease.forge();
    count_query_builder.query(function (count_query_builder) {
        count_query_builder.select()
            .leftJoin('proposal', 'proposal.id', 'lease.proposal_id')
            .leftJoin('clients', 'proposal.client_id', 'clients.id');
        if (req.query.searchKeyword != '') {
            count_query_builder.where('company_name', 'LIKE', searchKeyword);
        }

        if (criteria_status) {
            count_query_builder.where('lease_status', '=', criteria_status);
        }

        if (criteria_user_id) {
            count_query_builder.where('proposal.client_id', '=', criteria_user_id);
        }

        if (criteria_create_user_id) {
            count_query_builder.where('create_lease_user_id', '=', criteria_create_user_id);
        }
    }).count('lease.id').then(function (total_count) {
        let pageSize = 1;
        pageSize = parseInt(total_count / limit_count);
        if ((total_count % limit_count) == 0) {
            pageSize = parseInt(total_count / limit_count);
        }
        else {
            pageSize = parseInt(total_count / limit_count) + 1;
        }
        let query_builder = Lease.forge();
        query_builder.query(function (qb) {
            qb.select('lease.id AS lease_id', 'lease.*', 'proposal.id AS proposal_id', 'proposal.*', 'clients.id AS client_id', 'clients.*', 'lease.updated_at AS lease_updated_at')
                .leftJoin('proposal', 'proposal.id', 'lease.proposal_id')
                .leftJoin('clients', 'proposal.client_id', 'clients.id');
            if (req.query.searchKeyword != '') {
                qb.where('company_name', 'LIKE', searchKeyword);
            }
            if (criteria_status) {
                qb.where('lease_status', '=', criteria_status);
            }

            if (criteria_user_id) {
                qb.where('proposal.client_id', '=', criteria_user_id);
            }

            if (criteria_create_user_id) {
                qb.where('create_lease_user_id', '=', criteria_create_user_id);
            }
            qb.orderBy(order_by_column, order_by_dir).offset(limit_start_num * limit_count).limit(limit_count);
        })
            .fetchAll()
            .then(leaselist => res.json({
                total_count: total_count,
                pageSize: pageSize,
                error: false,
                success: true,
                data: leaselist.toJSON()
            }))
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: err
            }));
    })
}

export function getitem(req, res) {
    const lease_id = req.query.id;
    if (lease_id > 0) {
        let query_builder = Lease.forge();
        query_builder.query(function (qb) {
            // qb.select('lease.id AS lease_id', 'lease.*', 'proposal.id AS proposal_id', 'proposal.*', 'clients.id AS client_id', 'clients.*', 'lease.updated_at AS lease_updated_at')
            qb.select('lease.id',
            'lease.id as lease_id',
            'lease.proposal_id',
            'lease.effective_date',
            'lease.commencement_date',
            'lease.term_years',
            'lease.allocated_car_parks',
            'lease.unallocated_car_parks',
            'lease.base_rent',
            'lease.escalation_rate',
            'lease.security_deposit',
            'lease.total_design_review_fee',
            'lease.annual_community_service_charges',
            'lease.annual_building_service_charges',
            'lease.annual_increment_on_service_charges',
            'lease.rent_free_period',
            'lease.payment_frequency',
            'lease.performance_bond_amount',
            'lease.reinstatement_condition',
            'lease.permitted_useof_premises',
            'lease.lease_status',
            'lease.created_at',
            'lease.updated_at AS lease_updated_at',
            'lease.attachment_path',
            'lease.create_lease_user_id',
            'proposal.unit_ids', 
            'clients.id AS client_id',
            'clients.company_name'
            // 'clients.*'
            )
                .leftJoin('proposal', 'proposal.id', 'lease.proposal_id')
                .leftJoin('clients', 'proposal.client_id', 'clients.id');
            if (req.query.searchKeyword != '') {
                qb.where('lease.id', '=', lease_id);
            }
        }).fetch().then(lease => {
            if (!lease) {
                res.status(HttpStatus.NOT_FOUND).json({
                    error: true,
                    data: {}
                });
            } else {
                let lease_item = lease.toJSON();
                let unit_ids_str = lease_item.unit_ids;
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
                        var attachment_file_name = '../../download/leaseattachment/' + lease_item.attachment_path;
                        const attachment_file_path = path.resolve(__dirname, attachment_file_name);
                        try {
                            if (fs.existsSync(attachment_file_path)) {
                                //file exists
                                lease_item['is_existattachmentfile'] = true;
                            }
                            else {
                                lease_item['is_existattachmentfile'] = false;
                            }
                        } catch (err) {
                            console.error(err)
                            lease_item['is_existattachmentfile'] = false;
                        }
                        lease_item['proposal_unit_data'] = units.toJSON();
                        res.json({
                            error: false,
                            data: lease_item
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
    const {
        proposal_id, effective_date, commencement_date, term_years, allocated_car_parks, unallocated_car_parks, base_rent, escalation_rate, security_deposit, total_design_review_fee, annual_community_service_charges, annual_building_service_charges, annual_increment_on_service_charges, payment_frequency, rent_free_period, performance_bond_amount, reinstatement_condition, permitted_useof_premises, lease_status
    } = req.body;
    Lease.forge({ id: req.params.id })
        .fetch({ require: true })
        .then(lease => lease.save({
            proposal_id: proposal_id || lease.get('proposal_id'),
            effective_date: effective_date || lease.get('effective_date'),
            commencement_date: commencement_date || lease.get('commencement_date'),
            term_years: term_years || lease.get('term_years'),
            allocated_car_parks: allocated_car_parks || lease.get('allocated_car_parks'),
            unallocated_car_parks: unallocated_car_parks || lease.get('unallocated_car_parks'),
            base_rent: base_rent || lease.get('base_rent'),
            escalation_rate: escalation_rate || lease.get('escalation_rate'),
            security_deposit: security_deposit || lease.get('security_deposit'),
            total_design_review_fee: total_design_review_fee || lease.get('total_design_review_fee'),
            annual_community_service_charges: annual_community_service_charges || lease.get('annual_community_service_charges'),
            annual_building_service_charges: annual_building_service_charges || lease.get('annual_building_service_charges'),
            annual_increment_on_service_charges: annual_increment_on_service_charges || lease.get('annual_increment_on_service_charges'),
            payment_frequency: payment_frequency || lease.get('payment_frequency'),
            rent_free_period: rent_free_period || lease.get('rent_free_period'),
            performance_bond_amount: performance_bond_amount || lease.get('performance_bond_amount'),
            reinstatement_condition: reinstatement_condition || lease.get('reinstatement_condition'),
            permitted_useof_premises: permitted_useof_premises || lease.get('permitted_useof_premises'),
            lease_status: lease_status || lease.get('lease_status'),
        }, { hasTimestamps: true })
            // .then(() => res.json({
            //     error: false,
            //     data: lease.toJSON(),
            //     message: 'Lease is updated.'
            // }))
            .then(() => {
                const inserted_data = lease.toJSON();
                if (req.headers['x-xsrf-token']) {
                    const user_id = getLoggedUserID(req.headers['x-xsrf-token']);
                    if (user_id !== null && user_id > 0) {
                        if (inserted_data.lease_status != 1) {
                            let log_data = {
                                user_id: user_id,
                                type: logType['lease'],
                                action: '',
                                data_id: inserted_data.id
                            }
                            if (inserted_data.lease_status == 2) {
                                log_data.action = logAction['lease_submit'];
                            }
                            if (inserted_data.lease_status == 3) {
                                log_data.action = logAction['lease_sign'];
                            }
                            if (inserted_data.lease_status == 4) {
                                log_data.action = logAction['lease_cancel'];
                            }
                            newlogdata(log_data);
                        }
                    }
                }
                res.json({
                    error: false,
                    data: inserted_data,
                    message: 'This lease is updated correctly.'
                })
            })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message: 'Lease updating is failed !'
            }))
        )
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function deleteitem(req, res) {
    Lease.forge({ id: req.params.id })
        .fetch({ require: true })
        .then(lease => lease.destroy()
            .then(() => res.json({
                error: false,
                data: { message: 'Lease deleted successfully.' }
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
        proposal_id, lease_status
    } = req.body;
    Lease.forge({ id: req.params.id })
        .fetch({ require: true })
        .then(lease => lease.save({
            lease_status: lease_status || lease.get('lease_status'),
        }, { hasTimestamps: true })
            .then(() => {
                // search-key : search_key_leasestatus2proposalstatus
                // Proposal.forge({ id: proposal_id })
                //     .fetch({ require: true })
                //     .then(proposal => proposal.save({
                //         proposal_status: lease_status || lease.get('proposal_status'),
                //     }, { hasTimestamps: true })
                //         .then(() => {
                //             // res.json({
                //             //     error: false,
                //             //     data: lease.toJSON(),
                //             //     message: 'Lease is updated.'
                //             // })
                //         })
                //         .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                //             error: true,
                //             message: 'Status updating is failed !'
                //         }))
                //     )
                //     .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                //         error: err
                //     }));

                const inserted_data = lease.toJSON();
                if (req.headers['x-xsrf-token']) {
                    const user_id = getLoggedUserID(req.headers['x-xsrf-token']);
                    if (user_id !== null && user_id > 0) {
                        if (inserted_data.lease_status != 1) {
                            let log_data = {
                                user_id: user_id,
                                type: logType['lease'],
                                action: '',
                                data_id: inserted_data.id
                            }
                            if (inserted_data.lease_status == 2) {
                                log_data.action = logAction['lease_submit'];
                            }
                            if (inserted_data.lease_status == 3) {
                                log_data.action = logAction['lease_sign'];
                            }
                            if (inserted_data.lease_status == 4) {
                                log_data.action = logAction['lease_cancel'];
                            }
                            newlogdata(log_data);
                        }
                    }
                }
                res.json({
                    error: false,
                    data: inserted_data,
                    message: 'Lease Status is updated.'
                })
            })
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message: 'Lease Status updating is failed !'
            }))
        )
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function downloaddocx(req, res) {
    const { id } = req.query;
    const lease_id = id;
    if (lease_id > 0) {
        let query_builder = Lease.forge();
        query_builder.query(function (qb) {
            qb.select('lease.id AS lease_id', 'lease.*', 'proposal.id AS proposal_id', 'unit_ids', 'clients.id AS client_id', 'clients.*', 'lease.updated_at AS lease_updated_at')
                .leftJoin('proposal', 'proposal.id', 'lease.proposal_id')
                .leftJoin('clients', 'proposal.client_id', 'clients.id');
            if (req.query.searchKeyword != '') {
                qb.where('lease.id', '=', lease_id);
            }
        }).fetch().then(lease => {
            if (!lease) {
                res.status(HttpStatus.NOT_FOUND).json({
                    error: true,
                    data: {}
                });
            } else {
                let lease_item = lease.toJSON();
                let unit_ids_str = lease_item.unit_ids;
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
                        lease_item['proposal_unit_data'] = units.toJSON();
                        console.log(lease_item);
                        lease_item['total_service_charge'] = lease_item['annual_building_service_charges'] + lease_item['annual_community_service_charges'];
                        let annual_increment_on_service_charges = parseFloat(lease_item['annual_increment_on_service_charges']) * 0.01;
                        lease_item['pricefeebreakdata'] = [{
                            index: 1,
                            base_rent: lease_item['base_rent'],
                            base_rent_year: lease_item['base_rent'] * 12,
                            bsc: lease_item['annual_building_service_charges'],
                            bsc_str: lease_item['annual_building_service_charges'],
                            bsc_str_year: lease_item['annual_building_service_charges'] * 12,
                            mcsc: lease_item['annual_community_service_charges'],
                            mcsc_str: lease_item['annual_community_service_charges'],
                            mcsc_str_year: lease_item['annual_community_service_charges'] * 12,
                            total_rent: parseFloat(lease_item['annual_building_service_charges']) + parseFloat(lease_item['annual_community_service_charges']),
                            months: 12
                        }];
                        for (let i = 1; i < parseInt(lease_item['term_years']); i++) {
                            let pricefeebreakitem = {
                                index: i + 1,
                                base_rent: lease_item['base_rent'],
                                base_rent_year: lease_item['base_rent'] * 12,
                                bsc: lease_item['pricefeebreakdata'][i - 1].bsc + lease_item['pricefeebreakdata'][i - 1].bsc * annual_increment_on_service_charges,
                                mcsc: lease_item['pricefeebreakdata'][i - 1].mcsc + lease_item['pricefeebreakdata'][i - 1].mcsc * annual_increment_on_service_charges,
                                // total_rent: parseFloat(lease_item['annual_building_service_charges']) + parseFloat(lease_item['annual_community_service_charges']),
                                months: lease_item['pricefeebreakdata'][i - 1].months + 12,
                            }
                            pricefeebreakitem.bsc_str = parseFloat(pricefeebreakitem.bsc).toFixed(2);
                            pricefeebreakitem.bsc_str_year = parseFloat(pricefeebreakitem.bsc * 12).toFixed(2);
                            pricefeebreakitem.mcsc_str = parseFloat(pricefeebreakitem.mcsc).toFixed(2);
                            pricefeebreakitem.mcsc_str_year = parseFloat(pricefeebreakitem.mcsc * 12).toFixed(2);
                            pricefeebreakitem.total_rent = parseFloat(pricefeebreakitem.bsc + pricefeebreakitem.mcsc).toFixed(2);
                            lease_item['pricefeebreakdata'].push(pricefeebreakitem);
                        }
                        //Load the docx file as a binary
                        var content = fs.readFileSync(path.resolve(__dirname, '../../templates/leasedetail_template.docx'), 'binary');
                        var zip = new PizZip(content);
                        var doc = new Docxtemplater();
                        doc.loadZip(zip);

                        doc.setData(lease_item);

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
                        var download_filename = '../../download/lease-detail-' + lease_item.lease_id + '.docx';
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
        lease_id: { // <- the key should match the actual data key
            displayName: 'ID', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 50 // <- width in pixels
        },
        client_name: { // <- the key should match the actual data key
            displayName: 'Client Name', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 120 // <- width in pixels
        },
        // created_at: { // <- the key should match the actual data key
        //     displayName: 'Date', // <- Here you specify the column header
        //     headerStyle: styles.headerDark, // <- Header style
        //     width: 100 // <- width in pixels
        // },

        effective_date: { // <- the key should match the actual data key
            displayName: 'Effective Date', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 100 // <- width in pixels
        },
        commencement_date: { // <- the key should match the actual data key
            displayName: 'Commencement Date', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 100 // <- width in pixels
        },
        term_years: { // <- the key should match the actual data key
            displayName: 'Term Years', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 100 // <- width in pixels
        },
        allocated_car_parks: { // <- the key should match the actual data key
            displayName: 'allocated car parks', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 100 // <- width in pixels
        },
        unallocated_car_parks: { // <- the key should match the actual data key
            displayName: 'unallocated car parks', // <- Here you specify the column header
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
        escalation_rate: { // <- the key should match the actual data key
            displayName: 'escalation rate', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 100 // <- width in pixels
        },
        security_deposit: { // <- the key should match the actual data key
            displayName: 'security deposit', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 100 // <- width in pixels
        },
        total_design_review_fee: { // <- the key should match the actual data key
            displayName: 'total design review_fee', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 100 // <- width in pixels
        },
        rent_free_period: { // <- the key should match the actual data key
            displayName: 'rent free period', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 100 // <- width in pixels
        },
        permitted_useof_premises: { // <- the key should match the actual data key
            displayName: 'permitted use of premises', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 100 // <- width in pixels
        },
        lease_status: { // <- the key should match the actual data key
            displayName: 'Status', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            cellStyle: function (value, row) { // <- style renderer function
                switch (row.lease_status) {
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
    let query_builder = Lease.forge();
    query_builder.query(function (qb) {
        qb.select('lease.id AS lease_id', 'lease.*', 'proposal.id AS proposal_id', 'proposal.*', 'clients.id AS client_id', 'clients.*', 'lease.updated_at AS lease_updated_at')
            .leftJoin('proposal', 'proposal.id', 'lease.proposal_id')
            .leftJoin('clients', 'proposal.client_id', 'clients.id');
        if (req.query.searchKeyword != '') {
            qb.where('company_name', 'LIKE', searchKeyword);
        }
        qb.orderBy(order_by_column, order_by_dir);

        if (criteria_status && criteria_status != 'null') {
            qb.where('lease_status', '=', criteria_status);
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
                    lease_id: proposal_list[i].lease_id,
                    client_name: proposal_list[i].company_name,
                    effective_date: proposal_list[i].effective_date,
                    commencement_date: proposal_list[i].commencement_date,
                    term_years: proposal_list[i].term_years,
                    allocated_car_parks: proposal_list[i].allocated_car_parks,
                    unallocated_car_parks: proposal_list[i].unallocated_car_parks,
                    base_rent: proposal_list[i].base_rent,
                    annual_community_service_charges: proposal_list[i].annual_community_service_charges,
                    annual_building_service_charges: proposal_list[i].annual_building_service_charges,
                    annual_increment_on_service_charges: proposal_list[i].annual_increment_on_service_charges,
                    
                    escalation_rate: proposal_list[i].escalation_rate,
                    security_deposit: proposal_list[i].security_deposit,
                    total_design_review_fee: proposal_list[i].total_design_review_fee,
                    rent_free_period: proposal_list[i].rent_free_period,
                    permitted_useof_premises: proposal_list[i].permitted_useof_premises,
                }
                switch (proposal_list[i].lease_status) {
                    case 1:
                        proposal_item.lease_status = 'Draft';
                        break;
                    case 2:
                        proposal_item.lease_status = 'Pending';
                        break;
                    case 3:
                        proposal_item.lease_status = 'Signed';
                        break;
                    case 4:
                        proposal_item.lease_status = 'Canceled';
                        break;
                    default:
                        proposal_item.lease_status = 'Draft';
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
            res.attachment('leaselist.xlsx'); // This is sails.js specific (in general you need to set headers)
            return res.send(report);
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function downloadattachmentfile(req, res) {
    const { id } = req.query;
    const lease_id = id;
    if (lease_id > 0) {
        let query_builder = Lease.forge({ id: lease_id });
        query_builder.query(function (qb) {}).fetch().then(lease => {
            if (!lease) {
                res.status(HttpStatus.NOT_FOUND).json({
                    error: true,
                    data: {}
                });
            } else {
                let lease_item = lease.toJSON();
                var download_filename = '../../download/leaseattachment/' + lease_item.attachment_path;
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