import { Injectable } from '@nestjs/common';
import { SignupInput } from './dto/inputs/singup.input';
import { UsersService } from 'src/users/users.service';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signupInput);

    const token = 'ABC';

    return { token, user };
  }

  async login() {}

  async revalidate() {}
}
