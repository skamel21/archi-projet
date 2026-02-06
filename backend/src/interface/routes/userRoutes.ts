import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { createAuthMiddleware } from '../middleware/authMiddleware';
import { TokenService } from '../../domain/ports/TokenService';

export function createUserRoutes(userController: UserController, tokenService: TokenService): Router {
  const router = Router();
  const auth = createAuthMiddleware(tokenService);

  router.get('/export', auth, userController.exportData);
  router.delete('/', auth, userController.deleteAccount);

  return router;
}
