import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewResponsesComponent } from './view-responses.component';

describe('ViewResponsesComponent', () => {
  let component: ViewResponsesComponent;
  let fixture: ComponentFixture<ViewResponsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewResponsesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
