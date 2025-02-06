import { IsArray, IsInt, isInt, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class clubInfo{
  @IsString()
  name:string
}

class userInfo{
  @IsString()
  name:string
}

export class UpdatePositionDto{
  @IsInt()
  @IsNotEmpty()
  id: number

  @IsString()
  @IsNotEmpty()
  name: string

  @IsArray()
  @Type(()=>clubInfo)
  club: clubInfo[]

  @IsArray()
  @Type(()=>userInfo)
  user: userInfo[]
}