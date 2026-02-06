import { Todo } from '../../../domain/entities/Todo';
import { TodoRepository } from '../../../domain/ports/TodoRepository';
import { v4 as uuid } from 'uuid';

export interface CreateTodoInput {
  name: string;
  userId: string;
}

export class CreateTodo {
  constructor(private todoRepository: TodoRepository) {}

  async execute(input: CreateTodoInput): Promise<Todo> {
    const todo = Todo.create(uuid(), input.name, input.userId);
    await this.todoRepository.save(todo);
    return todo;
  }
}
