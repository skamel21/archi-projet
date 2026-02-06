import { Todo } from '../entities/Todo';

export interface TodoRepository {
  findById(id: string): Promise<Todo | null>;
  findAllByUserId(userId: string): Promise<Todo[]>;
  save(todo: Todo): Promise<void>;
  update(todo: Todo): Promise<void>;
  delete(id: string): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
}
