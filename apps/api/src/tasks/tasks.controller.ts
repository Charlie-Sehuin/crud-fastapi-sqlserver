import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Query('listId') listId: string, @CurrentUser() user: any) {
    return this.tasksService.findAll(listId, user.id);
  }

  @Post()
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.create(dto, user.id);
  }

  @Patch(':id')
  toggleDone(
    @Param('id') id: string,
    @Query('listId') listId: string,
    @Body('done') done: boolean,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.toggleDone(id, listId, user.id, done);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('listId') listId: string, @CurrentUser() user: any) {
    return this.tasksService.remove(id, listId, user.id);
  }
}