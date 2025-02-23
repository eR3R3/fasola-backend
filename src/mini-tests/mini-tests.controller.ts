import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { MiniTestsService } from './mini-tests.service';
import { CreateMiniTestDto, UpdateMiniTestDto } from './mini-tests.dto';

@Controller('miniTests')
export class MiniTestsController {
  constructor(private readonly miniTestsService: MiniTestsService) {}

  @Post('create')
  async createMiniTest(@Body() createMiniTestDto: CreateMiniTestDto) {
    return await this.miniTestsService.createMiniTest(createMiniTestDto);
  }

  @Get('findAll')
  async findAllMiniTests() {
    return await this.miniTestsService.findAllMiniTests();
  }

  @Get('findOne/:name')
  async findMiniTestById(@Param('name') name: string) {
    return await this.miniTestsService.findMiniTestByName(name);
  }



  // @Post('update')
  // async updateMiniTest(@Body() updateMiniTestDto: UpdateMiniTestDto) {
  //   return await this.miniTestsService.updateMiniTest(updateMiniTestDto);
  // }

  @Delete('delete/:id')
  async deleteMiniTest(@Param('id', ParseIntPipe) id: number) {
    return await this.miniTestsService.deleteMiniTest(id);
  }
}
