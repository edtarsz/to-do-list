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
    priority: Priority;

    @IsString()
    startDate: string;

    @IsString()
    dueDate: string;

    @IsString()
    startTime: string;

    @IsString()
    dueTime: string;

    @IsBoolean()
    completed?: boolean;

    @IsOptional()
    listId?: number;
}