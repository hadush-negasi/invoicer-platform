import { Router, Request, Response } from 'express';
import { getPublicInvoice } from '../controllers/publicInvoiceController';
import { createCheckoutSession } from '../controllers/stripeController';

const router = Router();

// Public routes - no authentication required
router.get('/invoice/:invoiceId', getPublicInvoice);
router.post('/invoice/:invoiceId/pay', (req: Request, res: Response) => {
  // Pass invoiceId from params to body for the controller
  req.body.invoiceId = req.params.invoiceId;
  createCheckoutSession(req, res);
});

export default router;

