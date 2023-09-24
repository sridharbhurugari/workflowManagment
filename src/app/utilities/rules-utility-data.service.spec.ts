import { TestBed } from '@angular/core/testing';

import { RulesUtilityDataService } from './rules-utility-data.service';

describe('RulesUtilityDataService', () => {
  let service: RulesUtilityDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RulesUtilityDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
