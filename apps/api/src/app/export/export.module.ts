import { AccountModule } from '@ghostfolio/api/app/account/account.module';
import { ActivitiesModule } from '@ghostfolio/api/app/activities/activities.module';
import { TransformDataSourceInRequestModule } from '@ghostfolio/api/interceptors/transform-data-source-in-request/transform-data-source-in-request.module';
import { ApiModule } from '@ghostfolio/api/services/api/api.module';
import { ConfigurationModule } from '@ghostfolio/api/services/configuration/configuration.module';
import { MarketDataModule } from '@ghostfolio/api/services/market-data/market-data.module';
import { PrismaModule } from '@ghostfolio/api/services/prisma/prisma.module';
import { TagModule } from '@ghostfolio/api/services/tag/tag.module';

import { Module } from '@nestjs/common';

import { ExportFeedController } from './export-feed.controller';
import { ExportFilesController } from './export-files.controller';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';

@Module({
  controllers: [ExportController, ExportFeedController, ExportFilesController],
  imports: [
    AccountModule,
    ActivitiesModule,
    ApiModule,
    ConfigurationModule,
    MarketDataModule,
    PrismaModule,
    TagModule,
    TransformDataSourceInRequestModule
  ],
  providers: [ExportService]
})
export class ExportModule {}
