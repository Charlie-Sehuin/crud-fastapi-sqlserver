import { IsString, IsNotEmpty, MaxLength, IsUUID } from 'class-validator';

export class CreateListDto {
  @IsUUID()
  boardId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}