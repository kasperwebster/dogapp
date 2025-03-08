import express from 'express';
import {
  getIncidents,
  getAllIncidents,
  getIncidentById,
  createIncident,
  updateIncidentStatus,
  deleteIncident,
  markHelpful,
} from '../controllers/incidents';
import { auth, adminOnly } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getIncidents);
router.get('/:id', getIncidentById);
router.post('/:id/helpful', markHelpful);

// Protected routes (requires authentication)
router.post('/', auth, createIncident);

// Admin routes
router.get('/admin/all', auth, adminOnly, getAllIncidents);
router.patch('/:id/status', auth, adminOnly, updateIncidentStatus);
router.delete('/:id', auth, adminOnly, deleteIncident);

export default router; 