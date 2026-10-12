import { AssetIdentifier } from '@ghostfolio/common/interfaces';

export interface ResponseError {
  errors?: AssetIdentifier[];
  hasErrors: boolean;
}
