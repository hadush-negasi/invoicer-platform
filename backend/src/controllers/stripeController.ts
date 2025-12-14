import { Request, Response } from 'express';
import Stripe from 'stripe';
import Invoice, { InvoiceStatus } from '../models/Invoice';
import Client from '../models/Client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    // Support both body and params for invoiceId (for public routes)
    const invoiceId = req.body.invoiceId || req.params.invoiceId;

    if (!invoiceId) {
      return res.status(400).json({ error: 'Invoice ID is required' });
    }

    const invoice = await Invoice.findByPk(invoiceId, {
      include: [
        {
          model: Client,
          as: 'client',
        },
      ],
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (invoice.status === InvoiceStatus.PAID) {
      return res.status(400).json({ error: 'Invoice is already paid' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: invoice.currency.toLowerCase(),
            product_data: {
              name: `Invoice ${invoice.invoiceNumber}`,
              description: `Invoice for ${invoice.client?.name}`,
            },
            unit_amount: Math.round(parseFloat(invoice.amount.toString()) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/pay/invoice/${invoiceId}?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/pay/invoice/${invoiceId}?payment=cancelled`,
      metadata: {
        invoiceId: invoice.id.toString(),
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Stripe webhook secret is not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoiceId = session.metadata?.invoiceId;

    if (invoiceId) {
      try {
        const invoice = await Invoice.findByPk(invoiceId);
        if (invoice && invoice.status !== InvoiceStatus.PAID) {
          // Verify payment was actually successful
          if (session.payment_status === 'paid') {
            await invoice.update({
              status: InvoiceStatus.PAID,
              stripePaymentIntentId: session.payment_intent as string,
            });
            console.log(`Invoice ${invoiceId} marked as paid via webhook`);
          }
        }
      } catch (error) {
        console.error('Error updating invoice status:', error);
      }
    }
  }

  // Also handle payment_intent.succeeded as a fallback
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    // Try to find invoice by payment intent ID
    try {
      const invoice = await Invoice.findOne({
        where: { stripePaymentIntentId: paymentIntent.id },
      });
      if (invoice && invoice.status !== InvoiceStatus.PAID) {
        await invoice.update({
          status: InvoiceStatus.PAID,
        });
        console.log(`Invoice ${invoice.id} marked as paid via payment_intent webhook`);
      }
    } catch (error) {
      console.error('Error updating invoice from payment_intent:', error);
    }
  }

  res.json({ received: true });
};

