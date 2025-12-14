import User from './User';
import Client from './Client';
import Invoice from './Invoice';

// Define relationships
Client.hasMany(Invoice, { foreignKey: 'clientId', as: 'invoices' });
Invoice.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

export { User, Client, Invoice };

