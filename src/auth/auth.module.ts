import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthResolver } from './auth.resolver';

@Module({
  providers: [AuthResolver, AuthService],
  imports: [UsersModule]
})
export class AuthModule {}
