import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActivityDefinationComponent } from './add-activity-defination.component';

describe('AddActivityDefinationComponent', () => {
  let component: AddActivityDefinationComponent;
  let fixture: ComponentFixture<AddActivityDefinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddActivityDefinationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActivityDefinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
