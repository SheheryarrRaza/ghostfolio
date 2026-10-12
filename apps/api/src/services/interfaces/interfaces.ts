import { AssetIdentifier } from '@ghostfolio/common/interfaces';

export interface DataGatheringItem extends AssetIdentifier {
  date?: Date;
  force?: boolean;
}
