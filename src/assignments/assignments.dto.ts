import { TestStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  test: string

  @IsNotEmpty()
  @Type(() => String)
  @IsArray()
  reviewer: string[] 

  @IsNotEmpty()
  @Type(() => String)
  @IsArray()
  reviewee: string[]
}


export class UpdateAssignmentDto {
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
  @IsNumber()
  id: number
  
  @IsNotEmpty()
  @IsString()
  state: TestStatus
}

export class DeleteAssignmentDto {
  @IsNotEmpty()
  @IsNumber()
  id: number
}
