import express from 'express';
import * as leaseCtrl from '../controllers/lease.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: lease manage
 */

router.route('/getproposallist').get((req, res) => {
    leaseCtrl.getproposallist(req, res);
});

router.route('/newitem').post((req, res) => {
    leaseCtrl.newitem(req, res);
});

router.route('/getlist').get((req, res) => {
    leaseCtrl.getlist(req, res);
});

router.route('/getitem').get((req, res) => {
    leaseCtrl.getitem(req, res);
});

router.route('/update/:id').put((req, res) => {
    leaseCtrl.updateitem(req, res);
});

router.route('/deleteitem/:id').delete((req, res) => {
    leaseCtrl.deleteitem(req, res);
});

router.route('/updatestatus/:id').put((req, res) => {
    leaseCtrl.updatestatusitem(req, res);
});

router.route('/downloaddocx').get((req, res) => {
    leaseCtrl.downloaddocx(req, res);
});

router.route('/downloadexcel').get((req, res) => {
    leaseCtrl.downloadexcel(req, res);
});

router.route('/downloadattachmentfile').get((req, res) => {
    leaseCtrl.downloadattachmentfile(req, res);
});

export default router;