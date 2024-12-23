import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  lastname: string;

  @IsString()
  @MinLength(5)
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  password: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  rolesId: number[];
}
