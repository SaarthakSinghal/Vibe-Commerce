import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const mockUserMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = process.env.MOCK_USER_ID || 'mock-user-123';
  req.userId = userId;
  next();
};
