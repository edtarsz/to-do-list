import { IsEnum, IsOptional, IsString, IsDateString, IsBoolean, IsNumber } from 'class-validator';
import { Priority } from '@prisma/client';

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
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