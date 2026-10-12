import type { AssetIdentifier } from '@ghostfolio/common/interfaces';

import type { FormControl, FormGroup } from '@angular/forms';

export interface CreateWatchlistItemDialogParams {
  deviceType: string;
  locale: string;
}

export type CreateWatchlistItemForm = FormGroup<{
  searchSymbol: FormControl<AssetIdentifier | null>;
}>;
