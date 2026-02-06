import request from 'supertest';
import { createApp } from '../../src/app';
import { InMemoryUserRepository } from '../../src/infrastructure/persistence/InMemoryUserRepository';
import { InMemoryTodoRepository } from '../../src/infrastructure/persistence/InMemoryTodoRepository';
import { BcryptPasswordHasher } from '../../src/infrastructure/auth/BcryptPasswordHasher';
import { JwtTokenService } from '../../src/infrastructure/auth/JwtTokenService';

describe('Todo Routes', () => {
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

  describe('POST /todos', () => {
    it('should create a todo', async () => {
      const res = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Buy groceries' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('name', 'Buy groceries');
      expect(res.body).toHaveProperty('completed', false);
    });

    it('should reject empty name', async () => {
      const res = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: '' });

      expect(res.status).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/todos')
        .send({ name: 'Buy groceries' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /todos', () => {
    it('should return user todos', async () => {
      await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Todo 1' });

      await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Todo 2' });

      const res = await request(app)
        .get('/todos')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it('should not return other user todos', async () => {
      await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'User A todo' });

      const user2 = await request(app)
        .post('/auth/register')
        .send({ email: 'user2@example.com', password: 'password123' });

      const res = await request(app)
        .get('/todos')
        .set('Authorization', `Bearer ${user2.body.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });

  describe('PATCH /todos/:id', () => {
    it('should update a todo', async () => {
      const createRes = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Original' });

      const res = await request(app)
        .patch(`/todos/${createRes.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated', completed: true });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated');
      expect(res.body).toHaveProperty('completed', true);
    });

    it('should not update another user todo', async () => {
      const createRes = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'User A todo' });

      const user2 = await request(app)
        .post('/auth/register')
        .send({ email: 'user2@example.com', password: 'password123' });

      const res = await request(app)
        .patch(`/todos/${createRes.body.id}`)
        .set('Authorization', `Bearer ${user2.body.token}`)
        .send({ name: 'Hacked' });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo', async () => {
      const createRes = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'To delete' });

      const res = await request(app)
        .delete(`/todos/${createRes.body.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);

      const listRes = await request(app)
        .get('/todos')
        .set('Authorization', `Bearer ${token}`);

      expect(listRes.body).toHaveLength(0);
    });
  });
});
