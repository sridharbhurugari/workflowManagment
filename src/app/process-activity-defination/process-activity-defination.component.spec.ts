import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessActivityDefinationComponent } from './process-activity-defination.component';

describe('ProcessActivityDefinationComponent', () => {
  let component: ProcessActivityDefinationComponent;
  let fixture: ComponentFixture<ProcessActivityDefinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessActivityDefinationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessActivityDefinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
