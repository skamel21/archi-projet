import { Request, Response } from 'express';
import { RegisterUser } from '../../application/use-cases/auth/RegisterUser';
import { LoginUser } from '../../application/use-cases/auth/LoginUser';
import { GetCurrentUser } from '../../application/use-cases/auth/GetCurrentUser';
import { registerSchema, loginSchema } from '../../application/validators';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class AuthController {
  constructor(
    private registerUser: RegisterUser,
    private loginUser: LoginUser,
    private getCurrentUser: GetCurrentUser,
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.errors[0].message });
        return;
      }

      const result = await this.registerUser.execute(parsed.data);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'Email already in use') {
        res.status(409).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.errors[0].message });
        return;
      }

      const result = await this.loginUser.execute(parsed.data);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Invalid email or password') {
        res.status(401).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const user = await this.getCurrentUser.execute(req.userId!);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ error: 'User not found' });
    }
  };
}
