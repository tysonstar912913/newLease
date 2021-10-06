import express from 'express';
import * as proposalCtrl from '../controllers/proposal.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: proposal manage
 */

router.route('/getclientlist').get((req, res) => {
    proposalCtrl.getclientlist(req, res);
});

router.route('/getunitlist').get((req, res) => {
    proposalCtrl.getunitlist(req, res);
});

router.route('/getwholeunitlist').get((req, res) => {
    proposalCtrl.getwholeunitlist(req, res);
});

router.route('/getuserlist').get((req, res) => {
    proposalCtrl.getuserlist(req, res);
});

router.route('/newitem').post((req, res) => {
    proposalCtrl.newitem(req, res);
});

router.route('/getlist').get((req, res) => {
    proposalCtrl.getlist(req, res);
});

router.route('/getitem').get((req, res) => {
    proposalCtrl.getitem(req, res);
});

router.route('/update/:id').put((req, res) => {
    proposalCtrl.updateitem(req, res);
});

// router.route('/update').post((req, res) => {
//     proposalCtrl.updateitem(req, res);
// });

router.route('/deleteitem/:id').delete((req, res) => {
    proposalCtrl.deleteitem(req, res);
});

router.route('/updatestatus/:id').put((req, res) => {
    proposalCtrl.updatestatusitem(req, res);
});

router.route('/downloaddocx').get((req, res) => {
    proposalCtrl.downloaddocx(req, res);
});

router.route('/downloadexcel').get((req, res) => {
    proposalCtrl.downloadexcel(req, res);
});

router.route('/downloadattachmentfile').get((req, res) => {
    proposalCtrl.downloadattachmentfile(req, res);
});

export default router;