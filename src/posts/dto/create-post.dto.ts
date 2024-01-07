import { Transform } from 'class-transformer';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  title: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(1)
  content: string;

  @IsNumber()
  userId: number;
}
