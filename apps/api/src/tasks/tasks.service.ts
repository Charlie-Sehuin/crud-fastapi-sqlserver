import { Injectable } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  findAll(userId: string) {
    return this.tasksRepository.findAllByUser(userId);
  }

  create(dto: CreateTaskDto, userId: string) {
    return this.tasksRepository.create(dto, userId);
  }

  toggleDone(id: string, userId: string, done: boolean) {
    return this.tasksRepository.toggleDone(id, userId, done);
  }

  remove(id: string, userId: string) {
    return this.tasksRepository.delete(id, userId);
  }
}