import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  name?: string;
  role: UserRole;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'name' | 'resetPasswordToken' | 'resetPasswordExpires' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public name?: string;
  public role!: UserRole;
  public resetPasswordToken?: string;
  public resetPasswordExpires?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.STAFF,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

export default User;

