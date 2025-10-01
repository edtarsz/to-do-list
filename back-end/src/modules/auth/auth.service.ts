import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from './dto/auth.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(userDTO: RegisterDTO) {
        const { name, lastName, username, password, role } = userDTO;

        const existingUser = await this.prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            throw new ConflictException('El usuario ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole: Role = 'USER';

        const user = await this.prisma.user.create({
            data: {
                name,
                lastName,
                username,
                password: hashedPassword,
                role: userRole,
            },
        });

        const { password: _, ...result } = user;
        return result;
    }

    async login(username: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { username }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = { sub: user.id, username: user.username };
        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            user: {
                id: user.id,
                name: user.name,
                lastName: user.lastName,
                username: user.username,
                role: user.role
            },
        };
    }

    async validateUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: Number(userId) },
            select: {
                id: true,
                username: true,
                name: true,
                lastName: true,
                role: true
            },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }

    async getProfile(userId: string) {
        return this.validateUser(userId);
    }
}

