import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse } from './types/auth-response.type';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginInput, SignupInput } from './dto/inputs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation( () => AuthResponse, { name: 'signup' } )
  async signup(
    @Args('signupInput') signupInput: SignupInput
  ): Promise<AuthResponse> {
    return this.authService.signup( signupInput );
  }

  @Mutation( () => AuthResponse , { name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthResponse> {
    return this.authService.login( loginInput );
  }

  @Query( () => AuthResponse, { name: 'revalidate' } )
  @UseGuards( JwtAuthGuard )
  revalidateToken(
    // @CurrentUser user: User
  ): AuthResponse {
    
    // return this.authService.revalidateToken()
    throw new Error("Not implemented");
  }
}
