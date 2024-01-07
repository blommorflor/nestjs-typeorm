import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);

    return await this.userRepository.save(user);
  }

  async findOneById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async update(id: number, { fullName, email, age, password }: UpdateUserDto) {
    const emailExits = await this.findOneByEmail(email);

    if (email) {
      // if the email is already taked by another use it is not possible to update
      if (emailExits && emailExits.id != id) {
        throw new BadRequestException('This email already exits');
      }
    }

    if (password) {
      password = await bcryptjs.hash(password, 10);
    } else {
      password = emailExits.password;
    }

    return await this.userRepository.update(id, {
      fullName,
      email,
      age,
      password,
    });
  }
}
