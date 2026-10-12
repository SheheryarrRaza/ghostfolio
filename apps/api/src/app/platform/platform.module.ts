import { ConfigurationModule } from '@ghostfolio/api/services/configuration/configuration.module';
import { PrismaModule } from '@ghostfolio/api/services/prisma/prisma.module';

import { Module } from '@nestjs/common';

import { PlatformLogoController } from './platform-logo.controller';
import { PlatformController } from './platform.controller';
import { PlatformService } from './platform.service';

@Module({
  controllers: [PlatformController, PlatformLogoController],
  exports: [PlatformService],
  imports: [ConfigurationModule, PrismaModule],
  providers: [PlatformService]
})
export class PlatformModule {}
