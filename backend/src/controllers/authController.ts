import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { sendPasswordResetEmail } from '../services/emailService';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT secret not configured' });
    }

    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      jwtSecret,
      { expiresIn: jwtExpiresIn } as jwt.SignOptions
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByPk(req.user!.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ where: { email } });

    // Don't reveal if user exists or not for security
    if (!user) {
      return res.json({ message: 'If that email exists, a password reset link has been sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date();
    resetPasswordExpires.setHours(resetPasswordExpires.getHours() + 1); // 1 hour expiry

    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires,
    });

    // Send reset email
    try {
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      await sendPasswordResetEmail({
        userEmail: user.email,
        userName: user.name || 'User',
        resetLink,
      });
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      return res.status(500).json({ error: 'Error sending reset email' });
    }

    res.json({ message: 'If that email exists, a password reset link has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [require('sequelize').Op.gt]: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
