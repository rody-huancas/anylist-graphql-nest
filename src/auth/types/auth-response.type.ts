import { User } from 'src/users/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field( () => String )
  token: string;

  @Field( () => User )
  user: User;
}
