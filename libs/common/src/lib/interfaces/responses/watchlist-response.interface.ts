import { AssetIdentifier, Benchmark } from '@ghostfolio/common/interfaces';

export interface WatchlistResponse {
  watchlist: (AssetIdentifier & {
    marketCondition: Benchmark['marketCondition'];
    name: string;
    performances: Benchmark['performances'];
    trend50d: Benchmark['trend50d'];
    trend200d: Benchmark['trend200d'];
  })[];
}
