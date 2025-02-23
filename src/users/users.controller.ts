import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Controller('users')
export class UsersController {

  constructor(private user: UsersService) {}

  @Post('/create')
  async createUser(@Body() createUserInfo: CreateUserDto){
    return await this.user.createUser(createUserInfo)
  }

  @Get("/findAll")
  async findAllUsers(){
    return await this.user.findAll()
  }

  @Post("/update")
  async updateUser(@Body() updateUserInfo: UpdateUserDto){
    return await this.user.updateUser(updateUserInfo)
  }

  @Post("/findOne")
  async findUserByName(@Body() findUserInfo: {name: string}){
    console.log(1, findUserInfo)
    const user = await this.user.findUserByName(findUserInfo.name)
    console.log(2, user)
    return user
  }

  @Delete("/delete/:id")
  async deleteUserById(@Param('id',ParseIntPipe)  id: number){
    return await this.user.deleteUserById(id)
  }

  @Delete("/delete/name/:name")
  async deleteUserByName(@Param('name')  name: string){
    return await this.user.deleteUserByName(name)
  }
}
