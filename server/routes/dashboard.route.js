import express from 'express';
import * as dashboardCtrl from '../controllers/dashboard.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: dashboard manage
 *     description: units manage(create, read, update, delete)
 */

router.route('/getdashboarddata').get((req, res) => {
    dashboardCtrl.getdashboarddata(req, res);
});

router.route('/getdashboardproposalsdata').get((req, res) => {
    dashboardCtrl.getdashboardproposalsdata(req, res);
});

router.route('/getdashboardleasesdata').get((req, res) => {
    dashboardCtrl.getdashboardleasesdata(req, res);
});

router.route('/getdashboardunitdata').get((req, res) => {
    dashboardCtrl.getdashboardunitdata(req, res);
});

export default router;