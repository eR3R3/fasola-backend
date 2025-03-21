import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto, DeleteAssignmentDto, UpdateAssignmentScoreDto, UpdateAssignmentStateDto } from './assignments.dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get("findAll")
  async findAllAssignments(){
    return this.assignmentsService.findAllAssignments()
  }

  @Post("/create")
  async createAssignment(@Body() createAssignmentDto: CreateAssignmentDto){
    return this.assignmentsService.createAssignment(createAssignmentDto)
  }

  @Post("/update/score")
  async updateAssignmentScore(@Body() updateAssignmentScoreDto: UpdateAssignmentScoreDto){
    return this.assignmentsService.updateAssignmentScore(updateAssignmentScoreDto)
  }

  @Post("/update/state")
  async updateAssignmentState(@Body() updateAssignmentStateDto: UpdateAssignmentStateDto){
    console.log("updateAssignmentState")
    return this.assignmentsService.updateAssignmentState(updateAssignmentStateDto)
  }

  @Post("/delete")
  async deleteAssignment(@Body() deleteAssignmentDto: DeleteAssignmentDto){
    return this.assignmentsService.deleteAssignment(deleteAssignmentDto.id)
  }

  @Get("/findOne/:id")
  async findAssignmentById(@Param("id") id: number){
    return this.assignmentsService.findAssignmentById(id)
  }

  @Delete("/delete/:name")
  async deleteAssignmentByUserName(@Param("name") name: string){
    return this.assignmentsService.deleteAssignmentByUserName(name)
  }

  @Delete("/delete/null/null")
  async deleteAssignmentByNull(){
    console.log("deleteAssignmentByNull")
    return this.assignmentsService.deleteAssignmentByNull()
  }
}
