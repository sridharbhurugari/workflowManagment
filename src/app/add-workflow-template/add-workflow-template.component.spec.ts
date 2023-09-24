import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkflowTemplateComponent } from './add-workflow-template.component';

describe('AddWorkflowTemplateComponent', () => {
  let component: AddWorkflowTemplateComponent;
  let fixture: ComponentFixture<AddWorkflowTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkflowTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkflowTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
