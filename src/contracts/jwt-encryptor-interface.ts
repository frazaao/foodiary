export interface JwtEncryptorInterface {
  sign(payload: Record<string, any>): string;
  verify(token: string): { userId: string } | null;
}
