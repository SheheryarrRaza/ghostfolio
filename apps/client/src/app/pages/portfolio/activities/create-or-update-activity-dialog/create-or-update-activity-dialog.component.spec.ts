import 'reflect-metadata';
import '@angular/localize/init';

// `@ionic/core` ships a CommonJS-incompatible ESM bundle that the Jest
// transform for this project does not process, so any (transitive) import
// of `@ionic/angular/standalone` / `ionicons` breaks module resolution in
// this test environment. The dialog component only uses these packages to
// render icons, which is irrelevant for this spec, so they are stubbed out
// with a trivial standalone component / no-op functions.
import { Component as AngularComponent } from '@angular/core';

@AngularComponent({
  selector: 'ion-icon',
  standalone: true,
  template: ''
})
class IonIconStub {}

jest.mock('@ionic/angular/standalone', () => ({
  IonIcon: IonIconStub
}));
jest.mock('ionicons', () => ({ addIcons: () => undefined }));
jest.mock('ionicons/icons', () => ({
  calendarClearOutline: 'calendar-clear-outline',
  refreshOutline: 'refresh-outline'
}));

import { ImpersonationStorageService } from '@ghostfolio/client/services/impersonation-storage.service';
import { UserService } from '@ghostfolio/client/services/user/user.service';
import { DataService } from '@ghostfolio/ui/services';

import { TestBed } from '@angular/core/testing';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { GfCreateOrUpdateActivityDialogComponent } from './create-or-update-activity-dialog.component';

function createComponent({
  locale
}: {
  locale: string;
}): GfCreateOrUpdateActivityDialogComponent {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: ImpersonationStorageService,
        useValue: { getId: () => null }
      },
      {
        provide: UserService,
        useValue: { get: () => ({ subscribe: () => undefined }) }
      },
      {
        provide: DataService,
        useValue: {
          fetchInfo: () => ({ currencies: ['USD'] }),
          fetchPortfolioHoldings: () => ({
            pipe: () => ({ subscribe: () => undefined })
          })
        }
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          accounts: [],
          activity: {},
          user: { settings: { locale }, tags: [] }
        }
      },
      { provide: MatDialogRef, useValue: { close: () => undefined } },
      { provide: DateAdapter, useValue: { setLocale: () => undefined } },
      { provide: MAT_DATE_LOCALE, useValue: locale }
    ]
  });

  // The full template pulls in several child components (account selector,
  // symbol autocomplete, tags selector, etc.) that each require their own
  // set of providers to render. Since this spec only targets the paste
  // handling logic on the component class, the template is replaced with a
  // minimal stand-in so that only the providers relevant to that logic need
  // to be supplied.
  TestBed.overrideComponent(GfCreateOrUpdateActivityDialogComponent, {
    set: { template: '<div></div>' }
  });

  const fixture = TestBed.createComponent(
    GfCreateOrUpdateActivityDialogComponent
  );

  fixture.componentInstance.ngOnInit();

  return fixture.componentInstance;
}

function createPasteEvent(text: string): ClipboardEvent {
  return {
    clipboardData: { getData: () => text },
    preventDefault: jest.fn()
  } as unknown as ClipboardEvent;
}

describe('GfCreateOrUpdateActivityDialogComponent', () => {
  describe('onUnitPricePaste', () => {
    it('parses a localized value with a thousands separator (de-DE)', () => {
      const component = createComponent({ locale: 'de-DE' });
      const event = createPasteEvent('1.234,50');

      (component as any).onUnitPricePaste(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(
        (component as any).activityForm.get('unitPrice')?.value
      ).toBe(1234.5);
    });

    it('still parses a plain value correctly (en-US)', () => {
      const component = createComponent({ locale: 'en-US' });
      const event = createPasteEvent('1234.5');

      (component as any).onUnitPricePaste(event);

      expect(
        (component as any).activityForm.get('unitPrice')?.value
      ).toBe(1234.5);
    });
  });
});
