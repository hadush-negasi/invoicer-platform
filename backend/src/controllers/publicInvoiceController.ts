import { Request, Response } from 'express';
import Invoice from '../models/Invoice';
import Client from '../models/Client';

export const getPublicInvoice = async (req: Request, res: Response) => {
  try {
    const { invoiceId } = req.params;

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

    // Return invoice data without sensitive information
    res.json({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amount,
      currency: invoice.currency,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      description: invoice.description,
      client: invoice.client ? {
        name: invoice.client.name,
        email: invoice.client.email,
        companyName: invoice.client.companyName,
      } : null,
    });
  } catch (error) {
    console.error('Get public invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


