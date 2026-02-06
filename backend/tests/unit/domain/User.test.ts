import { User } from '../../../src/domain/entities/User';

describe('User Entity', () => {
  it('should create a new user', () => {
    const user = User.create('user-1', 'test@example.com', 'hashed-password');
    expect(user.id).toBe('user-1');
    expect(user.email).toBe('test@example.com');
    expect(user.passwordHash).toBe('hashed-password');
  });

  it('should serialize to JSON without password hash', () => {
    const user = User.create('user-1', 'test@example.com', 'hashed-password');
    const json = user.toJSON();
    expect(json).toHaveProperty('id', 'user-1');
    expect(json).toHaveProperty('email', 'test@example.com');
    expect(json).not.toHaveProperty('passwordHash');
    expect(json).not.toHaveProperty('password_hash');
  });
});
