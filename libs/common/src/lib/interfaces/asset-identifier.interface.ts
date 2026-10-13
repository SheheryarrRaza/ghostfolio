import { DataSource } from '@ghostfolio/prisma/enums';

export interface AssetIdentifier {
  dataSource: DataSource;
  symbol: string;
}
