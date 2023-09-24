import { TestBed } from '@angular/core/testing';

import { ActDefUtilityDataService } from './act-def-utility-data.service';

describe('ActDefUtilityDataService', () => {
  let service: ActDefUtilityDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActDefUtilityDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
