import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ListsService } from './lists.service';
import { UserId } from 'src/decorators/user.decorator';
import { CreateListDTO } from './dto/create-list.dto';
import { UpdateListDTO } from './dto/update-list.dto';

@Controller('lists')
export class ListsController {
    constructor(private readonly listsService: ListsService) { }

    // El request se utiliza para obtener el userId del usuario autenticado
    @Post()
    create(@Body() createListDto: CreateListDTO, @UserId() userId: number) {
        return this.listsService.createList(createListDto, userId);
    }

    @Get()
    findAll(@UserId() userId: number) {
        return this.listsService.getLists(userId);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @UserId() userId: number) {
        return this.listsService.getListById(id, userId);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateListDTO: UpdateListDTO, @UserId() userId: number) {
        return this.listsService.updateList(id, updateListDTO, userId);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @UserId() userId: number) {
        return this.listsService.deleteList(id, userId);
    }
}
