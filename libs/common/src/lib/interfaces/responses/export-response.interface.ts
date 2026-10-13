import type {
  Account,
  Order,
  Platform,
  SymbolProfile,
  Tag
} from '@ghostfolio/prisma/browser';

import { AccountBalance } from '../account-balance.interface';
import { AssetIdentifier } from '../asset-identifier.interface';
import { MarketData } from '../market-data.interface';
import { UserSettings } from '../user-settings.interface';

export interface ExportResponse {
  accounts: (Omit<Account, 'createdAt' | 'updatedAt' | 'userId'> & {
    balances: AccountBalance[];
    tags?: string[];
  })[];
  activities: (Omit<
    Order,
    | 'accountUserId'
    | 'createdAt'
    | 'date'
    | 'symbolProfileId'
    | 'updatedAt'
    | 'userId'
  > & { date: string } & AssetIdentifier)[];
  assetProfiles: (Omit<
    SymbolProfile,
    | 'createdAt'
    | 'dataGatheringFrequency'
    | 'id'
    | 'scraperConfiguration'
    | 'symbolMapping'
    | 'updatedAt'
    | 'userId'
  > & {
    marketData: MarketData[];
  })[];
  meta: {
    date: string;
    version: string;
  };
  platforms: Platform[];
  tags: Omit<Tag, 'userId'>[];
  user: {
    settings: {
      currency: UserSettings['baseCurrency'];
      performanceCalculationType: UserSettings['performanceCalculationType'];
    };
  };
}
