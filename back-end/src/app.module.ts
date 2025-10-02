import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { ListsModule } from './modules/lists/lists.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    TasksModule,
    ListsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    })
  ],
  providers: [PrismaService,
    {
      provide: 'APP_GUARD', 
      useClass: JwtAuthGuard,
    }
  ],
  controllers: [],
})
export class AppModule { }
