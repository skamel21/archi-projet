import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../../domain/ports/TokenService';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export function createAuthMiddleware(tokenService: TokenService) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const token = authHeader.substring(7);
    const payload = tokenService.verify(token);
    if (!payload) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    req.userId = payload.userId;
    req.userEmail = payload.email;
    next();
  };
}
