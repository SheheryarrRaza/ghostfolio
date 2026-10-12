import { DataGatheringItem } from '@ghostfolio/api/services/interfaces/interfaces';
import { SubscriptionType } from '@ghostfolio/common/enums';
import { AssetIdentifier } from '@ghostfolio/common/interfaces';

import { DateQuery } from './date-query.interface';

export interface GetValuesParams {
  assetProfileIdentifiersWithQuotes: AssetIdentifier[];
  dataGatheringItems: DataGatheringItem[];
  dateQuery: DateQuery;
  subscriptionType?: SubscriptionType;
}
