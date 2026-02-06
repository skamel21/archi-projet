import { UserRepository } from '../../../domain/ports/UserRepository';
import { PasswordHasher } from '../../../domain/ports/PasswordHasher';
import { TokenService } from '../../../domain/ports/TokenService';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  user: { id: string; email: string };
  token: string;
}

export class LoginUser {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private tokenService: TokenService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValid = await this.passwordHasher.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

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
