import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDefinationComponent } from './activity-defination.component';

describe('ActivityDefinationComponent', () => {
  let component: ActivityDefinationComponent;
  let fixture: ComponentFixture<ActivityDefinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivityDefinationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDefinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
