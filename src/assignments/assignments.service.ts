import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssignmentDto, UpdateAssignmentDto, UpdateAssignmentStateDto } from './assignments.dto';
import { TestStatus } from '@prisma/client';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async findAllAssignments(){
    const allAssignments = await this.prisma.testAssignment.findMany({include:{test:true, reviewer:true, reviewee:true}})
    return allAssignments
  }

  async findAssignmentById(id: number){
    const assignment = await this.prisma.testAssignment.findUnique({where:{id}, include:{test:true, reviewer:true, reviewee:true}})
    return assignment
  }

  async createAssignment(createAssignmentDto: CreateAssignmentDto){
    console.log(createAssignmentDto)
    const test = await this.prisma.test.findUnique({where:{name:createAssignmentDto.test}})
    if(!test){ throw new NotFoundException('Test not found') }
    if(createAssignmentDto.reviewer.some(r => createAssignmentDto.reviewee.includes(r))) {
      throw new HttpException('Reviewer and reviewee lists cannot overlap', HttpStatus.BAD_REQUEST);
    }
    
    for (const reviewer of createAssignmentDto.reviewer){
      for (const reviewee of createAssignmentDto.reviewee){
        await this.prisma.testAssignment.create({
          data: {
            test: { connect: { name: test.name } },
            reviewer: { connect: { name: reviewer } },
            reviewee: { connect: { name: reviewee } },
            status: TestStatus.PENDING
          }
        });
      }
    }
    return {message: 'Assignments created successfully'}
  }

  async updateAssignment(updateAssignmentDto: UpdateAssignmentDto) {
    const assignment = await this.prisma.testAssignment.update({
      where: { id: updateAssignmentDto.id },
      data: { 
        scoreSet: updateAssignmentDto.scoreSet,
      }
    });
    return assignment;
  }

  async deleteAssignment(id: number){
    const assignment = await this.prisma.testAssignment.delete({where:{id}})
    return assignment
  }
    
  async updateAssignmentState(updateAssignmentStateDto: UpdateAssignmentStateDto){
    const assignment = await this.prisma.testAssignment.update({where:{id:updateAssignmentStateDto.id}, data:{status:updateAssignmentStateDto.state}})
    return assignment
  }
}
