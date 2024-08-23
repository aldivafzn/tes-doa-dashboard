import * as bcrypt from 'bcrypt';

export class HelperService {
  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new Error('Password is required');
    }
    // Use bcrypt to hash the password
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    if (!password || !hashedPassword) {
      throw new Error('Password and hashed password are required');
    }
    return bcrypt.compare(password, hashedPassword);
  }
}
