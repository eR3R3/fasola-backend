import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { UpdatePositionDto } from './positions.dto';

@Controller('positions')
export class PositionsController {
  constructor(private position: PositionsService) {}

  @Get("/findAll")
  async findAllPositions(){
    return await this.position.findAllPositions()
  }

  @Delete("/delete/:id")
  async deletePositionById(@Param("id",ParseIntPipe) id: number){
    return await this.position.deletePositionById(id)
  }

  @Delete("/delete/name/:name")
  async deletePositionByName(@Param("name") name: string){
    return await this.position.deletePositionByName(decodeURIComponent(name))
  }

  @Post("/findOne")
  async findPositionByName(@Body() findPositionInfo: {name: string}){
    return await this.position.findPositionByName(findPositionInfo.name)
  }

  @Post("update")
  async updatePosition(@Body() updatePositionInfo: UpdatePositionDto){
    return await this.position.updatePosition(updatePositionInfo)
  }
}
