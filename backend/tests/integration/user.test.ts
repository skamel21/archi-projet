import request from 'supertest';
import { createApp } from '../../src/app';
import { InMemoryUserRepository } from '../../src/infrastructure/persistence/InMemoryUserRepository';
import { InMemoryTodoRepository } from '../../src/infrastructure/persistence/InMemoryTodoRepository';
import { BcryptPasswordHasher } from '../../src/infrastructure/auth/BcryptPasswordHasher';
import { JwtTokenService } from '../../src/infrastructure/auth/JwtTokenService';

describe('User/RGPD Routes', () => {
  let app: ReturnType<typeof createApp>;
  let token: string;

  beforeEach(async () => {
    const tokenService = new JwtTokenService('test-secret', '1h');
    app = createApp({
      todoRepository: new InMemoryTodoRepository(),
      userRepository: new InMemoryUserRepository(),
      passwordHasher: new BcryptPasswordHasher(),
      tokenService,
    });

    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'password123' });
    token = res.body.token;
  });

  describe('GET /me/export', () => {
    it('should export user data', async () => {
      await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'My todo' });

      const res = await request(app)
        .get('/me/export')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('exportDate');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
      expect(res.body).toHaveProperty('todos');
      expect(res.body.todos).toHaveLength(1);
    });
  });

  describe('DELETE /me', () => {
    it('should delete user account and todos', async () => {
      await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'My todo' });

      const deleteRes = await request(app)
        .delete('/me')
        .set('Authorization', `Bearer ${token}`);

      expect(deleteRes.status).toBe(200);

      const loginRes = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(loginRes.status).toBe(401);
    });
  });
});
