/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
//import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
//import { CreateUserDto } from './dto/create-user.dto';
//import { UpdateUserDto } from './dto/update-user.dto';
import {
  UsersServiceController,
  CreateUserDto,
  UpdateUserDto,
  UsersServiceControllerMethods,
  FindOneUserDto,
  PaginationDto,
  FindOneUserByPrimaryEmailAddressDto,
  Users,
} from '@common/hms-lib';
import { Observable } from 'rxjs';
import { User } from './entities/user.entity';

@Controller()
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController {
  constructor(private readonly usersService: UsersService) { }

  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  async findAllUsers(): Promise<Users> {
    const users = await this.usersService.findAll();
    return { users }; // Assuming 'users' is the property expected by the interface
  }

  findOneUser(findOneUserDto: FindOneUserDto): Promise<User>{
    return this.usersService.findOne(findOneUserDto.id);
  }

  updateUser(updateUserDto: UpdateUserDto): Promise<User>{
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  removeUser(findOneUserDto: FindOneUserDto) {
    return this.usersService.remove(findOneUserDto.id);
  }

  queryUsers(paginationDtoStream: Observable<PaginationDto>): Observable<Users> {
    return this.usersService.queryUsers(paginationDtoStream);
  }

  findOneUserByPrimaryEmailAddress(
    findOneUserByPrimaryEmailAddressDto: FindOneUserByPrimaryEmailAddressDto,
  ): Promise<User> {
    return this.usersService.findOneUserByPrimaryEmailAddress(
      findOneUserByPrimaryEmailAddressDto.primaryEmailAddress,
    );
  }
}
