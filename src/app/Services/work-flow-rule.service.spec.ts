import { TestBed } from '@angular/core/testing';

import { WorkFlowRuleService } from './work-flow-rule.service';

describe('WorkFlowRuleService', () => {
  let service: WorkFlowRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkFlowRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
