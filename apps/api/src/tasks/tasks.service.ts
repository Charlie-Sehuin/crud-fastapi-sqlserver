import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  private async assertListOwnership(listId: string, userId: string) {
    const list = await this.tasksRepository.findListOwner(listId);

    if (!list) {
      throw new NotFoundException(`Lista ${listId} no encontrada`);
    }
    // boards viene como objeto anidado gracias al select() con relación
    const ownerId = (list as any).boards?.user_id;
    if (ownerId !== userId) {
      throw new ForbiddenException('No tenés acceso a esta lista');
    }
  }

  async findAll(listId: string, userId: string) {
    await this.assertListOwnership(listId, userId);
    return this.tasksRepository.findAllByList(listId);
  }

  async create(dto: CreateTaskDto, userId: string) {
    await this.assertListOwnership(dto.listId, userId);
    return this.tasksRepository.create(dto);
  }

  async toggleDone(id: string, listId: string, userId: string, done: boolean) {
    await this.assertListOwnership(listId, userId);
    return this.tasksRepository.toggleDone(id, done);
  }

  async remove(id: string, listId: string, userId: string) {
    await this.assertListOwnership(listId, userId);
    return this.tasksRepository.delete(id);
  }
}