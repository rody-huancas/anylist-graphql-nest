import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignupInput } from '../auth/dto/inputs/singup.input';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create(signupInput);
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOne(id: string): Promise<User> {
    throw new Error('findOne not implemented');
  }

  async block(id: string): Promise<User> {
    throw new Error('block method not implemented');
  }

  private handleDBErrors( error: any ): never {
    if ( error.code === "23505" ){
      throw new BadRequestException( error.detail.replace('Key ', '') );
    }

    this.logger.error(error)

    throw new InternalServerErrorException('Please check server logs');
  }
}
