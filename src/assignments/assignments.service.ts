import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssignmentDto, UpdateAssignmentScoreDto, UpdateAssignmentStateDto } from './assignments.dto';
import { TestStatus } from '@prisma/client';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async findAllAssignments(){
    const allAssignments = await this.prisma.testAssignment.findMany({include:{test:true, reviewer:true, reviewee:true}})
    return allAssignments
  }

  async createAssignment(createAssignmentDto: CreateAssignmentDto){
    console.log(createAssignmentDto)
    const test = await this.prisma.test.findUnique({where:{name:createAssignmentDto.test}})
    if(!test){ throw new NotFoundException('Test not found') }
    if (createAssignmentDto.assignmentType == "person") {
      const reviewers = createAssignmentDto.assignments.map(assignment => {
        console.log(assignment)
        if (assignment.reviewers.length == 1) {
          return assignment.reviewers[0]
        } else {
          throw new HttpException('每个问题只能有一个评价者', HttpStatus.BAD_REQUEST);
        }
      })
      const reviewersWithoutOverlap = reviewers.filter((value, index, self) => self.indexOf(value) === index)
      if(reviewersWithoutOverlap.length != createAssignmentDto.reviewers.length) {
        throw new HttpException('选择的所有评价者都一定要去评价一个问题', HttpStatus.BAD_REQUEST);
      }
      if(createAssignmentDto.reviewers.some(r => createAssignmentDto.reviewees.includes(r))) {
        throw new HttpException('Reviewer and reviewee lists cannot overlap', HttpStatus.BAD_REQUEST);
      }
      
      for (const reviewee of createAssignmentDto.reviewees) {
        const createdAssignment = await this.prisma.testAssignment.create({
          data: {
            test: { connect: { name: test.name } },
            questionRecord: reviewers,
            reviewer: { connect: reviewersWithoutOverlap.map(reviewer => ({ name: reviewer }))},
            reviewee: { connect: { name: reviewee } },
            status: TestStatus.PENDING
          }
        })
        console.log(createdAssignment)
      }

    } else if (createAssignmentDto.assignmentType == "miniClub") {

    } else if (createAssignmentDto.assignmentType == "club") {

    } else {
      throw new HttpException('Invalid assignment type', HttpStatus.BAD_REQUEST);
    }
    return {message: 'Assignments created successfully'}
  }

  async updateAssignmentScore(updateAssignmentScoreDto: UpdateAssignmentScoreDto) {
    const assignment = await this.prisma.testAssignment.findUnique({
      where: {id: updateAssignmentScoreDto.id},
      include: {
        test: {
          include: {
            miniTest: true
          }
        }
      }
    })
    if(!assignment){ throw new NotFoundException('Assignment not found') }
    
    let finalScoreSet: number[] = []
    const originalScoreSet = assignment.scoreSet
    const submittedScoreSet = updateAssignmentScoreDto.scoreSet
    
    // Check if this is first submission or resubmission
    if(originalScoreSet.filter(Boolean).length == 0) {
      // First submission - convert nulls to -1
      finalScoreSet = submittedScoreSet.map(score => score === null ? -1 : score)
    } else {
      // Allow resubmission - merge scores, giving preference to new non-null scores
      finalScoreSet = [...originalScoreSet]; // Create a copy to avoid modifying the original
      
      // Update scores where a new score is provided (not null)
      submittedScoreSet.forEach((score, index) => {
        if (score !== null) {
          finalScoreSet[index] = score;
        }
      });
    }
     
    // Check if all questions are now answered
    if ((!finalScoreSet.some(each => each == -1)) && finalScoreSet.filter(Boolean).length == assignment.questionRecord.length) {
        this.updateAssignmentState({id: assignment.id, state: TestStatus.COMPLETED})
    }

    // Calculate total score based on proportions
    let totalScore = 0;
    const { test, questionRecord } = assignment;
    
    // Verify if all questions are answered (except for -1 which indicates unanswered)
    const validScores = finalScoreSet.filter(score => score !== -1);
    if (validScores.length === 0) {
      // No valid scores yet, don't calculate total
      const updatedAssignment = await this.prisma.testAssignment.update({
        where: { id: updateAssignmentScoreDto.id },
        data: { 
          scoreSet: finalScoreSet,
        }
      });
      return updatedAssignment;
    }
    
    // Get mini-tests and their questions from the test
    const miniTests = test.miniTest;
    const testProportions = test.proportion;
    
    // Group scores by mini-test
    let currentIndex = 0;
    const miniTestScores = miniTests.map((miniTest, idx) => {
      const questionCount = miniTest.proportion.length;
      const scores = finalScoreSet.slice(currentIndex, currentIndex + questionCount);
      currentIndex += questionCount;
      
      // Calculate mini-test score (average of answered questions)
      const answeredScores = scores.filter(score => score !== -1);
      if (answeredScores.length === 0) return 0;
      
      const miniTestScore = answeredScores.reduce((sum, score) => sum + score, 0) / answeredScores.length;
      return miniTestScore;
    });
    
    // Calculate weighted total score
    totalScore = miniTestScores.reduce((sum, score, idx) => {
      return sum + (score * testProportions[idx]);
    }, 0);
    
    const updatedAssignment = await this.prisma.testAssignment.update({
      where: { id: updateAssignmentScoreDto.id },
      data: { 
        scoreSet: finalScoreSet,
        score: parseFloat(totalScore.toFixed(2)), // Round to 2 decimal places
      }
    });
    
    return updatedAssignment;
  }

  async deleteAssignment(id: number){
    const assignment = await this.prisma.testAssignment.delete({where:{id}})
    return assignment
  }
    
  async deleteAssignmentByUserName(name: string){
    const assignment = await this.prisma.testAssignment.deleteMany({where:{reviewer:{some:{name}}}})
    return assignment
  }

  async updateAssignmentState(updateAssignmentStateDto: UpdateAssignmentStateDto){
    const assignment = await this.prisma.testAssignment.update({where:{id:parseInt(updateAssignmentStateDto.id)}, data:{status:updateAssignmentStateDto.state}})
    return assignment
  }

  async findAssignmentById(testId: number)  {
    const assignment = await this.prisma.testAssignment.findUnique({
      where:{id: testId},
      include:{
        test:{
          include:{
            miniTest:{
              include:{
                question:true
              }
            }
          }
        },
        reviewer:true,
        reviewee:true
      }
    })
    return assignment
  }

  async deleteAssignmentByNull(){
    console.log("deleteAssignmentByNull")
    const assignment = await this.prisma.testAssignment.deleteMany({
      where: {
        reviewer: {
          none: {} // Delete assignments with no reviewers
        }
      }
    })
    return assignment
  }
}
