import express from 'express';
import * as logsCtrl from '../controllers/logs.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: logs manage
 */

router.route('/getloglist').get((req, res) => {
    logsCtrl.getloglist(req, res);
});

router.route('/getdashboardlist').get((req, res) => {
    logsCtrl.getdashboardlist(req, res);
});

export default router;