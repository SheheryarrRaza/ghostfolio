import {
  AssetIdentifier,
  HistoricalDataItem
} from '@ghostfolio/common/interfaces';

export interface SymbolItem extends AssetIdentifier {
  currency: string;
  historicalData: HistoricalDataItem[];
  marketPrice: number;
}
