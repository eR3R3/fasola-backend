import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto, UpdateQuestionDto } from './questions.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post('create')
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return await this.questionsService.createQuestion(createQuestionDto);
  }

  @Get('findAll')
  async findAllQuestions() {
    return await this.questionsService.findAllQuestions();
  }

  @Get('findOne/:name')
  async findQuestionByName(@Param("name") info: string) {
    return await this.questionsService.findQuestionByName(info);
  }

  @Post('update')
  async updateQuestion(@Body() updateQuestionDto: UpdateQuestionDto) {
    return await this.questionsService.updateQuestion(updateQuestionDto);
  }

  @Delete('delete/:id')
  async deleteQuestionById(@Param('id', ParseIntPipe) id: number) {
    return await this.questionsService.deleteQuestionById(id);
  }
} 