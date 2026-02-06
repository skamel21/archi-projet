import { apiRequest } from './client';
import { Todo } from '../types';

export function getTodos(token: string): Promise<Todo[]> {
  return apiRequest<Todo[]>('/todos', { token });
}

export function createTodo(token: string, name: string): Promise<Todo> {
  return apiRequest<Todo>('/todos', {
    method: 'POST',
    body: { name },
    token,
  });
}

export function updateTodo(token: string, id: string, data: { name?: string; completed?: boolean }): Promise<Todo> {
  return apiRequest<Todo>(`/todos/${id}`, {
    method: 'PATCH',
    body: data,
    token,
  });
}

export function deleteTodo(token: string, id: string): Promise<void> {
  return apiRequest(`/todos/${id}`, {
    method: 'DELETE',
    token,
  });
}
