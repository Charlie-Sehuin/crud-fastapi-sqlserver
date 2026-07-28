import { Controller, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('lists')
@UseGuards(AuthGuard)
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  create(@Body() dto: CreateListDto, @CurrentUser() user: any) {
    return this.listsService.create(dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listsService.remove(id);
  }
}