import { Todo } from '../types';

interface Props {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <div className={`d-flex align-items-center p-2 mb-2 border rounded ${todo.completed ? 'bg-light' : ''}`}>
      <button
        className="btn btn-sm btn-link"
        onClick={() => onToggle(todo.id, !todo.completed)}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        <i className={`far ${todo.completed ? 'fa-check-square text-success' : 'fa-square'}`}></i>
      </button>
      <span className={`flex-grow-1 ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}>
        {todo.name}
      </span>
      <button
        className="btn btn-sm btn-link text-danger"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
      >
        <i className="fas fa-trash"></i>
      </button>
    </div>
  );
}
