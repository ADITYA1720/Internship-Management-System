import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExternalApplicationComponent } from './view-external-application.component';

describe('ViewExternalApplicationComponent', () => {
  let component: ViewExternalApplicationComponent;
  let fixture: ComponentFixture<ViewExternalApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewExternalApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExternalApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
