import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export the service so it can be used in other modules
})
export class PrismaModule {}
