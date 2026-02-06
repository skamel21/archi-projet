import { User } from '../../../domain/entities/User';
import { UserRepository } from '../../../domain/ports/UserRepository';
import { PasswordHasher } from '../../../domain/ports/PasswordHasher';
import { TokenService, TokenPayload } from '../../../domain/ports/TokenService';
import { v4 as uuid } from 'uuid';

export interface RegisterInput {
  email: string;
  password: string;
}

export interface RegisterOutput {
  user: { id: string; email: string };
  token: string;
}

export class RegisterUser {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private tokenService: TokenService,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new Error('Email already in use');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = User.create(uuid(), input.email, passwordHash);
    await this.userRepository.save(user);

    const token = this.tokenService.generate({
      userId: user.id,
      email: user.email,
    });

    return {
      user: { id: user.id, email: user.email },
      token,
    };
  }
}
