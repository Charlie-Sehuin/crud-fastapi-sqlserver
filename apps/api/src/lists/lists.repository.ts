import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateListDto } from './dto/create-list.dto';

@Injectable()
export class ListsRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateListDto) {
    const { data, error } = await this.db.getClient()
      .from('lists')
      .insert({ name: dto.name, board_id: dto.boardId })
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async delete(id: string) {
    const { error } = await this.db.getClient()
      .from('lists')
      .delete()
      .eq('id', id);

    if (error) throw new InternalServerErrorException(error.message);
    return { deleted: true };
  }

  // Necesario para que el service verifique que el board pertenece al usuario antes de crear la lista
  async findBoardOwner(boardId: string) {
    const { data, error } = await this.db.getClient()
      .from('boards')
      .select('user_id')
      .eq('id', boardId)
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}