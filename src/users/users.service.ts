import * as bcrypt from "bcrypt"
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ValidRoles } from "src/auth/enums/valid-roles.enum";
import { SignupInput } from '../auth/dto/inputs/singup.input';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {

    if ( roles.length === 0 ) 
      return this.userRepository.find({
        // relations: {
        //   lastUpdateBy: true,
        // }
      }); 

    return this.userRepository.createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email })
    } catch (error) {
      throw new NotFoundException(`${email} not found`);
      // this.handleDBErrors({
      //   code: "error-001",
      //   detail: `${ email } not found`
      // });
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id })
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  async update(id: string, updateUserInput: UpdateUserInput, updateBy: User): Promise<User> {
    try {
      const user = await this.userRepository.preload({
        ...updateUserInput,
        id
      })

      user.lastUpdateBy = updateBy;

      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.findOneById(id);

    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;

    return await this.userRepository.save(userToBlock);
  }

  private handleDBErrors( error: any ): never {
    if ( error.code === "23505" ) throw new BadRequestException( error.detail.replace('Key ', '') );
    if ( error.code === "error-001" ) throw new BadRequestException( error.detail.replace('Key ', '') );

    this.logger.error(error)

    throw new InternalServerErrorException('Please check server logs');
  }
}
