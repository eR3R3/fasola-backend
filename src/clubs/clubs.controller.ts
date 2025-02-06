import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { CreateClubDto, UpdateClubDto } from './clubs.dto';
import { PrismaService } from '../prisma/prisma.service';
import { NameParser } from '@nestjs/schematics';

@Controller('clubs')
export class ClubsController {
  constructor(private club:ClubsService) {}

  @Post("/create")
  async createClub(@Body() createClubInfo: CreateClubDto) {
    return await this.club.createClub(createClubInfo)
  }

  @Get("/findAll")
  async findAllClubs(){
    return await this.club.findAllClubs();
  }

  @Delete("/delete/:id")
  async deleteClubById(@Param("id",ParseIntPipe) id: number){
    return await this.club.deleteClubById(id)
  }

  @Delete("/delete/name/:name")
  async deleteClubByName(@Param("name") name: string){
    return await this.club.deleteClubByName(decodeURIComponent(name))
  }


  @Post("/findOne")
  async findClubByClubName(@Body() info:{name:string}){
    return await this.club.findClubByClubName(info.name)
  }

  @Post("/update")
  async updateClubs(@Body() updateClubInfo: UpdateClubDto){
    return await this.club.updateClub(updateClubInfo)
  }

}
