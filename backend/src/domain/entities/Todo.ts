export interface TodoProps {
  id: string;
  name: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Todo {
  readonly id: string;
  private _name: string;
  private _completed: boolean;
  readonly userId: string;
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: TodoProps) {
    this.id = props.id;
    this._name = props.name;
    this._completed = props.completed;
    this.userId = props.userId;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get name(): string {
    return this._name;
  }

  get completed(): boolean {
    return this._completed;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Todo name cannot be empty');
    }
    if (name.length > 255) {
      throw new Error('Todo name cannot exceed 255 characters');
    }
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  toggleCompleted(): void {
    this._completed = !this._completed;
    this._updatedAt = new Date();
  }

  setCompleted(completed: boolean): void {
    this._completed = completed;
    this._updatedAt = new Date();
  }

  static create(id: string, name: string, userId: string): Todo {
    if (!name || name.trim().length === 0) {
      throw new Error('Todo name cannot be empty');
    }
    if (name.length > 255) {
      throw new Error('Todo name cannot exceed 255 characters');
    }
    const now = new Date();
    return new Todo({
      id,
      name: name.trim(),
      completed: false,
      userId,
      createdAt: now,
      updatedAt: now,
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this._name,
      completed: this._completed,
      userId: this.userId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
