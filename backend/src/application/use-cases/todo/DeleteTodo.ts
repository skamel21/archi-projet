import { TodoRepository } from '../../../domain/ports/TodoRepository';

export class DeleteTodo {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    if (todo.userId !== userId) {
      throw new Error('Not authorized');
    }
    await this.todoRepository.delete(id);
  }
}
