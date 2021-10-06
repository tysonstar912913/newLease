import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import Logs from '../models/logs.model';
/** 
* Type : target category
* 1: CLIENT
* 2: UNIT
* 3: PROPOSAL
* 4: LEASE
*/
export const logType = {
    client: 1,
    unit: 2,
    proposal: 3,
    lease: 4
};
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
export const logAction = {
    client_create: 'CLIENT_CREATE',
    client_update: 'CLIENT_UPDATE',
    unit_create: 'UNIT_CREATE',
    unit_update: 'UNIT_UPDATE',
    proposal_submit: 'PROPOSAL_SUBMIT',
    proposal_sign: 'PROPOSAL_SIGN',
    proposal_cancel: 'PROPOSAL_CANCEL',
    lease_submit: 'LEASE_SUBMIT',
    lease_sign: 'LEASE_SIGN',
    lease_cancel: 'LEASE_CANCEL'
};

export function getLoggedUserID(token) {
    console.log('toke -----------------> ', token);
    const userdata = jwt.decode(token);
    if (userdata && userdata.id) {
        console.log('userdata -----------------> ', userdata);
        return userdata.id;
    }
    return null;
}

export function newlogdata(log_data) {
    console.log('log_data_log_controller ------------> ', log_data);
    const { user_id, type, action, data_id } = log_data;
    Logs.forge({
        user_id,
        type,
        action,
        data_id
    }, { hasTimestamps: true }).save()
        .then(inserted_log => {
            console.log('inserted_log -------> ', inserted_log);
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function getloglist(req, res) {
    const { order_by_column, order_by_dir, type, data_id } = req.query;

    let query_builder = Logs.forge();
    query_builder.query(function (qb) {
        // qb.select('logs.*', 'users.*', 'logs.id as log_id', 'users.id as user_id').leftOuterJoin('users', 'users.id', 'logs.user_id');
        qb.select('logs.*', 'logs.id as log_id', 'users.id as user_id', 'users.first_name', 'users.last_name', 'users.email').from('logs')
            // .leftOuterJoin('users', 'users.id', 'logs.user_id');
            .innerJoin('users', 'users.id', 'logs.user_id');
        if (req.query.type > 0) {
            qb.where('type', '=', req.query.type);
        }
        if (req.query.data_id > 0) {
            qb.where('data_id', '=', req.query.data_id);
        }
        // qb.orderBy(order_by_column, order_by_dir).offset(limit_start_num * limit_count).limit(limit_count);
        qb.orderBy(order_by_column, order_by_dir);
    }).fetchAll()
        .then(loglist => res.json({
            error: false,
            success: true,
            data: loglist.toJSON()
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err
        }));
}

export function getdashboardlist(req, res) {
    const { order_by_column, order_by_dir, limit_start_num, limit_count, user_id } = req.query;
    
    let count_query_builder = Logs.forge();
    count_query_builder.query(function (count_query_builder) {
        // count_query_builder.select('logs.*', 'users.id as user_id', 'users.first_name', 'users.last_name', 
        // 'users.email', 'logs.id as log_id').from('logs')
        count_query_builder.select().from('logs')
            // .innerJoin('users', 'users.id', 'logs.user_id');
            .leftJoin('users', 'users.id', 'logs.user_id');

        if (user_id) {
            count_query_builder.where('logs.user_id', '=', user_id);
        }
    }).count('logs.id').then(function (total_count) {
        let pageSize = 1;
        pageSize = parseInt(total_count / limit_count);
        if ((total_count % limit_count) == 0) {
            pageSize = parseInt(total_count / limit_count);
        }
        else {
            pageSize = parseInt(total_count / limit_count) + 1;
        }

        let query_builder = Logs.forge();
        query_builder.query(function (qb) {
            qb.select('logs.*', 'users.id as user_id', 'users.first_name', 'users.last_name', 'users.email', 'logs.id as log_id').from('logs')
                .innerJoin('users', 'users.id', 'logs.user_id');

            if (user_id) {
                qb.where('logs.user_id', '=', user_id);
            }
            qb.orderBy(order_by_column, order_by_dir).offset(limit_start_num * limit_count).limit(limit_count);
        }).fetchAll()
            .then(logdashboardlist => res.json({
                total_count: total_count,
                pageSize: pageSize,
                error: false,
                success: true,
                data: logdashboardlist.toJSON()
            }))
            .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: err
            }));
    })

    // let query_builder = Logs.forge();
    // query_builder.query(function (qb) {
    //     // qb.select('logs.*', 'users.*', 'logs.id as log_id', 'users.id as user_id').leftOuterJoin('users', 'users.id', 'logs.user_id');
    //     qb.select('logs.*', 'users.id as user_id', 'users.first_name', 'users.last_name', 'users.email', 'logs.id as log_id').from('logs')
    //         // .leftOuterJoin('users', 'users.id', 'logs.user_id');
    //         .innerJoin('users', 'users.id', 'logs.user_id');
    //     // qb.orderBy(order_by_column, order_by_dir).offset(limit_start_num * limit_count).limit(limit_count);
    //     qb.orderBy(order_by_column, order_by_dir).offset(0).limit(20);
    // }).fetchAll()
    //     .then(logdashboardlist => res.json({
    //         error: false,
    //         success: true,
    //         data: logdashboardlist.toJSON()
    //     }))
    //     .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //         error: err
    //     }));
}