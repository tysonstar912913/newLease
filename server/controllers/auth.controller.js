import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import logger from '../config/winston';

/**
 * Returns jwt token if valid email and password is provided
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function login(req, res) {
    const { email, password } = req.body;
    User.query({
        where: { email: email },
    }).fetch().then(user => {
        if (user) {
            if (bcrypt.compareSync(password, user.get('password'))) {
                
                if (user.get('is_allowed') === 1 || user.get('is_allowed')) {
                    const token = jwt.sign({
                        id: user.get('id'),
                        email: user.get('email'),
                        first_name: user.get('first_name'),
                        last_name: user.get('last_name'),
                        status: user.get('status'),
                    }, process.env.TOKEN_SECRET_KEY);
    
                    res.json({
                        success: true,
                        token,
                        email: user.get('email')
                    });
                }
                else {
                    res.status(HttpStatus.UNAUTHORIZED).json({
                        success: false,
                        message: 'You are not allowed using this system.'
                    });
                }
            } else {
                logger.log('error', 'Authentication failed. Invalid password.');

                res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: 'Authentication failed. Invalid password.'
                });
            }
        } else {
            logger.log('error', 'Invalid username or password.');

            res.status(HttpStatus.UNAUTHORIZED).json({
                success: false, message: 'Invalid username or password.'
            });
        }
    });
}

export function resetpassword(req, res) {
    const { reset_password } = req.body;
    let is_password_reset = false;
    let crypted_password = "";
    if (reset_password != '') {
        is_password_reset = true;
        crypted_password = bcrypt.hashSync(reset_password, 10);
    }
    User.forge({ id: req.params.id })
        .fetch({ require: true })
        .then(user => user.save({
            password: is_password_reset ? crypted_password : user.get('password'),
        }, { hasTimestamps: true })
            .then(() => {
                const inserted_data = user.toJSON();
                res.json({
                    error: false,
                    data: inserted_data,
                    message: 'Your password is reseted correctly.'
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