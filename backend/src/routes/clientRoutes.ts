import { Router } from 'express';
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from '../controllers/clientController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = Router();

router.get('/', authenticate, getAllClients);
router.get('/:id', authenticate, getClientById);
router.post('/', authenticate, createClient);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), updateClient);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteClient);

export default router;

