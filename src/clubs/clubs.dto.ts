import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClubDto{
  @IsString()
  @IsNotEmpty()
  name: string

  @IsArray()
  @IsNotEmpty()
  positions: { name: string }[]

  @IsOptional()
  @IsArray()
  miniClubs: { name: string }[]
}

export class UpdateClubDto{
  @IsInt()
  id: number

  @IsString()
  @IsNotEmpty()
  name: string

  @IsArray()
  @IsNotEmpty()
  positions: { name: string }[]

  @IsOptional()
  @IsArray()
  miniClubs: { name: string }[]
}
