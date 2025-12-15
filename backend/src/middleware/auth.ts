import { Response, NextFunction } from 'express';
import type { Request } from 'express';

import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: UserRole;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    //console.log("token", token);

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {
      id: number;
      email: string;
      role: UserRole;
    };

    req.user = decoded;
    next();
  } catch (error) {
    console.log("error", error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

