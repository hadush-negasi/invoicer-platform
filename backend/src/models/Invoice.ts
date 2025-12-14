import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { ClientAttributes } from './Client';

export enum InvoiceStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  OVERDUE = 'Overdue',
}

export interface InvoiceAttributes {
  id: number;
  invoiceNumber: string;
  clientId: number;
  amount: number;
  currency: string;
  issueDate: Date;
  dueDate: Date;
  status: InvoiceStatus;
  description: string;
  stripePaymentIntentId?: string;
  createdAt?: Date;
  updatedAt?: Date;

  client?: ClientAttributes;
}

interface InvoiceCreationAttributes extends Optional<InvoiceAttributes, 'id' | 'invoiceNumber' | 'status' | 'stripePaymentIntentId' | 'createdAt' | 'updatedAt'> {}

class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> implements InvoiceAttributes {
  public id!: number;
  public invoiceNumber!: string;
  public clientId!: number;
  public amount!: number;
  public currency!: string;
  public issueDate!: Date;
  public dueDate!: Date;
  public status!: InvoiceStatus;
  public description!: string;
  public stripePaymentIntentId?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public client?: ClientAttributes | undefined;
}

Invoice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'USD',
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(InvoiceStatus)),
      allowNull: false,
      defaultValue: InvoiceStatus.PENDING,
    },
    stripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'invoices',
    timestamps: true,
  }
);

export default Invoice;

