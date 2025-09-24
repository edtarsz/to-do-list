import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/scripts/default-index.js';
import { PrismaErrorService } from './prisma-error.service';
import { PrismaService } from './prisma.service';

// La diferencia de provider y exports es 
@Module({
    providers: [PrismaService, PrismaErrorService],
    exports: [PrismaService, PrismaErrorService],
})
export class PrismaModule extends PrismaClient { }
