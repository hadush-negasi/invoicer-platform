import { Router } from 'express';
import { createCheckoutSession, handleWebhook } from '../controllers/stripeController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/create-checkout-session', authenticate, createCheckoutSession);
// Webhook route - raw body is handled in index.ts before express.json()
router.post('/webhook', handleWebhook);

export default router;

