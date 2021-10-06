import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import Admin from '../models/admin.model';

/**
 * Returns inserting result if valid unit data is provided
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function newitem(req, res) {
    const { first_name, last_name, email, status } = req.body;
    const is_allowed = 1;
    const password = bcrypt.hashSync(req.body.password, 10);

    let count_query_builder = Admin.forge();
    count_query_builder = count_query_builder.query('where', 'email', '=', email);
    count_query_builder.count('id').then(function (total_count) {
        if (total_count > 0) {
            res.json({
                error: true,
                message: 'This email already exists.'
            })
        }
        else {
            Admin.forge({ first_name, last_name, email, password, status, is_allowed }, { hasTimestamps: true }).save()
                .then(unit => res.json({
                    error: false,
                    data: unit.toJSON(),
                    message: 'New user is inserted.'
                }))
                .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: err
                }));
        }
    })
}

export function getlist(req, res) {
    const { order_by_column, order_by_dir, limit_start_num, limit_count } = req.query;
    let searchKeyword = req.query.searchKeyword;
    searchKeyword = '%' + req.query.searchKeyword + '%';

    let count_query_builder = Admin.forge();
    count_query_builder.query(function (count_query_builder) {
        if (req.query.searchKeyword != '') {
            count_query_builder.where('first_name', 'LIKE', searchKeyword)
                .orWhere('last_name', 'LIKE', searchKeyword)
                .orWhere('email', 'LIKE', searchKeyword);
        }
    }).count('id').then(function (total_count) {
        let pageSize = 1;
        pageSize = parseInt(total_count / limit_count);
        if ((total_count % limit_count) == 0) {
            pageSize = parseInt(total_count / limit_count);
        }
        else {
            pageSize = parseInt(total_count / limit_count) + 1;
        }
        let query_builder = Admin.forge();
        query_builder.query(function (qb) {
            if (req.query.searchKeyword != '') {
                qb.where('first_name', 'LIKE', searchKeyword)
                    .orWhere('last_name', 'LIKE', searchKeyword)
                    .orWhere('email', 'LIKE', searchKeyword);
            }
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
    const user_id = req.query.id;
    if (user_id > 0) {
        Admin.forge({ id: user_id })
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
    const { first_name, last_name, email, status, id, is_allowed, reset_password } = req.body;
    let count_query_builder = Admin.forge();
    count_query_builder = count_query_builder.query('where', 'id', '!=', id);
    count_query_builder = count_query_builder.query('where', 'email', '=', email);
    count_query_builder.count('id').then(function (total_count) {
        if (total_count > 0) {
            res.json({
                error: true,
                message: 'This email already exists.'
            })
        }
        else {
            let is_password_reset = false;
            let crypted_password = "";
            if (reset_password != '') {
                is_password_reset = true;
                crypted_password = bcrypt.hashSync(reset_password, 10);
            }
            Admin.forge({ id: req.params.id })
                .fetch({ require: true })
                .then(unit => unit.save({
                    first_name: first_name || unit.get('first_name'),
                    last_name: last_name || unit.get('last_name'),
                    email: email || unit.get('email'),
                    status: status || unit.get('status'),
                    is_allowed: is_allowed || unit.get('is_allowed'),
                    password: is_password_reset ? crypted_password : unit.get('password'),
                }, { hasTimestamps: true })
                    .then(() => res.json({
                        error: false,
                        data: unit.toJSON(),
                        message: 'User is updated.'
                    }))
                    .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                        error: true,
                        // data: { message: err.message },
                        message: 'User is updated.'
                    }))
                )
                .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: err
                }));
        }
    })
}

export function deleteitem(req, res) {
    Admin.forge({ id: req.params.id })
        .fetch({ require: true })
        .then(unit => unit.destroy()
            .then(() => res.json({
                error: false,
                data: { message: 'User deleted successfully.' }
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