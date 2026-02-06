import { Router } from 'express';
import { TodoController } from '../controllers/TodoController';
import { createAuthMiddleware } from '../middleware/authMiddleware';
import { TokenService } from '../../domain/ports/TokenService';

export function createTodoRoutes(todoController: TodoController, tokenService: TokenService): Router {
  const router = Router();
  const auth = createAuthMiddleware(tokenService);

  router.get('/', auth, todoController.list);
  router.post('/', auth, todoController.create);
  router.patch('/:id', auth, todoController.update);
  router.delete('/:id', auth, todoController.remove);

  return router;
}
