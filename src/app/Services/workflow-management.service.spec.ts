import { TestBed } from '@angular/core/testing';

import { WorkflowManagementService } from './workflow-management.service';

describe('WorkflowManagementService', () => {
  let service: WorkflowManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkflowManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
