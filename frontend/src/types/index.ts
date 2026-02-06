export interface User {
  id: string;
  email: string;
  createdAt?: string;
}

export interface Todo {
  id: string;
  name: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ExportData {
  exportDate: string;
  user: User;
  todos: Todo[];
}
