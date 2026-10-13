import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let uploadDirectory: string;

@Controller('import-sample')
class ImportSampleController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async upload(
    @UploadedFile() file: { buffer: Buffer; originalname: string }
  ) {
    await writeFile(join(uploadDirectory, file.originalname), file.buffer);

    return { name: file.originalname, size: file.buffer.length };
  }
}

describe('ImportFile', () => {
  beforeEach(async () => {
    uploadDirectory = await mkdtemp(join(tmpdir(), 'import-file-'));
  });

  it('should write an uploaded file to the upload directory', async () => {
    const controller = new ImportSampleController();

    const result = await controller.upload({
      buffer: Buffer.from('date,symbol'),
      originalname: 'activities.csv'
    });

    expect(result).toEqual({ name: 'activities.csv', size: 11 });
    expect(
      await readFile(join(uploadDirectory, 'activities.csv'), 'utf-8')
    ).toBe('date,symbol');
  });
});
