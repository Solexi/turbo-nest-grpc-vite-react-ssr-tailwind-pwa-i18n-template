/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
//Adjust below for microservice proxy. You can delete the users/dto and users/entities folders generated
//import { CreateUserDto } from './dto/create-user.dto';
//import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto, UpdateUserDto } from '@common/hms-lib';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('use-paginated-users')
  usePaginatedUsers() {
    return this.usersService.usePaginatedUsers();
  }

  @Get('find-one-user-by-primary-email-address/:primaryEmailAddress')
  findOneUserByPrimaryEmailAddress(
    @Param('primaryEmailAddress') primaryEmailAddress: string,
  ) {
    return this.usersService.findOneUserByPrimaryEmailAddress(
      primaryEmailAddress,
    );
  }
}
