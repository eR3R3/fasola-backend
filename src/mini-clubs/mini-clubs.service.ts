import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMiniClubDto } from './mini-clubs.dto';

@Injectable()
export class MiniClubsService {
  constructor(private prisma: PrismaService) {}

  async findAllMiniClubs(){
    const allMiniClubs = await this.prisma.miniClub.findMany({include:{user:true, club:true}})
    return allMiniClubs
  }

  async deleteMiniClubById(id: number){
    const miniClub = await this.prisma.miniClub.delete({where:{id}})
    return miniClub
  }

  async deleteMiniClubByName(name: string){
    const miniClub = await this.prisma.miniClub.delete({where:{name}})
    return miniClub
  }

  async findMiniClubByName(name: string){
    const miniClub = await this.prisma.miniClub.findUnique({where:{name}, include:{user:true, club:true}})
    return miniClub
  }

  async updateMiniClubById(updateMiniClubInfo: UpdateMiniClubDto){
    try{
      const foundMiniClub = await this.prisma.miniClub.findUnique({where:{id: updateMiniClubInfo.id}})
      if(!foundMiniClub){throw new NotFoundException("不能找到要更新的小组")}
      if(updateMiniClubInfo.user.map(user=>user.role).filter(each=>each==="LEADER").length>=2){
        throw new HttpException("一个部门不能有一个以上的LEADER", HttpStatus.CONFLICT)
      }
      if(updateMiniClubInfo.user&&updateMiniClubInfo.club) {
        updateMiniClubInfo.user.map(async (user) => {
          await this.prisma.user.update({
            where: {
              name: user.name
            },
            data: {
              role: user.role,
              club: {
                connect:{ name: updateMiniClubInfo.club }
              }
            }
          })
        })

        const updatedMiniClub = await this.prisma.miniClub.update({
          where: {
            id: updateMiniClubInfo.id
          },
          data: {
            name: updateMiniClubInfo.name,
            club: {
              connect: { name: updateMiniClubInfo.club }
            },
            user: {
              set: updateMiniClubInfo.user.map(user => ({
                name: user.name
              }))
            }
          }
        })
        return updatedMiniClub
      }else{
        throw new NotFoundException("找不到数据联系15395791695")
      }

    }catch (err){
      console.log(err)
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
