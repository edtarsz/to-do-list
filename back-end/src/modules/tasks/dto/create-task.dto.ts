import { IsEnum, IsOptional, IsString, IsDateString, IsBoolean, IsNumber, MinLength, MaxLength } from 'class-validator';
import { Priority } from '@prisma/client';

export class CreateTaskDto {
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    title: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    description?: string;

    @IsEnum(Priority)
    @IsOptional()
    priority?: Priority;

    // DatePipe en el front para separar fecha y hora
    @IsDateString()
    @IsOptional()
    dueDateTime?: string;

    @IsBoolean()
    @IsOptional()
    completed?: boolean;
}