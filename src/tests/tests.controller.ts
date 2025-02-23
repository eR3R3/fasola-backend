import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto, UpdateTestDto } from './tests.dto';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post('create')
  async createTest(@Body() createTestDto: CreateTestDto) {
    return await this.testsService.createTest(createTestDto);
  }

  @Get('findAll')
  async findAllTests() {
    return await this.testsService.findAllTests();
  }

  @Get('findOne/:name')
  async findTestById(@Param('name') name: string) {
    return await this.testsService.findTestByName(name);
  }

  @Delete('delete/:id')
  async deleteTest(@Param('id', ParseIntPipe) id: number) {
    return await this.testsService.deleteTest(id);
  }
}
