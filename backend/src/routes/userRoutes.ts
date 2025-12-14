import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = Router();

// All user management routes require admin role
router.get('/', authenticate, authorize(UserRole.ADMIN), getAllUsers);
router.get('/:id', authenticate, authorize(UserRole.ADMIN), getUserById);
router.post('/', authenticate, authorize(UserRole.ADMIN), createUser);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), updateUser);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteUser);

export default router;


