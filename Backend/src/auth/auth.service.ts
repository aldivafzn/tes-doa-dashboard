import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateJwtToken(email: string, userId: string, role: string) {
    const payload = { email, userId, role };
    return this.jwtService.sign(payload);
  }
}
