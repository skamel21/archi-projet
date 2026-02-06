import Database from 'better-sqlite3';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/ports/UserRepository';

export class SqliteUserRepository implements UserRepository {
  constructor(private db: Database.Database) {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);
  }

  async findById(id: string): Promise<User | null> {
    const row = this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
    if (!row) return null;
    return this.rowToUser(row);
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = this.db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!row) return null;
    return this.rowToUser(row);
  }

  async save(user: User): Promise<void> {
    this.db.prepare(
      'INSERT INTO users (id, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
    ).run(user.id, user.email, user.passwordHash, user.createdAt.toISOString(), user.updatedAt.toISOString());
  }

  async delete(id: string): Promise<void> {
    this.db.prepare('DELETE FROM users WHERE id = ?').run(id);
  }

  private rowToUser(row: any): User {
    return new User({
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }
}
