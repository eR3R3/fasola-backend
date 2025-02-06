import { IsArray, IsDefined, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


export class UserInfo{
  @IsString()
  name: string

  @IsEnum(["LEADER", "WORKER"])
  role: "LEADER"|"WORKER"
}

export class UpdateMiniClubDto{
  @IsNumber()
  @IsNotEmpty()
  id: number

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  club: string

  @ValidateNested({ each: true })
  @Type(() => UserInfo)
  @IsArray()
  user: UserInfo[]
}