import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { v4 as uuid4 } from 'uuid';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async create(userDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.firstName = userDto.firstName;
    user.lastName = userDto.lastName;
    user.email = userDto.email;
    user.apiKey = uuid4();

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(userDto.password, salt);

    const savedUser = await this.userRepository.saveUser(user);
    delete savedUser.password;
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    if (!users) {
      throw new NotFoundException('Users not found');
    }
    return users;
  }

  async findOne(data: LoginDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Could not find user.');
    }
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) throw new NotFoundException('User not found in the database');
    return user;
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.userRepository.deleteUser(id);
  }

  async updateSecretKey(userId, secret: string): Promise<UpdateResult> {
    return this.userRepository.update(
      {
        id: userId,
      },
      {
        twoFASecret: secret,
        enable2FA: true,
      },
    );
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userRepository.update(
      {
        id: userId,
      },
      {
        enable2FA: false,
        twoFASecret: null,
      },
    );
  }

  async findByApiKey(apiKey: string): Promise<User> {
    return this.userRepository.findOneBy({ apiKey });
  }
}
