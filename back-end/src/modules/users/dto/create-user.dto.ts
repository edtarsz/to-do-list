import { IsEnum, IsOptional, IsString, IsDateString, MinLength, MaxLength, Max } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    name: string;

    @IsString()
    @MinLength(1)
    @MaxLength(255)
    lastName: string;

    @IsString()
    @MinLength(1)
    @MaxLength(10)
    username: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsEnum(Role)
    role: Role;
}