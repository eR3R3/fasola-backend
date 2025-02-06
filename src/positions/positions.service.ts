import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePositionDto } from './positions.dto';

@Injectable()
export class PositionsService {
  constructor(private prisma: PrismaService) {}

  async findAllPositions(){
    const allPositions = await this.prisma.position.findMany({include: {club:true, user:true}})
    return allPositions
  }

  async deletePositionById(id: number){
    const deletedPosition = await this.prisma.position.delete({where:{id: id}})
  }

  async deletePositionByName(name: string){
    const deletedPosition = await this.prisma.position.delete({where:{name}})
  }

  async findPositionByName(name: string){
    const foundPosition = await this.prisma.position.findUnique({where:{name}, include: {club:true, user:true}})
    return foundPosition
  }

  async updatePosition(updatePositionInfo: UpdatePositionDto){
    const foundPosition = this.prisma.position.findUnique({where:{id: updatePositionInfo.id}})
    if(!foundPosition){throw new NotFoundException("无法找到要更新的岗位")}
    const updatedPosition = await this.prisma.position.update({
      where:{
        id: updatePositionInfo.id
      },
      data:{
        name: updatePositionInfo.name,
        club: {
          set: updatePositionInfo.club.map(club=>({name:club.name}))
        },
        user:{
          set: updatePositionInfo.user.map(user=>({name:user.name}))
        }
      }
    })
    console.log(updatedPosition)
    return updatedPosition
  }
}

