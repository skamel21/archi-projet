import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Todo } from '../types';
import * as todosApi from '../api/todos.api';
import TodoItem from '../components/TodoItem';
import AddTodoForm from '../components/AddTodoForm';

export default function TodosPage() {
  const { token } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTodos = useCallback(async () => {
    if (!token) return;
    try {
      const data = await todosApi.getTodos(token);
      setTodos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAdd = async (name: string) => {
    if (!token) return;
    const todo = await todosApi.createTodo(token, name);
    setTodos(prev => [todo, ...prev]);
  };

  const handleToggle = async (id: string, completed: boolean) => {
    if (!token) return;
    const updated = await todosApi.updateTodo(token, id, { completed });
    setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    await todosApi.deleteTodo(token, id);
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <h1 className="mb-4">My Todos</h1>
        <AddTodoForm onAdd={handleAdd} />
        {todos.length === 0 ? (
          <p className="text-center text-muted">No todos yet! Add one above.</p>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
