import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDTO {
    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    @MinLength(2)
    lastName: string;

    @IsString()
    @MinLength(3)
    username: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    role: string;
}

export class LoginDTO {
    @IsString()
    username: string;

    @IsString()
    password: string;
}