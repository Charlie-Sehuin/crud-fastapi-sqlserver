import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksRepository {
  constructor(private readonly db: DatabaseService) {}

  async findAllByUser(userId: string) {
    const { data, error } = await this.db.getClient()
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async create(dto: CreateTaskDto, userId: string) {
    const { data, error } = await this.db.getClient()
      .from('tasks')
      .insert({ title: dto.title, user_id: userId })
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async toggleDone(id: string, userId: string, done: boolean) {
    const { data, error } = await this.db.getClient()
      .from('tasks')
      .update({ done })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async delete(id: string, userId: string) {
    const { error } = await this.db.getClient()
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new InternalServerErrorException(error.message);
    return { deleted: true };
  }
}