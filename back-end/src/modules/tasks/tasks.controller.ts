import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { UserId } from 'src/decorators/user.decorator';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    // El request se utiliza para obtener el userId del usuario autenticado
    @Post()
    create(@Body() createTaskDto: CreateTaskDto, @UserId() userId: number) {
        return this.tasksService.createTask(createTaskDto, userId);
    }

    @Get()
    findAll(@UserId() userId: number) {
        return this.tasksService.getTasks(userId);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @UserId() userId: number) {
        return this.tasksService.getTaskById(id, userId);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto, @UserId() userId: number) {
        return this.tasksService.updateTask(id, updateTaskDto, userId);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @UserId() userId: number) {
        return this.tasksService.deleteTask(id, userId);
    }
}