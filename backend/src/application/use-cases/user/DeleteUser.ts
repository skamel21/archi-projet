import { UserRepository } from '../../../domain/ports/UserRepository';
import { TodoRepository } from '../../../domain/ports/TodoRepository';

export class DeleteUser {
  constructor(
    private userRepository: UserRepository,
    private todoRepository: TodoRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await this.todoRepository.deleteAllByUserId(userId);
    await this.userRepository.delete(userId);

    console.log(`[RGPD] User ${userId} and all associated data deleted at ${new Date().toISOString()}`);
  }
}
