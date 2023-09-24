import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowRulesComponent } from './work-flow-rules.component';

describe('WorkFlowRulesComponent', () => {
  let component: WorkFlowRulesComponent;
  let fixture: ComponentFixture<WorkFlowRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFlowRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
