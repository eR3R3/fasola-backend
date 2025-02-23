import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MiniTestWithProportionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  proportion: number;
}

export class CreateTestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateNested({ each: true })
  @Type(() => MiniTestWithProportionDto)
  @IsArray()
  @IsNotEmpty()
  miniTest: MiniTestWithProportionDto[];
}

export class UpdateTestDto {
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
  @Type(() => MiniTestWithProportionDto)
  @IsOptional()
  miniTest?: MiniTestWithProportionDto[];
} 