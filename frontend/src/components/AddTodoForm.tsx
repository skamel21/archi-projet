import { useState, FormEvent } from 'react';

interface Props {
  onAdd: (name: string) => void;
}

export default function AddTodoForm({ onAdd }: Props) {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onAdd(name.trim());
      setName('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="What needs to be done?"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-success"
          disabled={!name.trim() || submitting}
        >
          {submitting ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  );
}
