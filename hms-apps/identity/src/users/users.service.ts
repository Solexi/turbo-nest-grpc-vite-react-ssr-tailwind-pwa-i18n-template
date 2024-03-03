/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
//import { CreateUserDto } from './dto/create-user.dto';
//import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto, PaginationDto, UpdateUserDto, Users } from '@common/hms-lib';
import { User as UserProp} from '@common/hms-lib';
import { randomUUID } from 'crypto';
import { Observable, Subject } from 'rxjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
// export class UsersService implements OnModuleInit{
export class UsersService {
  //static user data for demo purpose only
  private readonly users:User[] = [];
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>){}

  // onModuleInit() {
  //     for (let i=0; i <= 100; i++){
  //       const createUserDto: CreateUserDto = {
  //         primaryEmailAddress: `piosystems${i}@yahoo.co.uk`,
  //         passwordHash: randomUUID(),
  //         firstName: `Pio${i}`,
  //         lastName: `Systems${i}`
  //       }
  //       this.create(createUserDto)
  //     }
  // }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findOneUserByPrimaryEmailAddress(createUserDto.primaryEmailAddress);

    if (user) {
      throw new Error('User already exists');
    }

    const userProps: UserProp = {
      ...createUserDto,
      passwordHash: "",
      isBackupEmailAddressVerified: false,
      isPrimaryEmailAddressVerified: false,
      id: '',
      backupEmailAddress: '',
      phone: {}
    }

    const newUser = this.userRepository.create(userProps);

    // const user:User = { //these should be from entity
    //   ...createUserDto,
    //   id: randomUUID(),
    //   primaryEmailAddress: createUserDto.primaryEmailAddress,
    //   firstName: createUserDto.firstName,
    //   lastName: createUserDto.lastName,
    //   backupEmailAddress: '',
    //   phone: {},
    //   isPrimaryEmailAddressVerified: false,
    //   isBackupEmailAddressVerified: false,
    //   passwordHash: randomUUID()
    // }
    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    // return this.users.find((user) => user.id === id);
    return await this.userRepository.findOneBy({id}) 
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // const userIndex = this.users.findIndex((user) => user.id === id);
    // if (userIndex !== -1){
    //   this.users[userIndex] = {
    //     ...this.users[userIndex],
    //     ...updateUserDto
    //   }
    //   return this.users[userIndex]
    // }
    // throw new NotFoundException(`User not found by id ${id}`);

    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User not found by id ${id}`);
    }

    Object.apply(user, updateUserDto);

    return await this.userRepository.save(user);
  }


  async remove(id: string) {
    // const userIndex = this.users.findIndex((user) => user.id === id);
    // if (userIndex !== -1){
    //   return this.users.splice(userIndex)[0];
    // }
    // throw new NotFoundException(`User not found by id ${id}`);

    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User not found by id ${id}`);
    }

    return await this.userRepository.remove(user);
  }

  queryUsers(paginationDtoStream: Observable<PaginationDto>): Observable<Users>{
    const subject = new Subject<Users>();
    const onNext = async (paginationDto: PaginationDto) => {
      const start = paginationDto.page * paginationDto.skip;
      subject.next({
        users: (await this.findAll()).map(user => ({
          ...user,
          id: user.id || '' // Ensure the 'id' property is not optional
        })).slice(start, start + paginationDto.skip)
      });
    };

    const onComplete = () => subject.complete();

    paginationDtoStream.subscribe({
      next: onNext,
      complete: onComplete
    });

    return subject.asObservable();

  }

  async findOneUserByPrimaryEmailAddress(primaryEmailAddress: string): Promise<User> {
    // return this.users.find((user) => user.primaryEmailAddress === primaryEmailAddress);
    return await this.userRepository.findOneBy({primaryEmailAddress});
  }
}
