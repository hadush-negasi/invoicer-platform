import { Request, Response } from 'express';
import Invoice, { InvoiceStatus } from '../models/Invoice';
import Client from '../models/Client';
import { customAlphabet } from 'nanoid';

// Generate 6-digit numeric invoice ID
const nanoid = customAlphabet('0123456789', 6);
const generateInvoiceNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const randomId = nanoid(); // e.g., '482930'
  return `INV-${year}-${randomId}`;
};

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await Invoice.findAll({
      include: [
        {
          model: Client,
          as: 'client',
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByPk(id, {
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

    res.json(invoice);
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const { clientId, amount, currency, issueDate, dueDate, description } = req.body;

    if (!clientId || !amount || !issueDate || !dueDate || !description) {
      return res.status(400).json({ error: 'Client ID, amount, issue date, due date, and description are required' });
    }

    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const invoiceNumber = await generateInvoiceNumber();

    const invoice = await Invoice.create({
      invoiceNumber,
      clientId,
      amount,
      currency: currency || 'USD',
      issueDate,
      dueDate,
      description,
      status: InvoiceStatus.PENDING,
    });

    const invoiceWithClient = await Invoice.findByPk(invoice.id, {
      include: [
        {
          model: Client,
          as: 'client',
        },
      ],
    });

    res.status(201).json(invoiceWithClient);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { clientId, amount, currency, issueDate, dueDate, status, description } = req.body;

    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (clientId) {
      const client = await Client.findByPk(clientId);
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
    }

    await invoice.update({
      clientId: clientId || invoice.clientId,
      amount: amount || invoice.amount,
      currency: currency || invoice.currency,
      issueDate: issueDate || invoice.issueDate,
      dueDate: dueDate || invoice.dueDate,
      status: status || invoice.status,
      description: description || invoice.description,
    });

    const updatedInvoice = await Invoice.findByPk(invoice.id, {
      include: [
        {
          model: Client,
          as: 'client',
        },
      ],
    });

    res.json(updatedInvoice);
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    await invoice.destroy();
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendInvoiceEmail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id, {
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

    if (!invoice.client) {
      return res.status(400).json({ error: 'Client information not found for this invoice' });
    }

    const { sendInvoiceEmail: sendEmail } = await import('../services/emailService');
    const paymentLink = `${process.env.FRONTEND_URL}/pay/invoice/${invoice.id}`;
    
    await sendEmail({
      clientName: invoice.client.name,
      clientEmail: invoice.client.email,
      invoiceNumber: invoice.invoiceNumber,
      amount: parseFloat(invoice.amount.toString()),
      currency: invoice.currency,
      dueDate: invoice.dueDate,
      description: invoice.description,
      paymentLink,
    });

    res.json({ message: 'Invoice email sent successfully' });
  } catch (error: any) {
    console.error('Send invoice email error:', error);
    res.status(500).json({ error: error.message || 'Error sending invoice email' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalInvoices = await Invoice.count();
    const paidInvoices = await Invoice.count({ where: { status: InvoiceStatus.PAID } });
    const pendingInvoices = await Invoice.count({ where: { status: InvoiceStatus.PENDING } });
    const overdueInvoices = await Invoice.count({ where: { status: InvoiceStatus.OVERDUE } });

    const totalAmount = await Invoice.sum('amount', {
      where: { status: InvoiceStatus.PAID },
    }) || 0;

    res.json({
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      totalAmount: parseFloat(totalAmount.toString()),
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

