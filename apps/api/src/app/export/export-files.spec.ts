import { mkdtemp, writeFile } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

async function readExportFile({
  directory,
  name
}: {
  directory: string;
  name: string;
}) {
  return readFile(join(directory, name), 'utf-8');
}

describe('ExportFiles', () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'export-files-'));
    await writeFile(join(directory, 'activities.json'), '{"activities":[]}');
  });

  it('should read an exported file by name', async () => {
    const content = await readExportFile({
      directory,
      name: 'activities.json'
    });

    expect(JSON.parse(content)).toEqual({ activities: [] });
  });
});
