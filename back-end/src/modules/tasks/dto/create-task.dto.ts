import { IsEnum, IsOptional, IsString, IsDateString, IsBoolean } from 'class-validator';
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

    @IsDateString()
    @IsOptional()
    dueDate?: Date;

    @IsBoolean()
    @IsOptional()
    completed?: boolean;
}