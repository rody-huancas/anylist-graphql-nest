import * as bcrypt from "bcrypt"
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthResponse } from './types/auth-response.type';
import { LoginInput, SignupInput } from './dto/inputs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signupInput);

    const token = 'ABC';

    return { token, user };
  }

  async login( loginInput: LoginInput ): Promise<AuthResponse> {
    const { email, password } = loginInput;

    const user = await this.usersService.findOneByEmail(email);

    if ( !bcrypt.compareSync( password, user.password ) ) {
      throw new BadRequestException("Email / Password do not match");
    }

    const token = "ABC";

    return {
      token, 
      user
    }
  }

  async revalidate() {}
}
