import { Pool } from 'mysql2/promise';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/ports/UserRepository';

export class MysqlUserRepository implements UserRepository {
  constructor(private pool: Pool) {}

  async init(): Promise<void> {
    await this.pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL
      ) DEFAULT CHARSET utf8mb4
    `);
  }

  async findById(id: string): Promise<User | null> {
    const [rows] = await this.pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    const result = rows as any[];
    if (result.length === 0) return null;
    return this.rowToUser(result[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await this.pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const result = rows as any[];
    if (result.length === 0) return null;
    return this.rowToUser(result[0]);
  }

  async save(user: User): Promise<void> {
    await this.pool.execute(
      'INSERT INTO users (id, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [user.id, user.email, user.passwordHash, user.createdAt, user.updatedAt]
    );
  }

  async delete(id: string): Promise<void> {
    await this.pool.execute('DELETE FROM users WHERE id = ?', [id]);
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
