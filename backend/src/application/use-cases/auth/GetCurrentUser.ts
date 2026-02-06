import { UserRepository } from '../../../domain/ports/UserRepository';

export class GetCurrentUser {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return { id: user.id, email: user.email, createdAt: user.createdAt.toISOString() };
  }
}
