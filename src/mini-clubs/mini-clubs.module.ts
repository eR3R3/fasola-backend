import { Module } from '@nestjs/common';
import { MiniClubsController } from './mini-clubs.controller';
import { MiniClubsService } from './mini-clubs.service';

@Module({
  controllers: [MiniClubsController],
  providers: [MiniClubsService]
})
export class MiniClubsModule {}
