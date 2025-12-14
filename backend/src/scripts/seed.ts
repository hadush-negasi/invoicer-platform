import bcrypt from 'bcryptjs';
import User, { UserRole } from '../models/User';
import sequelize from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    await sequelize.sync({ force: false });
    console.log('Database synchronized.');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });

    if (existingAdmin) {
      console.log('Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('Role: Admin');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();

