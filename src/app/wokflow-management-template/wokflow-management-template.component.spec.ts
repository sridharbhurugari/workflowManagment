import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WokflowManagementTemplateComponent } from './wokflow-management-template.component';

describe('WokflowManagementTemplateComponent', () => {
  let component: WokflowManagementTemplateComponent;
  let fixture: ComponentFixture<WokflowManagementTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WokflowManagementTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WokflowManagementTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
