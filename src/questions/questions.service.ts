import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto, UpdateQuestionDto } from './questions.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}



  async createQuestion(createQuestionDto: CreateQuestionDto) {
    const existingQuestion = await this.prisma.question.findUnique({
      where: { name: createQuestionDto.name },
    });

    if (existingQuestion) {
      throw new HttpException('Question already exists', HttpStatus.CONFLICT);
    }

    return await this.prisma.question.create({
      data: createQuestionDto,
    });
  }



  async findAllQuestions() {
    return await this.prisma.question.findMany({
      include:{
        miniTest: true
      }
    });
  }

  
  async findQuestionByName(name: string) {
    return await this.prisma.question.findUnique({
      where: { name },
    });
  }



  async updateQuestion(updateQuestionDto: UpdateQuestionDto) {
    const existingQuestion = await this.prisma.question.findUnique({
      where: { name: updateQuestionDto.name },
    });

    if (!existingQuestion) {
      throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
    }

    return await this.prisma.question.update({
      where: { name: updateQuestionDto.name },
      data: updateQuestionDto,
    });
  }



  async deleteQuestionByName(name: string) {
    const existingQuestion = await this.prisma.question.delete({
      where: { name },
    });
  }

  async deleteQuestionById(id: number) {
    const existingQuestion = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
    }

    return await this.prisma.question.delete({
      where: { id },
    });
  }
} 