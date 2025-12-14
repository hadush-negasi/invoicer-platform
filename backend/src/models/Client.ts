import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ClientAttributes {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  companyName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ClientCreationAttributes extends Optional<ClientAttributes, 'id' | 'companyName' | 'createdAt' | 'updatedAt'> {}

class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public address!: string;
  public companyName?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'clients',
    timestamps: true,
  }
);

export default Client;

