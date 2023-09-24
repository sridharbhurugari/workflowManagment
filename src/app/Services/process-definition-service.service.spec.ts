import { TestBed } from '@angular/core/testing';

import { ProcessDefinitionServiceService } from './process-definition-service.service';

describe('ProcessDefinitionServiceService', () => {
  let service: ProcessDefinitionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessDefinitionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
