import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    lastName: string;

    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}