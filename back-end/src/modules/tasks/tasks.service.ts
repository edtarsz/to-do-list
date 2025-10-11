import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaErrorService } from 'src/prisma/prisma-error.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly prismaErrorService: PrismaErrorService
    ) { }

    async createTask(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
        try {
            return this.prisma.task.create({ data: { ...createTaskDto, userId } });
        } catch (error) {
            this.prismaErrorService.handleError(error, 'Failed to create task');
        }
    }

    async getTasks(userId: number): Promise<Task[]> {
        return this.prisma.task.findMany({ where: { userId } });
    }

    async getTaskById(id: number, userId: number): Promise<Task> {
        const task = await this.prisma.task.findUnique({ where: { id, userId } });
        if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
        return task;
    }

    async updateTask(id: number, updateTaskDto: Partial<CreateTaskDto>, userId: number) {
        try {
            updateTaskDto.completedAt = new Date();
            await this.getTaskById(id, userId);
            return this.prisma.task.update({ where: { id }, data: updateTaskDto });
        } catch (error) {
            this.prismaErrorService.handleError(error, 'Failed to update task');
        }
    }

    async deleteTask(id: number, userId: number): Promise<void> {
        try {
            await this.getTaskById(id, userId);
            await this.prisma.task.delete({ where: { id } });
        } catch (error) {
            this.prismaErrorService.handleError(error, 'Failed to delete task');
        }
    }
}