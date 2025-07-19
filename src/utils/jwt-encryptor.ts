import jwt from "jsonwebtoken";
import { JwtEncryptorInterface } from "../contracts/jwt-encryptor-interface";

export class JwtEncryptor implements JwtEncryptorInterface {
  constructor(
    private readonly secret: string,
    private readonly expirationTime = 24 * 60 * 60 * 1000 // 24 hours
  ) {}

  sign(payload: Record<string, any>): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expirationTime });
  }

  verify(token: string): { userId: string } | null {
    try {
      const { sub } = jwt.verify(token, this.secret);
      return { userId: sub as string };
    } catch {
      return null;
    }
  }
}

export const jwtEncryptor = new JwtEncryptor(process.env.JWT_SECRET_KEY!);
