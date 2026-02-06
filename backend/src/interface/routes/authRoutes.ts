import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { createAuthMiddleware } from '../middleware/authMiddleware';
import { TokenService } from '../../domain/ports/TokenService';

export function createAuthRoutes(authController: AuthController, tokenService: TokenService): Router {
  const router = Router();

  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.get('/me', createAuthMiddleware(tokenService), authController.me);

  return router;
}
