import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsNumber()
  age: number;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
