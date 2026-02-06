import { UserRepository } from '../../../domain/ports/UserRepository';
import { TodoRepository } from '../../../domain/ports/TodoRepository';

export class ExportUserData {
  constructor(
    private userRepository: UserRepository,
    private todoRepository: TodoRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const todos = await this.todoRepository.findAllByUserId(userId);

    return {
      exportDate: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      },
      todos: todos.map(todo => todo.toJSON()),
    };
  }
}
