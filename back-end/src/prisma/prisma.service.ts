import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    // Conexión a la base de datos al iniciar el módulo
    async onModuleInit() {
        await this.$connect();
    }

    // Desconexión de la base de datos al apagar el módulo
    async onModuleDestroy() {
        await this.$disconnect();
    }
}