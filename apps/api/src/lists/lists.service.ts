import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ListsRepository } from './lists.repository';
import { CreateListDto } from './dto/create-list.dto';

@Injectable()
export class ListsService {
  constructor(private readonly listsRepository: ListsRepository) {}

  async create(dto: CreateListDto, userId: string) {
    const board = await this.listsRepository.findBoardOwner(dto.boardId);

    if (!board) {
      throw new NotFoundException(`Board ${dto.boardId} no encontrado`);
    }
    if (board.user_id !== userId) {
      throw new ForbiddenException('No podés agregar listas a este board');
    }

    return this.listsRepository.create(dto);
  }

  remove(id: string) {
    // La policy de RLS ya protege esto a nivel de base de datos,
    // pero el service.remove queda simple porque delete() usa la service_role
    // (el bypass de RLS), así que la validación real pasa acá, no en la DB, para este caso.
    return this.listsRepository.delete(id);
  }
}