import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionMaintenanceComponent } from './question-maintenance.component';

describe('QuestionMaintenanceComponent', () => {
  let component: QuestionMaintenanceComponent;
  let fixture: ComponentFixture<QuestionMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
