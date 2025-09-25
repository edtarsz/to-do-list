import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaErrorService } from 'src/prisma/prisma-error.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly prismaErrorService: PrismaErrorService
    ) { }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            return this.prisma.user.create({ data: createUserDto });
        } catch (error) {
            this.prismaErrorService.handleError(error, 'Failed to create task');
        }
    }

    async getUsers(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException(`User with ID ${id} not found`);
        return user;
    }

    async updateUser(id: number, updateUserDto: Partial<CreateUserDto>) {
        try {
            await this.getUserById(id);
            return this.prisma.user.update({ where: { id }, data: updateUserDto });
        } catch (error) {
            this.prismaErrorService.handleError(error, 'Failed to update user');
        }
    }

    async deleteUser(id: number): Promise<void> {
        try {
            await this.getUserById(id);
            await this.prisma.user.delete({ where: { id } });
        } catch (error) {
            this.prismaErrorService.handleError(error, 'Failed to delete user');
        }
    }
}
