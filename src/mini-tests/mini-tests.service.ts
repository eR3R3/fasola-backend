import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMiniTestDto, UpdateMiniTestDto } from './mini-tests.dto';

@Injectable()
export class MiniTestsService {
  constructor(private prisma: PrismaService) {}

  async createMiniTest(createMiniTestInfo: CreateMiniTestDto) {
    const existingMiniTest = await this.prisma.miniTest.findUnique({
      where: { name: createMiniTestInfo.name },
    });

    if (existingMiniTest) {
      throw new HttpException('Mini test already exists', HttpStatus.CONFLICT);
    }

    if (createMiniTestInfo.question.map((q)=>(q.name)).filter(Boolean).length===0){
      throw new NotFoundException("需要输入问题")
    }

    const proportion: number[] = createMiniTestInfo.question.map((q)=>(q.proportion))
    if(proportion.reduce((sum, current)=> current+sum, 0)!=1.0){
      throw new HttpException("占比加起来不是1", HttpStatus.CONFLICT)
    }

    return await this.prisma.miniTest.create({
      data: {
        name: createMiniTestInfo.name,
        question: {
          connect: createMiniTestInfo.question.map((q)=>({name: q.name}))
        },
        proportion: proportion
      },
      include: {
        question: true
      },
    });
  }

  async findAllMiniTests() {
    return await this.prisma.miniTest.findMany({
      include: { question: true }
    });
  }

  async findMiniTestByName(name: string) {
    const miniTest = await this.prisma.miniTest.findUnique({
      where: { name },
      include: {
        question: true,
        test: true,
      },
    });

    if (!miniTest) {
      throw new HttpException('Mini test not found', HttpStatus.NOT_FOUND);
    }

    return miniTest;
  }

  // async updateMiniTest(updateMiniTestDto: UpdateMiniTestDto) {
  //   const { id, questions, ...updateData } = updateMiniTestDto;

  //   const existingMiniTest = await this.prisma.miniTest.findUnique({
  //     where: { id },
  //   });

  //   if (!existingMiniTest) {
  //     throw new HttpException('Mini test not found', HttpStatus.NOT_FOUND);
  //   }

  //   // First delete all existing question relationships
  //   await this.prisma.miniTestQuestion.deleteMany({
  //     where: { miniTestId: id },
  //   });

  //   // Then update the mini test with new data
  //   return await this.prisma.miniTest.update({
  //     where: { id },
  //     data: {
  //       ...updateData,
  //       questions: questions ? {
  //         create: questions.map(q => ({
  //           question: { connect: { id: q.questionId } },
  //           proportion: q.proportion,
  //         }))
  //       } : undefined,
  //     },
  //     include: {
  //       questions: {
  //         include: {
  //           question: true,
  //         },
  //       },
  //     },
  //   });
  // }

  async deleteMiniTest(id: number) {
    const existingMiniTest = await this.prisma.miniTest.findUnique({
      where: { id },
    });

    if (!existingMiniTest) {
      throw new HttpException('Mini test not found', HttpStatus.NOT_FOUND);
    }

    return await this.prisma.miniTest.delete({
      where: { id },
    });
  }
}
