import { Module } from '@nestjs/common';
import { PrismaErrorService } from './prisma-error.service';
import { PrismaService } from './prisma.service';

@Module({
    providers: [PrismaService, PrismaErrorService],
    exports: [PrismaService, PrismaErrorService],
})
export class PrismaModule { }
