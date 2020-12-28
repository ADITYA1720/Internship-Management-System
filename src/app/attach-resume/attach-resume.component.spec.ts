import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachResumeComponent } from './attach-resume.component';

describe('AttachResumeComponent', () => {
  let component: AttachResumeComponent;
  let fixture: ComponentFixture<AttachResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachResumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
