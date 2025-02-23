import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { ClubsService } from './clubs/clubs.service';
import { ClubsModule } from './clubs/clubs.module';
import { ConfigModule } from '@nestjs/config';
import { MiniClubsService } from './mini-clubs/mini-clubs.service';
import { MiniClubsModule } from './mini-clubs/mini-clubs.module';
import { PositionsService } from './positions/positions.service';
import { PositionsModule } from './positions/positions.module';
import { TestsService } from './tests/tests.service';
import { MiniTestsModule } from './mini-tests/mini-tests.module';
import { MiniTestsService } from './mini-tests/mini-tests.service';
import { TestsModule } from './tests/tests.module';
import { QuestionsModule } from './questions/questions.module';
import { QuestionsService } from './questions/questions.service';
import { AssignmentsService } from './assignments/assignments.service';
import { AssignmentsModule } from './assignments/assignments.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}), UsersModule, ClubsModule, PrismaModule, MiniClubsModule,QuestionsModule, PositionsModule, TestsModule, MiniTestsModule, AssignmentsModule],
  controllers: [AppController],
  providers: [AppService, ClubsService, UsersService, QuestionsService, PrismaService, MiniClubsService, PositionsService, TestsService, MiniTestsService, AssignmentsService],
})
export class AppModule {}
