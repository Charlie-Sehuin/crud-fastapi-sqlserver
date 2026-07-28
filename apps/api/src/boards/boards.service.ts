import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BoardsRepository } from './boards.repository';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  constructor(private readonly boardsRepository: BoardsRepository) {}

  findAll(userId: string) {
    return this.boardsRepository.findAllByUser(userId);
  }

  async findOne(id: string, userId: string) {
    const board = await this.boardsRepository.findByIdWithLists(id);

    if (!board) {
      throw new NotFoundException(`Board ${id} no encontrado`);
    }
    if (board.user_id !== userId) {
      throw new ForbiddenException('No tenés acceso a este board');
    }

    return board;
  }

  create(dto: CreateBoardDto, userId: string) {
    return this.boardsRepository.create(dto, userId);
  }

  remove(id: string, userId: string) {
    return this.boardsRepository.delete(id, userId);
  }
}