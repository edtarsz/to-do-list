import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post()
    create(@Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.createTask(createTaskDto);
    }

    @Get()
    findAll() {
        return this.tasksService.getTasks();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tasksService.getTaskById(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
        return this.tasksService.updateTask(id, updateTaskDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.tasksService.deleteTask(id);
    }
}