import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClubDto, UpdateClubDto } from './clubs.dto';
import { Position } from '@prisma/client';

@Injectable()
export class ClubsService {

  constructor(private prisma: PrismaService) {}

  async createClub(createClubInfo: CreateClubDto){
    const foundClub = await this.prisma.club.findUnique({where:{name:createClubInfo.name}})
    const foundMiniClubs = await this.prisma.miniClub.findMany({where:{name: {in:createClubInfo.miniClubs.map((miniClub)=>(miniClub.name))}}})
    if(foundClub){throw new HttpException("不能创建重复的部门", HttpStatus.CONFLICT)}
    if(!createClubInfo.name){throw new HttpException("请输出部门名字", HttpStatus.BAD_REQUEST)}
    if(createClubInfo.positions.length===0||createClubInfo.positions.map(position=>position.name).filter(Boolean).length===0){throw new HttpException("请输入岗位名字", HttpStatus.BAD_REQUEST)}
    console.log(foundMiniClubs.length)
    if(foundMiniClubs.length){throw new HttpException("不能创建重复的小组", HttpStatus.CONFLICT)}

    if(!(createClubInfo.miniClubs.map(miniClub=>miniClub.name).filter(Boolean).length===0)){
      const club = await this.prisma.club.create({
        data: {
          name: createClubInfo.name,
          miniClub: {
            createMany: {
              data: createClubInfo.miniClubs
            }
          },
          position: {
            connectOrCreate: createClubInfo.positions.map((position) => ({
              where: { name: position.name },
              create: { name: position.name }
            }))
          }
        },
        select: {
          name: true,
          miniClub: {
            select: {
              name: true
            }
          },
          position: {
            select: {
              name: true
            }
          }
        }
      })
      console.log(club)
      return club
    }else {
      const club = await this.prisma.club.create({
        data: {
          name: createClubInfo.name,
          position: {
            connectOrCreate: createClubInfo.positions.map((position) => ({
              where: { name: position.name },
              create: { name: position.name }
            }))
          }
        },
        select: {
          name: true,
          position: {
            select: {
              name: true
            }
          }
        }
      })
      console.log(club)
      return club
    }


  }

  async updateClub(updateClubInfo: UpdateClubDto){
    const foundClub = await this.prisma.club.findUnique({where:{id:updateClubInfo.id}})
    if(!foundClub){throw new HttpException("无法找到要更新的部门", 409)}
    const updatedClub = await this.prisma.club.update({where:{id: updateClubInfo.id}, data: {
        name: updateClubInfo.name,
        miniClub: {
          deleteMany: { name: { notIn: updateClubInfo.miniClubs.map((miniClub) => (miniClub.name)) } },
          connectOrCreate: updateClubInfo.miniClubs.map(miniClub => ({
            where: { name: miniClub.name },
            create: { name: miniClub.name }
          }))
        },
        position: {
          deleteMany: {
            name: {
              notIn: updateClubInfo.positions.map((position) => (position.name))
            }
          },
          connectOrCreate: updateClubInfo.positions.map(position => ({
            where: { name: position.name },
            create: { name: position.name }
          }))
        },
      },
      include: {
        position: true,
        miniClub: true
      }
    })
    return updatedClub
  }

  async deleteClubById(id: number){
    const deletedClub =  await this.prisma.club.delete({ where: {id} });
    return deletedClub
  }

  async deleteClubByName(name: string){
    const deletedClub =  await this.prisma.club.delete({ where: {name} });
    return deletedClub
  }

  async findAllClubs(){
    const allClubs = await this.prisma.club.findMany({select:{
        id:true,
        name:true,
        user:{
          select:{
            id:true,
            name:true,
            role:true,
            gender:true,
            position:true,
            club:true,
            miniClub:true
          }
        },
        miniClub:{
          select:{
            name:true,
            user: {
              select:{
                id:true,
                name:true,
                role:true,
                gender:true,
                position:true,
                club:true,
                miniClub:true
              }
            }
          }
        },
        position:{
          select:{
            name:true,
            user:{
              select:{
                id:true,
                name:true,
                role:true,
                gender:true,
                position:true,
                club:true,
                miniClub:true
              }
            }
          }
        }
      }});
    return allClubs
  }

  async findClubByClubName(name: string){
    const club = await this.prisma.club.findUnique({where:{name}, select:{
      id:true,
      name:true,
      user:{
        select:{
          id:true,
          name:true,
          role:true,
          gender:true,
          position:true,
          club:true,
          miniClub:true
        }
      },
      miniClub:{
        select:{
          name:true,
          user: {
            select:{
              id:true,
              name:true,
              role:true,
              gender:true,
              position:true,
              club:true,
              miniClub:true
            }
          }
        }
      },
      position:{
        select:{
          name:true,
          user:{
            select:{
              id:true,
              name:true,
              role:true,
              gender:true,
              position:true,
              club:true,
              miniClub:true
            }
          }
        }
      }
      }})
    if(!club){throw new HttpException("没有找到的部门", HttpStatus.NOT_FOUND)}
    return club
  }
}
