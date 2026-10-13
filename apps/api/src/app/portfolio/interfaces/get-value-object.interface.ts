import { AssetIdentifier } from '@ghostfolio/common/interfaces';

export interface GetValueObject extends AssetIdentifier {
  date: Date;
  marketPrice: number;
}
