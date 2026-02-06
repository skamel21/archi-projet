import express from 'express';
import cors from 'cors';
import { TodoRepository } from './domain/ports/TodoRepository';
import { UserRepository } from './domain/ports/UserRepository';
import { PasswordHasher } from './domain/ports/PasswordHasher';
import { TokenService } from './domain/ports/TokenService';
import { RegisterUser } from './application/use-cases/auth/RegisterUser';
import { LoginUser } from './application/use-cases/auth/LoginUser';
import { GetCurrentUser } from './application/use-cases/auth/GetCurrentUser';
import { CreateTodo } from './application/use-cases/todo/CreateTodo';
import { GetTodos } from './application/use-cases/todo/GetTodos';
import { UpdateTodo } from './application/use-cases/todo/UpdateTodo';
import { DeleteTodo } from './application/use-cases/todo/DeleteTodo';
import { ExportUserData } from './application/use-cases/user/ExportUserData';
import { DeleteUser } from './application/use-cases/user/DeleteUser';
import { AuthController } from './interface/controllers/AuthController';
import { TodoController } from './interface/controllers/TodoController';
import { UserController } from './interface/controllers/UserController';
import { createAuthRoutes } from './interface/routes/authRoutes';
import { createTodoRoutes } from './interface/routes/todoRoutes';
import { createUserRoutes } from './interface/routes/userRoutes';

export interface AppDependencies {
  todoRepository: TodoRepository;
  userRepository: UserRepository;
  passwordHasher: PasswordHasher;
  tokenService: TokenService;
  corsOrigin?: string;
}

export function createApp(deps: AppDependencies): express.Application {
  const app = express();

  app.use(cors({ origin: deps.corsOrigin || '*', credentials: true }));
  app.use(express.json());

  // Use-cases
  const registerUser = new RegisterUser(deps.userRepository, deps.passwordHasher, deps.tokenService);
  const loginUser = new LoginUser(deps.userRepository, deps.passwordHasher, deps.tokenService);
  const getCurrentUser = new GetCurrentUser(deps.userRepository);
  const createTodo = new CreateTodo(deps.todoRepository);
  const getTodos = new GetTodos(deps.todoRepository);
  const updateTodo = new UpdateTodo(deps.todoRepository);
  const deleteTodo = new DeleteTodo(deps.todoRepository);
  const exportUserData = new ExportUserData(deps.userRepository, deps.todoRepository);
  const deleteUser = new DeleteUser(deps.userRepository, deps.todoRepository);

  // Controllers
  const authController = new AuthController(registerUser, loginUser, getCurrentUser);
  const todoController = new TodoController(createTodo, getTodos, updateTodo, deleteTodo);
  const userController = new UserController(exportUserData, deleteUser);

  // Routes
  app.use('/auth', createAuthRoutes(authController, deps.tokenService));
  app.use('/todos', createTodoRoutes(todoController, deps.tokenService));
  app.use('/me', createUserRoutes(userController, deps.tokenService));

  return app;
}
