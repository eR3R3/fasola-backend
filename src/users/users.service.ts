import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService){}

  async createUser(createUserInfo: CreateUserDto){
    const foundUser = await this.prisma.user.findUnique({where:{name:createUserInfo.name}})
    if(foundUser){throw new HttpException("用户不能被重复创建", HttpStatus.CONFLICT)}
    if((createUserInfo.role==="WORKER"||createUserInfo.role==="LEADER")&&((!createUserInfo.clubName))){
      throw new HttpException("一个WORKER或者LEADER不能没有所属的部门", HttpStatus.CONFLICT)
    }
    if((!createUserInfo.clubName)&&(!createUserInfo.miniClubName)){
      if(!(createUserInfo.role==="ADMIN")){throw new HttpException("不是管理员的用户必须有所属部门", HttpStatus.CONFLICT)}
      const user = await this.prisma.user.create({
        data:{
          name:createUserInfo.name,
          phone: createUserInfo.phone,
          role: createUserInfo.role,
          gender: createUserInfo.gender,
        }
      })
      if(!user){throw new HttpException("用户创建不成功", HttpStatus.INTERNAL_SERVER_ERROR)}
      return user
    }
    if(createUserInfo.clubName&&(!createUserInfo.miniClubName)){
      const foundClub  = await this.prisma.club.findUnique({where:{name: createUserInfo.clubName}, include:{miniClub:true}})
      if(!foundClub){throw new HttpException("无法找到部门", HttpStatus.INTERNAL_SERVER_ERROR)}
      const user = await this.prisma.user.create({
        data:{
          name:createUserInfo.name,
          phone: createUserInfo.phone,
          role: createUserInfo.role,
          gender: createUserInfo.gender,
          club:{
            connect:{name: createUserInfo.clubName}
          },
          position:{
            connect:{name:createUserInfo.positionName}
          },
        }
      })
      if(!user){throw new HttpException("用户创建不成功", HttpStatus.INTERNAL_SERVER_ERROR)}
      return user
    }
    if(createUserInfo.miniClubName){
      const foundClub  = await this.prisma.club.findUnique({where:{name: createUserInfo.clubName}, include:{miniClub:true}})
      if(!foundClub){throw new HttpException("无法找到部门", HttpStatus.INTERNAL_SERVER_ERROR)}
      const possibleMiniClubNames = foundClub.miniClub.map((miniClub)=>(miniClub.name))
      if(!possibleMiniClubNames.includes(createUserInfo.miniClubName)){throw new HttpException("小组不在部门里面", HttpStatus.INTERNAL_SERVER_ERROR)}
      const user = await this.prisma.user.create({
        data:{
          name:createUserInfo.name,
          phone: createUserInfo.phone,
          role: createUserInfo.role,
          gender: createUserInfo.gender,
          club:{
            connect:{name: createUserInfo.clubName}
          },
          position:{
            connect:{name:createUserInfo.positionName}
          },

          miniClub:{
            connect:{name:createUserInfo.miniClubName}
          }
        }
      })
      if(!user){throw new HttpException("用户创建不成功", HttpStatus.INTERNAL_SERVER_ERROR)}
      return user
    }
  }

  async findAll(){
    const allUsers = await this.prisma.user.findMany({select:{
        id:true,
        phone:true,
        gender:true,
        name:true,
        role:true,
        miniClub:true,
        position:true,
        club:true
      }})
    return allUsers
  }

  async updateUser(updateUserInfo: UpdateUserDto) {
    const foundUser = await this.prisma.user.findUnique({ where: { name: updateUserInfo.name } })
    if (!foundUser) {
      throw new HttpException("无法查找到要被更新的用户", HttpStatus.CONFLICT)
    }
    if ((updateUserInfo.role === "WORKER" || updateUserInfo.role === "LEADER") && ((!updateUserInfo.clubName))) {
      throw new HttpException("一个WORKER或者LEADER不能没有所属的部门", HttpStatus.CONFLICT)
    }
    if ((!(updateUserInfo.role === "ADMIN"))&&(!updateUserInfo.positionName)) {
      throw new HttpException("不是管理员的用户必须有岗位", HttpStatus.CONFLICT)
    }
    if ((!updateUserInfo.clubName) && (!updateUserInfo.miniClubName)) {
      if (!(updateUserInfo.role === "ADMIN")) {
        throw new HttpException("不是管理员的用户必须有所属部门", HttpStatus.CONFLICT)
      }
      const user = await this.prisma.user.update({
        where:{id: updateUserInfo.id},
        data: {
          name: updateUserInfo.name,
          phone: updateUserInfo.phone,
          role: updateUserInfo.role,
          gender: updateUserInfo.gender,
        }
      })
      if (!user) {
        throw new HttpException("用户创建不成功", HttpStatus.INTERNAL_SERVER_ERROR)
      }
      return user
    }
    if (updateUserInfo.clubName && (!updateUserInfo.miniClubName)) {
      const foundClub = await this.prisma.club.findUnique({
        where: { name: updateUserInfo.clubName },
        include: { miniClub: true }
      })
      if (!foundClub) {
        throw new HttpException("无法找到部门", HttpStatus.INTERNAL_SERVER_ERROR)
      }
      const user = await this.prisma.user.update({
        where:{id: updateUserInfo.id},
        data: {
          name: updateUserInfo.name,
          phone: updateUserInfo.phone,
          role: updateUserInfo.role,
          gender: updateUserInfo.gender,
          club: {
            connect: { name: updateUserInfo.clubName }
          },
          position: {
            connect: { name: updateUserInfo.positionName }
          },
        }
      })
      if (!user) {
        throw new HttpException("用户创建不成功", HttpStatus.INTERNAL_SERVER_ERROR)
      }
      return user
    }
    if (updateUserInfo.miniClubName) {
      const foundClub = await this.prisma.club.findUnique({
        where: { name: updateUserInfo.clubName },
        include: { miniClub: true }
      })
      if (!foundClub) {
        throw new HttpException("无法找到部门", HttpStatus.INTERNAL_SERVER_ERROR)
      }
      const possibleMiniClubNames = foundClub.miniClub.map((miniClub) => (miniClub.name))
      if (!possibleMiniClubNames.includes(updateUserInfo.miniClubName)) {
        throw new HttpException("小组不在部门里面", HttpStatus.INTERNAL_SERVER_ERROR)
      }
      const user = await this.prisma.user.update({
        where:{id: updateUserInfo.id},
        data: {
          name: updateUserInfo.name,
          phone: updateUserInfo.phone,
          role: updateUserInfo.role,
          gender: updateUserInfo.gender,
          club: {
            connect: { name: updateUserInfo.clubName }
          },
          position: {
            connect: { name: updateUserInfo.positionName }
          },

          miniClub: {
            connect: { name: updateUserInfo.miniClubName }
          }
        }
      })
      if (!user) {
        throw new HttpException("用户创建不成功", HttpStatus.INTERNAL_SERVER_ERROR)
      }
      return user
    }
  }

  async findUserByName(name: string){
    return this.prisma.user.findUnique({where:{name}, include:{club: true, miniClub:true, position:true}})
  }

  async deleteUserById(id: number){
    return this.prisma.user.delete({where:{id}})
  }

  async deleteUserByName(name: string){
    return this.prisma.user.delete({where:{name}})
  }
}
