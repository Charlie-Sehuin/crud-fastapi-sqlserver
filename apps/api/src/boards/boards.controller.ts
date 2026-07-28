import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('boards')
@UseGuards(AuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.boardsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.boardsService.findOne(id, user.id);
  }

  @Post()
  create(@Body() dto: CreateBoardDto, @CurrentUser() user: any) {
    return this.boardsService.create(dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.boardsService.remove(id, user.id);
  }
}