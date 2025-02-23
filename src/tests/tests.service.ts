import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestDto, UpdateTestDto } from './tests.dto';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async createTest(createTestInfo: CreateTestDto) {
    console.log('Received create test request:', createTestInfo);

    const existingTest = await this.prisma.test.findUnique({
      where: { name: createTestInfo.name },
    });

    if (existingTest) {
      throw new HttpException('Test already exists', HttpStatus.CONFLICT);
    }

    if (!createTestInfo.miniTest || !Array.isArray(createTestInfo.miniTest) || createTestInfo.miniTest.length === 0) {
      throw new HttpException("需要输入小测试", HttpStatus.BAD_REQUEST);
    }

    // Add validation for mini tests existence
    const miniTestNames = createTestInfo.miniTest.map(m => m.name);
    const existingMiniTest = await this.prisma.miniTest.findMany({
      where: {
        name: {
          in: miniTestNames
        }
      }
    });

    if (existingMiniTest.length !== miniTestNames.length) {
      const foundNames = existingMiniTest.map(m => m.name);
      const missingNames = miniTestNames.filter(name => !foundNames.includes(name));
      throw new HttpException(
        `找不到以下小测试: ${missingNames.join(', ')}`, 
        HttpStatus.BAD_REQUEST
      );
    }

    const proportion: number[] = createTestInfo.miniTest.map((m) => (m.proportion));
    const sum = proportion.reduce((sum, current) => sum + current, 0);
    console.log('Proportion sum:', sum);
    
    if (Math.abs(sum - 1.0) > 0.000001) {
      throw new HttpException(`占比加起来不是1 (当前总和: ${sum})`, HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.prisma.test.create({
        data: {
          name: createTestInfo.name,
          miniTest: {
            connect: createTestInfo.miniTest.map((m) => ({ name: m.name }))
          },
          proportion: proportion
        },
        include: {
          miniTest: true
        }
      });
    } catch (error) {
      console.error('Create test error:', error);
      throw new HttpException('创建测试失败', HttpStatus.BAD_REQUEST);
    }
  }

  async findAllTests() {
    return await this.prisma.test.findMany({
      include: {
        miniTest: {
          include: {
            question: true
          }
        }
      }
    });
  }

  async findTestByName(name: string) {
    const test = await this.prisma.test.findUnique({
      where: { name },
      include: {
        miniTest: {
          include: {
            question: true
          }
        },
        assignment: true
      },
    });

    if (!test) {
      throw new HttpException('Test not found', HttpStatus.NOT_FOUND);
    }

    return test;
  }

  async deleteTest(id: number) {
    const existingTest = await this.prisma.test.findUnique({
      where: { id },
    });

    if (!existingTest) {
      throw new HttpException('Test not found', HttpStatus.NOT_FOUND);
    }

    return await this.prisma.test.delete({
      where: { id },
    });
  }
}
