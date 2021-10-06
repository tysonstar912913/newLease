import express from 'express';
import * as unitsCtrl from '../controllers/units.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: units manage
 *     description: units manage(create, read, update, delete)
 */

router.route('/newitem').post((req, res) => {
    unitsCtrl.newitem(req, res);
});

router.route('/getlist').get((req, res) => {
    unitsCtrl.getlist(req, res);
});

router.route('/getitem').get((req, res) => {
    unitsCtrl.getitem(req, res);
});

router.route('/update/:id').put((req, res) => {
    unitsCtrl.updateitem(req, res);
});

router.route('/deleteitem/:id').delete((req, res) => {
    unitsCtrl.deleteitem(req, res);
});

router.route('/downloadexcel').get((req, res) => {
    unitsCtrl.downloadexcel(req, res);
});

export default router;