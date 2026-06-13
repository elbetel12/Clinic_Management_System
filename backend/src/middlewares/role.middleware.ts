import { Request, Response, NextFunction } from 'express';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

export const requireAdminOrDoctor = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'doctor') {
    return res.status(403).json({ message: 'Forbidden: Admin or Doctor access required' });
  }
  next();
};

export const requireDoctor = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'doctor') {
    return res.status(403).json({ message: 'Forbidden: Doctor access required' });
  }
  next();
};