import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsRepository {
  constructor(private readonly db: DatabaseService) {}

  async findAllByUser(userId: string) {
    const { data, error } = await this.db.getClient()
      .from('boards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  // Trae el board con sus listas y las tareas de cada lista, todo anidado
  async findByIdWithLists(id: string) {
    const { data, error } = await this.db.getClient()
      .from('boards')
      .select(`
        id, name, user_id, created_at,
        lists (
          id, name, position,
          tasks ( id, title, done, created_at )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async create(dto: CreateBoardDto, userId: string) {
    const { data, error } = await this.db.getClient()
      .from('boards')
      .insert({ name: dto.name, user_id: userId })
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async delete(id: string, userId: string) {
    const { error } = await this.db.getClient()
      .from('boards')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new InternalServerErrorException(error.message);
    return { deleted: true };
  }
}