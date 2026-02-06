import Database from 'better-sqlite3';
import { Todo } from '../../domain/entities/Todo';
import { TodoRepository } from '../../domain/ports/TodoRepository';

export class SqliteTodoRepository implements TodoRepository {
  constructor(private db: Database.Database) {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        user_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
  }

  async findById(id: string): Promise<Todo | null> {
    const row = this.db.prepare('SELECT * FROM todos WHERE id = ?').get(id) as any;
    if (!row) return null;
    return this.rowToTodo(row);
  }

  async findAllByUserId(userId: string): Promise<Todo[]> {
    const rows = this.db.prepare('SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC').all(userId) as any[];
    return rows.map(row => this.rowToTodo(row));
  }

  async save(todo: Todo): Promise<void> {
    this.db.prepare(
      'INSERT INTO todos (id, name, completed, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(todo.id, todo.name, todo.completed ? 1 : 0, todo.userId, todo.createdAt.toISOString(), todo.updatedAt.toISOString());
  }

  async update(todo: Todo): Promise<void> {
    this.db.prepare(
      'UPDATE todos SET name = ?, completed = ?, updated_at = ? WHERE id = ?'
    ).run(todo.name, todo.completed ? 1 : 0, todo.updatedAt.toISOString(), todo.id);
  }

  async delete(id: string): Promise<void> {
    this.db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    this.db.prepare('DELETE FROM todos WHERE user_id = ?').run(userId);
  }

  private rowToTodo(row: any): Todo {
    return new Todo({
      id: row.id,
      name: row.name,
      completed: row.completed === 1,
      userId: row.user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }
}
