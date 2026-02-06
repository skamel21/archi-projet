import { User, UserProps } from '../../domain/entities/User';
import { UserRepository } from '../../domain/ports/UserRepository';

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, UserProps> = new Map();

  async findById(id: string): Promise<User | null> {
    const data = this.users.get(id);
    if (!data) return null;
    return new User({ ...data });
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const data of this.users.values()) {
      if (data.email === email) {
        return new User({ ...data });
      }
    }
    return null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}
