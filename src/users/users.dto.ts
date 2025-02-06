import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Gender, UserRole } from '@prisma/client';


export class CreateUserDto{
  @IsNotEmpty()
  @IsString()
  name: string

  @IsEnum(["MALE", "FEMALE"])
  @IsNotEmpty()
  gender: Gender

  @IsEnum(["ADMIN","MANAGER","LEADER","WORKER"])
  @IsNotEmpty()
  role: UserRole

  @IsString()
  @IsNotEmpty()
  @Length(11)
  phone: string

  @IsString()
  @IsOptional()
  clubName: string

  @IsString()
  @IsOptional()
  positionName: string

  @IsString()
  @IsOptional()
  miniClubName: string
}

export class UpdateUserDto{
  @IsNotEmpty()
  @IsNumber()
  id: number

  @IsNotEmpty()
  @IsString()
  name: string

  @IsEnum(["MALE", "FEMALE"])
  @IsNotEmpty()
  gender: Gender

  @IsEnum(["ADMIN","MANAGER","LEADER","WORKER"])
  @IsNotEmpty()
  role: UserRole

  @IsString()
  @IsNotEmpty()
  @Length(11)
  phone: string

  @IsString()
  @IsOptional()
  clubName: string

  @IsString()
  @IsOptional()
  positionName: string

  @IsString()
  @IsOptional()
  miniClubName: string
}