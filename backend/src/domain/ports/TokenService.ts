export interface TokenPayload {
  userId: string;
  email: string;
}

export interface TokenService {
  generate(payload: TokenPayload): string;
  verify(token: string): TokenPayload | null;
}
