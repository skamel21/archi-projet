import { TodoRepository } from '../../../domain/ports/TodoRepository';
import { Todo } from '../../../domain/entities/Todo';

export interface UpdateTodoInput {
  id: string;
  userId: string;
  name?: string;
  completed?: boolean;
}

export class UpdateTodo {
  constructor(private todoRepository: TodoRepository) {}

  async execute(input: UpdateTodoInput): Promise<Todo> {
    const todo = await this.todoRepository.findById(input.id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    if (todo.userId !== input.userId) {
      throw new Error('Not authorized');
    }

    if (input.name !== undefined) {
      todo.updateName(input.name);
    }
    if (input.completed !== undefined) {
      todo.setCompleted(input.completed);
    }

    await this.todoRepository.update(todo);
    return todo;
  }
}
