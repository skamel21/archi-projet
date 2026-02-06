import { Pool } from 'mysql2/promise';
import { Todo } from '../../domain/entities/Todo';
import { TodoRepository } from '../../domain/ports/TodoRepository';

export class MysqlTodoRepository implements TodoRepository {
  constructor(private pool: Pool) {}

  async init(): Promise<void> {
    await this.pool.execute(`
      CREATE TABLE IF NOT EXISTS todos (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        user_id VARCHAR(36) NOT NULL,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        INDEX idx_user_id (user_id)
      ) DEFAULT CHARSET utf8mb4
    `);
  }

  async findById(id: string): Promise<Todo | null> {
    const [rows] = await this.pool.execute('SELECT * FROM todos WHERE id = ?', [id]);
    const result = rows as any[];
    if (result.length === 0) return null;
    return this.rowToTodo(result[0]);
  }

  async findAllByUserId(userId: string): Promise<Todo[]> {
    const [rows] = await this.pool.execute('SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return (rows as any[]).map(row => this.rowToTodo(row));
  }

  async save(todo: Todo): Promise<void> {
    await this.pool.execute(
      'INSERT INTO todos (id, name, completed, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [todo.id, todo.name, todo.completed, todo.userId, todo.createdAt, todo.updatedAt]
    );
  }

  async update(todo: Todo): Promise<void> {
    await this.pool.execute(
      'UPDATE todos SET name = ?, completed = ?, updated_at = ? WHERE id = ?',
      [todo.name, todo.completed, todo.updatedAt, todo.id]
    );
  }

  async delete(id: string): Promise<void> {
    await this.pool.execute('DELETE FROM todos WHERE id = ?', [id]);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await this.pool.execute('DELETE FROM todos WHERE user_id = ?', [userId]);
  }

  private rowToTodo(row: any): Todo {
    return new Todo({
      id: row.id,
      name: row.name,
      completed: Boolean(row.completed),
      userId: row.user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }
}
