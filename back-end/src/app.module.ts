import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [PrismaModule, UsersModule, TasksModule],
  providers: [PrismaService],
  controllers: [],
})
export class AppModule { }
