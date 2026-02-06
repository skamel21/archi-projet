import jwt from 'jsonwebtoken';
import { TokenService, TokenPayload } from '../../domain/ports/TokenService';

export class JwtTokenService implements TokenService {
  constructor(
    private secret: string,
    private expiresIn: string = '24h',
  ) {}

  generate(payload: TokenPayload): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as any);
  }

  verify(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret) as TokenPayload;
      return { userId: decoded.userId, email: decoded.email };
    } catch {
      return null;
    }
  }
}
