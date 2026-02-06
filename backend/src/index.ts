import { createApp } from './app';
import { config } from './infrastructure/config';
import { BcryptPasswordHasher } from './infrastructure/auth/BcryptPasswordHasher';
import { JwtTokenService } from './infrastructure/auth/JwtTokenService';
import { InMemoryTodoRepository } from './infrastructure/persistence/InMemoryTodoRepository';
import { InMemoryUserRepository } from './infrastructure/persistence/InMemoryUserRepository';
import { TodoRepository } from './domain/ports/TodoRepository';
import { UserRepository } from './domain/ports/UserRepository';

async function createRepositories(): Promise<{ todoRepository: TodoRepository; userRepository: UserRepository }> {
  if (config.nodeEnv === 'test') {
    return {
      todoRepository: new InMemoryTodoRepository(),
      userRepository: new InMemoryUserRepository(),
    };
  }

  if (config.dbType === 'mysql') {
    const mysql = await import('mysql2/promise');
    const { MysqlTodoRepository } = await import('./infrastructure/persistence/MysqlTodoRepository');
    const { MysqlUserRepository } = await import('./infrastructure/persistence/MysqlUserRepository');

    const pool = mysql.createPool({
      host: config.mysql.host,
      port: config.mysql.port,
      user: config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database,
    });

    const todoRepo = new MysqlTodoRepository(pool);
    const userRepo = new MysqlUserRepository(pool);
    await todoRepo.init();
    await userRepo.init();

    return { todoRepository: todoRepo, userRepository: userRepo };
  }

  // Default: SQLite
  const Database = (await import('better-sqlite3')).default;
  const { SqliteTodoRepository } = await import('./infrastructure/persistence/SqliteTodoRepository');
  const { SqliteUserRepository } = await import('./infrastructure/persistence/SqliteUserRepository');
  const fs = await import('fs');
  const path = await import('path');

  const dbDir = path.dirname(config.sqlite.dbLocation);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new Database(config.sqlite.dbLocation);
  db.pragma('journal_mode = WAL');

  return {
    todoRepository: new SqliteTodoRepository(db),
    userRepository: new SqliteUserRepository(db),
  };
}

async function main() {
  const { todoRepository, userRepository } = await createRepositories();
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(config.jwt.secret, config.jwt.expiresIn);

  const app = createApp({
    todoRepository,
    userRepository,
    passwordHasher,
    tokenService,
    corsOrigin: config.cors.origin,
  });

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} (${config.nodeEnv} mode, ${config.dbType} database)`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
