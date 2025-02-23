import { Body, Controller, Get, Post } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto, DeleteAssignmentDto, UpdateAssignmentDto, UpdateAssignmentStateDto } from './assignments.dto';

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

  @Post("/update")
  async updateAssignment(@Body() updateAssignmentDto: UpdateAssignmentDto){
    return this.assignmentsService.updateAssignment(updateAssignmentDto)
  }

  @Post("/update/state")
  async updateAssignmentState(@Body() updateAssignmentStateDto: UpdateAssignmentStateDto){
    return this.assignmentsService.updateAssignmentState(updateAssignmentStateDto)
  }

  @Post("/delete")
  async deleteAssignment(@Body() deleteAssignmentDto: DeleteAssignmentDto){
    return this.assignmentsService.deleteAssignment(deleteAssignmentDto.id)
  }
}
