import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const createTodoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be under 255 characters'),
});

export const updateTodoSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  completed: z.boolean().optional(),
});
