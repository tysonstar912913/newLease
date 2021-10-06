import express from 'express';
import * as clientsCtrl from '../controllers/clients.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: clients manage
 *     description: clients manage(create, read, update, delete)
 */

router.route('/newclient').post((req, res) => {
    clientsCtrl.newclient(req, res);
});

router.route('/getlist').get((req, res) => {
    clientsCtrl.getlist(req, res);
});

router.route('/getitem').get((req, res) => {
    clientsCtrl.getitem(req, res);
});

router.route('/update/:id').put((req, res) => {
    clientsCtrl.updateitem(req, res);
});

router.route('/deleteitem/:id').delete((req, res) => {
    clientsCtrl.deleteitem(req, res);
});

router.route('/downloadexcel').get((req, res) => {
    clientsCtrl.downloadexcel(req, res);
});

export default router;