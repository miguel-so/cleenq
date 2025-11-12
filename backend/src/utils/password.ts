import bcrypt from "bcryptjs";
import env from "../config/env";

export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(env.PASSWORD_SALT_ROUNDS);
  return bcrypt.hash(plain, salt);
}

export function comparePassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
}

