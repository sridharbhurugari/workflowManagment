import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowManagementSystemComponent } from './workflow-management-system.component';

describe('HomeComponent', () => {
  let component: WorkflowManagementSystemComponent;
  let fixture: ComponentFixture<WorkflowManagementSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkflowManagementSystemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowManagementSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
