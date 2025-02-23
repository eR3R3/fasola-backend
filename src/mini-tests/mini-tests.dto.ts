import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionWithProportionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  proportion: number;
}

export class CreateMiniTestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateNested({ each: true })
  @Type(() => QuestionWithProportionDto)
  @IsArray()
  @IsNotEmpty()
  question: QuestionWithProportionDto[];
}

export class UpdateMiniTestDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateNested({ each: true })
  @Type(() => QuestionWithProportionDto)
  @IsOptional()
  question?: QuestionWithProportionDto[];
}
