export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  readonly id: string;
  private _email: string;
  readonly passwordHash: string;
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this._email = props.email;
    this.passwordHash = props.passwordHash;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  get email(): string {
    return this._email;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  static create(id: string, email: string, passwordHash: string): User {
    const now = new Date();
    return new User({
      id,
      email,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    });
  }

  toJSON() {
    return {
      id: this.id,
      email: this._email,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
