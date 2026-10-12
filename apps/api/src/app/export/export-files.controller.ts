import { HasPermissionGuard } from '@ghostfolio/api/guards/has-permission.guard';
import { ConfigurationService } from '@ghostfolio/api/services/configuration/configuration.service';

import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createHmac } from 'node:crypto';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export const EXPORT_FILES_DIRECTORY = join(process.cwd(), 'tmp', 'exports');

@Controller('export/files')
export class ExportFilesController {
  public constructor(
    private readonly configurationService: ConfigurationService
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  public async getFiles() {
    const names = await readdir(EXPORT_FILES_DIRECTORY).catch(() => {
      return [] as string[];
    });

    return names.map((name) => {
      return {
        name,
        signature: createHmac(
          'sha256',
          this.configurationService.get('EXPORT_LINK_SIGNING_KEY')
        )
          .update(name)
          .digest('hex')
      };
    });
  }

  @Get(':name')
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  public downloadFile(@Param('name') name: string, @Res() response: Response) {
    const filePath = join(EXPORT_FILES_DIRECTORY, name);

    response.download(filePath, (error) => {
      if (error && !response.headersSent) {
        response.status(StatusCodes.NOT_FOUND).send();
      }
    });
  }
}
