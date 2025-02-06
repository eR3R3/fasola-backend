import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { MiniClubsService } from './mini-clubs.service';
import { UpdateMiniClubDto } from './mini-clubs.dto';

@Controller('miniClubs')
export class MiniClubsController {
  constructor(private miniClub: MiniClubsService) {}

  @Get("findAll")
  async findAllMiniClubs(){
    return await this.miniClub.findAllMiniClubs()
  }

  @Delete("/delete/:id")
  async deleteMiniClubById(@Param("id",ParseIntPipe) id: number){
    return await this.miniClub.deleteMiniClubById(id)
  }

  @Delete("/delete/name/:name")
  async deleteMiniClubByName(@Param("name") name: string){
    console.log(name)
    return await this.miniClub.deleteMiniClubByName(decodeURIComponent(name))
  }

  @Post("/findOne")
  async findMiniClubByName(@Body() findMiniClubInfo: {name: string}){
    return await this.miniClub.findMiniClubByName(findMiniClubInfo.name)
  }

  @Post('/update')
  async updateMiniClub(@Body() updatedMiniClubInfo){
    return await this.miniClub.updateMiniClubById(updatedMiniClubInfo)
  }
}
