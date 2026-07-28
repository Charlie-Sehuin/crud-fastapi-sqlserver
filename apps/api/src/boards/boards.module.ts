import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { BoardsRepository } from './boards.repository';

@Module({
  controllers: [BoardsController],
  providers: [BoardsService, BoardsRepository],
})
export class BoardsModule {}