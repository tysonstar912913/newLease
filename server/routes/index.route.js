import express from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import clientsRoutes from './clients.route';
import unitsRoutes from './units.route';
import adminRoutes from './admin.route';
import proposalRoutes from './proposal.route';
import leaseRoutes from './lease.route';
import dashboardRoutes from './dashboard.route';
import logsRoutes from './logs.route';

const router = express.Router();

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount user routes at /users
router.use('/users', userRoutes);

// mount client routes at /client
router.use('/clients', clientsRoutes);

// mount unit routes at /unit
router.use('/units', unitsRoutes);

// mount admin routes at /admin
router.use('/admin', adminRoutes);

// mount proposal routes at /proposal
router.use('/proposal', proposalRoutes);

// mount lease routes at /lease
router.use('/lease', leaseRoutes);

// mount lease routes at /lease
router.use('/dashboard', dashboardRoutes);

// mount logs routes at /logs
router.use('/logs', logsRoutes);

export default router;