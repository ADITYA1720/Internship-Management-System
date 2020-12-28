import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusTeacherComponent } from './status-teacher.component';

describe('StatusTeacherComponent', () => {
  let component: StatusTeacherComponent;
  let fixture: ComponentFixture<StatusTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
