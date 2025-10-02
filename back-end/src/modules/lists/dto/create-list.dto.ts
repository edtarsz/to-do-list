import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateListDTO {
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    name: string;

    @IsString()
    @MinLength(1)
    @MaxLength(255)
    color: string;
}