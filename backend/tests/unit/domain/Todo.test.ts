import { Todo } from '../../../src/domain/entities/Todo';

describe('Todo Entity', () => {
  it('should create a new todo', () => {
    const todo = Todo.create('test-id', 'Buy groceries', 'user-1');
    expect(todo.id).toBe('test-id');
    expect(todo.name).toBe('Buy groceries');
    expect(todo.completed).toBe(false);
    expect(todo.userId).toBe('user-1');
  });

  it('should throw error for empty name', () => {
    expect(() => Todo.create('id', '', 'user-1')).toThrow('Todo name cannot be empty');
  });

  it('should throw error for name exceeding 255 chars', () => {
    const longName = 'a'.repeat(256);
    expect(() => Todo.create('id', longName, 'user-1')).toThrow('Todo name cannot exceed 255 characters');
  });

  it('should trim the name', () => {
    const todo = Todo.create('id', '  Buy milk  ', 'user-1');
    expect(todo.name).toBe('Buy milk');
  });

  it('should update name', () => {
    const todo = Todo.create('id', 'Old name', 'user-1');
    todo.updateName('New name');
    expect(todo.name).toBe('New name');
  });

  it('should toggle completed', () => {
    const todo = Todo.create('id', 'Test', 'user-1');
    expect(todo.completed).toBe(false);
    todo.toggleCompleted();
    expect(todo.completed).toBe(true);
    todo.toggleCompleted();
    expect(todo.completed).toBe(false);
  });

  it('should set completed', () => {
    const todo = Todo.create('id', 'Test', 'user-1');
    todo.setCompleted(true);
    expect(todo.completed).toBe(true);
  });

  it('should serialize to JSON', () => {
    const todo = Todo.create('id', 'Test', 'user-1');
    const json = todo.toJSON();
    expect(json).toHaveProperty('id', 'id');
    expect(json).toHaveProperty('name', 'Test');
    expect(json).toHaveProperty('completed', false);
    expect(json).toHaveProperty('userId', 'user-1');
    expect(json).toHaveProperty('createdAt');
    expect(json).toHaveProperty('updatedAt');
  });
});
