import express from 'express';
import * as adminCtrl from '../controllers/admin.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: units manage
 *     description: units manage(create, read, update, delete)
 */

router.route('/newitem').post((req, res) => {
    adminCtrl.newitem(req, res);
});

router.route('/getlist').get((req, res) => {
    adminCtrl.getlist(req, res);
});

router.route('/getitem').get((req, res) => {
    adminCtrl.getitem(req, res);
});

router.route('/update/:id').put((req, res) => {
    adminCtrl.updateitem(req, res);
});

router.route('/deleteitem/:id').delete((req, res) => {
    adminCtrl.deleteitem(req, res);
});

export default router;