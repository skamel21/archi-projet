import { Response } from 'express';
import { CreateTodo } from '../../application/use-cases/todo/CreateTodo';
import { GetTodos } from '../../application/use-cases/todo/GetTodos';
import { UpdateTodo } from '../../application/use-cases/todo/UpdateTodo';
import { DeleteTodo } from '../../application/use-cases/todo/DeleteTodo';
import { createTodoSchema, updateTodoSchema } from '../../application/validators';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class TodoController {
  constructor(
    private createTodo: CreateTodo,
    private getTodos: GetTodos,
    private updateTodo: UpdateTodo,
    private deleteTodo: DeleteTodo,
  ) {}

  list = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const todos = await this.getTodos.execute(req.userId!);
      res.json(todos.map(t => t.toJSON()));
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const parsed = createTodoSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.errors[0].message });
        return;
      }

      const todo = await this.createTodo.execute({
        name: parsed.data.name,
        userId: req.userId!,
      });
      res.status(201).json(todo.toJSON());
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const parsed = updateTodoSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.errors[0].message });
        return;
      }

      const todo = await this.updateTodo.execute({
        id: req.params.id,
        userId: req.userId!,
        ...parsed.data,
      });
      res.json(todo.toJSON());
    } catch (error: any) {
      if (error.message === 'Todo not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === 'Not authorized') {
        res.status(403).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  remove = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      await this.deleteTodo.execute(req.params.id, req.userId!);
      res.status(200).json({ message: 'Todo deleted' });
    } catch (error: any) {
      if (error.message === 'Todo not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === 'Not authorized') {
        res.status(403).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
