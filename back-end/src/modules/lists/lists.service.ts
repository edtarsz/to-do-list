import { Injectable, NotFoundException } from '@nestjs/common';
import { List } from '@prisma/client';
import { PrismaErrorService } from 'src/prisma/prisma-error.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateListDTO } from './dto/create-list.dto';

@Injectable()
export class ListsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly prismaErrorService: PrismaErrorService
    ) { }

    async createList(createListDTO: CreateListDTO, userId: number): Promise<List> {
        try {
            return this.prisma.list.create({ data: { ...createListDTO, userId } });
        } catch (error) {
            this.prismaErrorService.handleError(error, 'Failed to create list');
        }
    }

    async getLists(userId: number): Promise<List[]> {
        return this.prisma.list.findMany({ where: { userId } });
    }

    async getListById(id: number, userId: number): Promise<List> {
        const list = await this.prisma.list.findUnique({ where: { id, userId } });
        if (!list) throw new NotFoundException(`List with ID ${id} not found`);
        return list;
    }

    async updateList(id: number, updateListDTO: Partial<CreateListDTO>, userId: number) {
        try {
            await this.getListById(id, userId);
            return this.prisma.list.update({ where: { id }, data: updateListDTO });
        } catch (error) {
            this.prismaErrorService.handleError(error, 'Failed to update list');
        }
    }

    async deleteList(id: number, userId: number): Promise<void> {
        try {
            await this.getListById(id, userId);
            await this.prisma.list.delete({ where: { id } });
        } catch (error) {
            this.prismaErrorService.handleError(error, 'Failed to delete list');
        }
    }
}
