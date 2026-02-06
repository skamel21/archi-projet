import request from 'supertest';
import { createApp } from '../../src/app';
import { InMemoryUserRepository } from '../../src/infrastructure/persistence/InMemoryUserRepository';
import { InMemoryTodoRepository } from '../../src/infrastructure/persistence/InMemoryTodoRepository';
import { BcryptPasswordHasher } from '../../src/infrastructure/auth/BcryptPasswordHasher';
import { JwtTokenService } from '../../src/infrastructure/auth/JwtTokenService';

describe('Auth Routes', () => {
  let app: ReturnType<typeof createApp>;
  let tokenService: JwtTokenService;

  beforeEach(() => {
    tokenService = new JwtTokenService('test-secret', '1h');
    app = createApp({
      todoRepository: new InMemoryTodoRepository(),
      userRepository: new InMemoryUserRepository(),
      passwordHasher: new BcryptPasswordHasher(),
      tokenService,
    });
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'invalid', password: 'password123' });

      expect(res.status).toBe(400);
    });

    it('should reject short password', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: '123' });

      expect(res.status).toBe(400);
    });

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: 'password456' });

      expect(res.status).toBe(409);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'nobody@example.com', password: 'password123' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user', async () => {
      const registerRes = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${registerRes.body.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', 'test@example.com');
    });

    it('should reject without token', async () => {
      const res = await request(app).get('/auth/me');
      expect(res.status).toBe(401);
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.status).toBe(401);
    });
  });
});
