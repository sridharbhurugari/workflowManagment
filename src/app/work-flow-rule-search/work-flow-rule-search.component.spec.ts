import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowRuleSearchComponent } from './work-flow-rule-search.component';

describe('WorkFlowRuleSearchComponent', () => {
  let component: WorkFlowRuleSearchComponent;
  let fixture: ComponentFixture<WorkFlowRuleSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowRuleSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFlowRuleSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
