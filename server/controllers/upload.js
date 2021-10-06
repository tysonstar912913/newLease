const IncomingForm = require('formidable').IncomingForm;
var util = require('util');
var fspath = require('fs');
var path = require('path');
var fs = require('fs-extra');
import Proposal from '../models/proposal.model';
import Lease from '../models/lease.model';
import HttpStatus from 'http-status-codes';

export function uploadnewproposal(req, res) {
    var dir = path.resolve(__dirname, '../../download/');
    if (!fspath.existsSync(dir)) {
        fspath.mkdirSync(dir);
    }
    dir = path.resolve(__dirname, '../../download/proposalattachment');
    if (!fspath.existsSync(dir)) {
        fspath.mkdirSync(dir);
    }
    var form = new IncomingForm()
    form.maxFileSize = 1024 * 1024; //default maxFileSize is 1000MB
    form.uploadDir = './download/proposalattachment/'

    let rand_num = parseInt(Math.random() * 10000000000);
    form.parse(req)
    form.on('fileBegin', function (name, file) {
        let uploaded_filename = rand_num + '_' + file.name;
        file.path = form.uploadDir + uploaded_filename;
    })

    form.on('file', (field, file) => {
        let uploaded_filename = rand_num + '_' + file.name;
        res.json({
            error: false,
            uploadedfile: file,
            uploaded_filename: uploaded_filename,
            message: 'Attatchment File is uploaded.'
        })
    })
    form.on('end', () => {
        // res.json()
    })
}

export function uploadeditproposal(req, res) {
    const proposal_id = req.params.proposal_id;
    if (proposal_id > 0) {
        var dir = path.resolve(__dirname, '../../download/');
        if (!fspath.existsSync(dir)) {
            fspath.mkdirSync(dir);
        }
        dir = path.resolve(__dirname, '../../download/proposalattachment');
        if (!fspath.existsSync(dir)) {
            fspath.mkdirSync(dir);
        }
        var form = new IncomingForm()
        form.maxFileSize = 1024 * 1024; //default maxFileSize is 1000MB
        form.uploadDir = './download/proposalattachment/'

        form.parse(req)
        form.on('fileBegin', function (name, file) {
            let uploaded_filename = proposal_id + '_' + file.name;
            file.path = form.uploadDir + uploaded_filename;
        })

        form.on('file', (field, file) => {
            let attachment_path = proposal_id + '_' + file.name;
            Proposal.forge({ id: proposal_id })
                .fetch({ require: true })
                .then(proposal => proposal.save({
                    attachment_path: attachment_path || proposal.get('attachment_path'),
                }, { hasTimestamps: true })
                    .then(() => {
                        const updated_data = proposal.toJSON();
                        res.json({
                            error: false,
                            data: updated_data,
                            uploadedfile: file,
                            message: 'Attatchment File is uploaded.'
                        })
                    })
                    .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                        error: true,
                        message: 'Attatchment File upload is failed !'
                    }))
                )
                .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: err
                }));
        })
        form.on('end', () => {
            // res.json()
        })
    }
    else {
        res.json({
            error: true,
        })
    }
}

export function uploadnewleaseattatchfile(req, res) {
    var dir = path.resolve(__dirname, '../../download/');
    if (!fspath.existsSync(dir)) {
        fspath.mkdirSync(dir);
    }
    dir = path.resolve(__dirname, '../../download/leaseattachment');
    if (!fspath.existsSync(dir)) {
        fspath.mkdirSync(dir);
    }
    var form = new IncomingForm()
    form.maxFileSize = 1024 * 1024; //default maxFileSize is 1000MB
    form.uploadDir = './download/leaseattachment/'

    let rand_num = parseInt(Math.random() * 10000000000);
    form.parse(req)
    form.on('fileBegin', function (name, file) {
        let uploaded_filename = rand_num + '_' + file.name;
        file.path = form.uploadDir + uploaded_filename;
    })

    form.on('file', (field, file) => {
        let uploaded_filename = rand_num + '_' + file.name;
        res.json({
            error: false,
            uploadedfile: file,
            uploaded_filename: uploaded_filename,
            message: 'Attatchment File is uploaded.'
        })
    })
    form.on('end', () => {
        // res.json()
    })
}

export function uploadleaseattatchfile(req, res) {
    const lease_id = req.params.lease_id;
    if (lease_id > 0) {
        var dir = path.resolve(__dirname, '../../download/');
        if (!fspath.existsSync(dir)) {
            fspath.mkdirSync(dir);
        }
        dir = path.resolve(__dirname, '../../download/leaseattachment');
        if (!fspath.existsSync(dir)) {
            fspath.mkdirSync(dir);
        }
        var form = new IncomingForm()
        form.maxFileSize = 1024 * 1024; //default maxFileSize is 1000MB
        form.uploadDir = './download/leaseattachment/'

        form.parse(req)
        form.on('fileBegin', function (name, file) {
            let uploaded_filename = lease_id + '_' + file.name;
            file.path = form.uploadDir + uploaded_filename;
        })

        form.on('file', (field, file) => {
            let attachment_path = lease_id + '_' + file.name;
            Lease.forge({ id: lease_id })
                .fetch({ require: true })
                .then(lease => lease.save({
                    attachment_path: attachment_path || lease.get('attachment_path'),
                }, { hasTimestamps: true })
                    .then(() => {
                        const updated_data = lease.toJSON();
                        res.json({
                            error: false,
                            data: updated_data,
                            uploadedfile: file,
                            message: 'Attatchment File is uploaded.'
                        })
                    })
                    .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                        error: true,
                        message: 'Attatchment File upload is failed !'
                    }))
                )
                .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error: err
                }));
        })
        form.on('end', () => {
            // res.json()
        })
    }
    else {
        res.json({
            error: true,
        })
    }
}