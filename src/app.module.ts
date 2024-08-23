import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';
import { HelperService } from './utils/hash.util';
import { AuthModule } from './auth/auth.module';
import { IorController } from './controllers/ior.controller';
import { IorService } from './services/ior.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule],
  controllers: [AppController, AccountController, IorController],
  providers: [AppService, AccountService, HelperService, IorService],
})
export class AppModule {}
