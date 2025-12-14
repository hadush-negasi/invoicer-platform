import { Router } from 'express';
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getDashboardStats,
  sendInvoiceEmail,
} from '../controllers/invoiceController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = Router();

router.get('/stats', authenticate, getDashboardStats);
router.get('/', authenticate, getAllInvoices);
router.get('/:id', authenticate, getInvoiceById);
router.post('/', authenticate, createInvoice);
router.post('/:id/send-email', authenticate, sendInvoiceEmail);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), updateInvoice);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteInvoice);

export default router;

