import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) { // Passport adds this method to req
    return next();
  }
  res.redirect('/auth/login'); // Redirect to login if not authenticated
};