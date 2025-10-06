import { IsEnum, IsOptional, IsString, IsDateString, IsBoolean, MinLength, MaxLength } from 'class-validator';
import { Priority } from '@prisma/client';

export class CreateTaskDto {
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    description?: string;

    @IsEnum(Priority)
    @IsOptional()
    priority?: Priority;

    @IsString()
    @IsOptional()
    startDate?: string;

    @IsString()
    @IsOptional()
    dueDate?: string;

    @IsString()
    @IsOptional()
    startTime?: string;

    @IsString()
    @IsOptional()
    dueTime?: string;

    @IsBoolean()
    @IsOptional()
    completed?: boolean;
}