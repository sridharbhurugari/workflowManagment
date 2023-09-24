import { TestBed } from '@angular/core/testing';

import { WmsUtilityDataService } from './wms-utility-data.service';

describe('WmsUtilityDataService', () => {
  let service: WmsUtilityDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WmsUtilityDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
