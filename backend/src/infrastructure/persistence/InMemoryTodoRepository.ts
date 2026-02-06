import { Todo, TodoProps } from '../../domain/entities/Todo';
import { TodoRepository } from '../../domain/ports/TodoRepository';

export class InMemoryTodoRepository implements TodoRepository {
  private todos: Map<string, TodoProps> = new Map();

  async findById(id: string): Promise<Todo | null> {
    const data = this.todos.get(id);
    if (!data) return null;
    return new Todo({ ...data });
  }

  async findAllByUserId(userId: string): Promise<Todo[]> {
    const result: Todo[] = [];
    for (const data of this.todos.values()) {
      if (data.userId === userId) {
        result.push(new Todo({ ...data }));
      }
    }
    return result;
  }

  async save(todo: Todo): Promise<void> {
    this.todos.set(todo.id, {
      id: todo.id,
      name: todo.name,
      completed: todo.completed,
      userId: todo.userId,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    });
  }

  async update(todo: Todo): Promise<void> {
    this.todos.set(todo.id, {
      id: todo.id,
      name: todo.name,
      completed: todo.completed,
      userId: todo.userId,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    this.todos.delete(id);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    for (const [id, data] of this.todos.entries()) {
      if (data.userId === userId) {
        this.todos.delete(id);
      }
    }
  }
}
