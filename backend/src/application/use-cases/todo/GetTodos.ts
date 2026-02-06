import { TodoRepository } from '../../../domain/ports/TodoRepository';
import { Todo } from '../../../domain/entities/Todo';

export class GetTodos {
  constructor(private todoRepository: TodoRepository) {}

  async execute(userId: string): Promise<Todo[]> {
    return this.todoRepository.findAllByUserId(userId);
  }
}
