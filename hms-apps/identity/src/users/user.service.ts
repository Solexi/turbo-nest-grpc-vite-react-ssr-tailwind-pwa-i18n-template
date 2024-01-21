/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  Users,
} from '@common/hms-lib';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  onModuleInit() {
    // You may choose to remove this method if you don't want to initialize data on module start
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      ...createUserDto,
      id: randomUUID(),
      backupEmailAddress: '',
      phone: {},
      isPrimaryEmailAddressVerified: false,
      isBackupEmailAddressVerified: false,
      passwordHash: randomUUID(),
    });
    return this.userRepository.save(user);
  }

async findAll(): Promise<Users> {
    const users = await this.userRepository.find();
    return { users: users.map(user => ({ ...user, id: user.id || '' })) };
}

async findOne(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
}

async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
        this.userRepository.merge(user, updateUserDto);
        return this.userRepository.save(user);
    }
    throw new NotFoundException(`User not found by id ${id}`);
}

async remove(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
        await this.userRepository.remove(user);
        return user;
    }
    throw new NotFoundException(`User not found by id ${id}`);
}

queryUsers(): Observable<Users> {
    // Your existing logic
    return new Observable<Users>();
}

async findOneUserByPrimaryEmailAddress(
    primaryEmailAddress: string,
): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { primaryEmailAddress } });
}
}
