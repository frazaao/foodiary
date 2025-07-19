import bcrypt from "bcryptjs";
import { HashEncryptorInterface } from "../contracts/hash-encryptor-inteface";

export class HashEncryptor implements HashEncryptorInterface {
  async hash(text: string): Promise<string> {
    return bcrypt.hash(text, 12);
  }

  async compare(text: string, hash: string): Promise<boolean> {
    return bcrypt.compare(text, hash);
  }
}

export const hashEncryptor = new HashEncryptor();
