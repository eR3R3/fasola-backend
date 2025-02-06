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

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}), UsersModule, ClubsModule, PrismaModule, MiniClubsModule, PositionsModule],
  controllers: [AppController],
  providers: [AppService, ClubsService, UsersService, PrismaService, MiniClubsService, PositionsService],
})
export class AppModule {}
