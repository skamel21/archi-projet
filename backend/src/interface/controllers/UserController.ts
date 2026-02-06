import { Response } from 'express';
import { ExportUserData } from '../../application/use-cases/user/ExportUserData';
import { DeleteUser } from '../../application/use-cases/user/DeleteUser';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class UserController {
  constructor(
    private exportUserData: ExportUserData,
    private deleteUser: DeleteUser,
  ) {}

  exportData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const data = await this.exportUserData.execute(req.userId!);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  deleteAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      await this.deleteUser.execute(req.userId!);
      res.json({ message: 'Account and all associated data have been deleted' });
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
