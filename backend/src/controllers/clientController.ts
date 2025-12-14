import { Request, Response } from 'express';
import Client from '../models/Client';
import { AuthRequest } from '../middleware/auth';

export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(clients);
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, companyName } = req.body;

    if (!name || !email || !phone || !address) {
      return res.status(400).json({ error: 'Name, email, phone, and address are required' });
    }

    const client = await Client.create({
      name,
      email,
      phone,
      address,
      companyName,
    });

    res.status(201).json(client);
  } catch (error: any) {
    console.error('Create client error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, companyName } = req.body;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await client.update({
      name: name || client.name,
      email: email || client.email,
      phone: phone || client.phone,
      address: address || client.address,
      companyName: companyName !== undefined ? companyName : client.companyName,
    });

    res.json(client);
  } catch (error: any) {
    console.error('Update client error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await client.destroy();
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

