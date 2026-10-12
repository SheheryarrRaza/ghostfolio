import { HasPermission } from '@ghostfolio/api/decorators/has-permission.decorator';
import { HasPermissionGuard } from '@ghostfolio/api/guards/has-permission.guard';
import { permissions } from '@ghostfolio/common/permissions';

import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const IMPORT_FILES_DIRECTORY = join(process.cwd(), 'tmp', 'imports');

@Controller('import/file')
export class ImportFileController {
  @Post()
  @HasPermission(permissions.createActivity)
  @UseGuards(AuthGuard('jwt'), HasPermissionGuard)
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @UploadedFile() file: { buffer: Buffer; originalname: string }
  ) {
    await mkdir(IMPORT_FILES_DIRECTORY, { recursive: true });

    const name = `${Date.now()}-${file.originalname}`;

    await writeFile(join(IMPORT_FILES_DIRECTORY, name), file.buffer);

    return { name, size: file.buffer.length };
  }
}
