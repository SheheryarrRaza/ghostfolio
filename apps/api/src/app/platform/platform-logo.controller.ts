import { HasPermission } from '@ghostfolio/api/decorators/has-permission.decorator';
import { HasPermissionGuard } from '@ghostfolio/api/guards/has-permission.guard';
import { ConfigurationService } from '@ghostfolio/api/services/configuration/configuration.service';
import { permissions } from '@ghostfolio/common/permissions';

import {
  Controller,
  Get,
  HttpException,
  Query,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

@Controller('platform/logo')
export class PlatformLogoController {
  public constructor(
    private readonly configurationService: ConfigurationService
  ) {}

  @Get()
  @HasPermission(permissions.updatePlatform)
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  public async getPlatformLogo(
    @Query('url') url: string,
    @Res() response: Response
  ) {
    try {
      const result = await fetch(url, {
        signal: AbortSignal.timeout(
          this.configurationService.get('REQUEST_TIMEOUT')
        )
      });

      response.contentType(result.headers.get('content-type') ?? 'image/png');
      response.send(Buffer.from(await result.arrayBuffer()));
    } catch {
      throw new HttpException(
        getReasonPhrase(StatusCodes.BAD_GATEWAY),
        StatusCodes.BAD_GATEWAY
      );
    }
  }
}
