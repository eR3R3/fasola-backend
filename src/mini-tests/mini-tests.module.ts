import { Module } from '@nestjs/common';
import { MiniTestsController } from './mini-tests.controller';
import { MiniTestsService } from './mini-tests.service';
@Module({
  controllers: [MiniTestsController],
  providers: [MiniTestsService],
})
export class MiniTestsModule {}
