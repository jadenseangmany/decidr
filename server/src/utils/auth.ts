import bcrypt from "bcrypt";

export async function hashPassword(rawPassword: string) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);
  return hashedPassword;
}

export async function verifyPassword(rawPassword: string, hashedPassword: string) {
  return await bcrypt.compare(rawPassword, hashedPassword);
}