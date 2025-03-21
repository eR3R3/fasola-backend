import { TestStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

export class AssignmentDto {
  @IsNumber()
  @IsNotEmpty()
  questionId: number

  @IsString()
  @IsNotEmpty()
  content: string

  @IsArray()
  @IsNotEmpty()
  reviewers: string[]
}

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  test: string

  @IsNotEmpty()
  @Type(() => String)
  @IsArray()
  reviewers: string[] 

  @IsNotEmpty()
  @Type(() => String)
  @IsArray()
  reviewees: string[]

  @IsNotEmpty()
  assignmentType: "person" | "miniClub" | "club"

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => AssignmentDto)
  assignments: AssignmentDto[]
}


export class UpdateAssignmentScoreDto {
  @IsNotEmpty()
  @IsNumber()
  id: number

  @IsArray()
  @IsNotEmpty()
  @Type(()=> Number)
  scoreSet: number[]
}

export class UpdateAssignmentStateDto {
  @IsNotEmpty()
  id: any
  
  @IsNotEmpty()
  @IsString()
  state: TestStatus
}

export class DeleteAssignmentDto {
  @IsNotEmpty()
  @IsNumber()
  id: number
}
