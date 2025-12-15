import argon2 from 'argon2';

const PASSWORD_SALT = Buffer.from('jnYSqCk5kN45HvUH');

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    salt: PASSWORD_SALT,
  });
}

export async function verifyPassword(
  hashedPassword: string,
  plainPassword: string
): Promise<boolean> {
  return argon2.verify(hashedPassword, plainPassword);
}
